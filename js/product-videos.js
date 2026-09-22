// ============================================================
// Per-product videos — a simple handle -> file mapping, independent
// of whether product data comes from the static catalogue or live
// Shopify (works with both, since it's applied after either loads).
//
// HOW TO ADD A VIDEO TO A PRODUCT:
//   1. Get the product's handle (the part after ?handle= in its URL,
//      e.g. product.html?handle=paradise-sofabed-grey -> the handle
//      is "paradise-sofabed-grey").
//   2. Put the video file in videos/products/<handle>.mp4 (create the
//      videos/products folder if it doesn't exist yet).
//   3. Add a line below: "that-handle": "videos/products/that-handle.mp4",
//
// Specs that work well on a phone connection: MP4 (H.264), under
// ~15MB, 15-30 seconds, landscape or square. Longer/bigger files will
// just load slowly for shoppers — trim before adding.
//
// Nothing here does anything until you add an entry — this file
// starts empty on purpose.
// ============================================================

const PRODUCT_VIDEOS = {
  // "paradise-sofabed-grey": "videos/products/paradise-sofabed-grey.mp4",
};

function applyProductVideos() {
  if (typeof PRODUCTS === "undefined") return;
  PRODUCTS.forEach(p => {
    if (PRODUCT_VIDEOS[p.handle]) p.video = PRODUCT_VIDEOS[p.handle];
  });
}

// Runs once now (covers the static fallback catalogue, already loaded
// synchronously) and again once live Shopify data replaces PRODUCTS in
// place, so a video attaches correctly either way.
applyProductVideos();
if (window.productsReady) window.productsReady.then(applyProductVideos);
