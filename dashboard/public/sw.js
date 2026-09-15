// Minimal service worker — registered only so Android Chrome recognizes this
// as an installable PWA. It deliberately does NOT cache anything: this is a
// live orders/payments dashboard, and caching stale API responses would be
// actively harmful (showing an old "pending" balance, etc.), so every
// request just passes straight through to the network.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // No-op: let the browser handle the request normally.
});
