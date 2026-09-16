// Now that all business data lives in the browser's own localStorage
// (see src/lib/localApi.ts) instead of a server, it's safe — and
// necessary — to cache the app's static files for real offline use.
// Strategy: cache-first, falling back to network and caching whatever
// comes back. The very first page visited needs a network connection
// once; after that, every visited page works with no connection at all.
// (This only matters for the installed-as-a-web-app path — the Android
// .apk ships these files inside the package, so it never needs this at
// all.)

const CACHE_NAME = "furnecia-shell-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(["/", "/manifest.webmanifest"]).catch(() => {}))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
