// ============================================================
// Live Shopify backend: real product/stock data + real cart +
// real (Cash on Delivery) checkout, via the public Storefront API.
//
// Nothing here breaks the site if SITE.storefrontToken is empty —
// initProducts() just resolves immediately and the static catalogue
// in js/products.js (already loaded before this file) stays in use.
// Once a token is set, PRODUCTS/CATEGORIES are mutated in place with
// live Shopify data, so every page that reads PRODUCTS picks it up
// automatically with no other changes.
// ============================================================

const SHOPIFY_API_VERSION = "2025-10";

function shopifyConfigured() {
  return Boolean(SITE.shopifyDomain && SITE.storefrontToken);
}

async function shopifyStorefrontFetch(query, variables) {
  const res = await fetch(`https://${SITE.shopifyDomain}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SITE.storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Storefront API HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error("Storefront API error: " + JSON.stringify(json.errors));
  return json.data;
}

const PRODUCTS_QUERY = `
  query Products($cursor: String) {
    products(first: 100, after: $cursor) {
      edges {
        node {
          handle
          title
          productType
          descriptionHtml
          tags
          images(first: 10) { edges { node { url altText } } }
          options { name values }
          metafields(identifiers: [{ namespace: "reviews", key: "rating" }, { namespace: "reviews", key: "rating_count" }]) {
            key
            value
          }
          variants(first: 25) {
            edges {
              node {
                id
                title
                availableForSale
                price { amount }
                compareAtPrice { amount }
                image { url }
              }
            }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

function stripHtml(html) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function shopifyProductToLocal(node) {
  const images = node.images.edges.map(e => e.node.url);
  const variants = node.variants.edges.map(e => ({
    id: e.node.id,
    title: e.node.title,
    price: parseFloat(e.node.price.amount),
    compareAtPrice: e.node.compareAtPrice ? parseFloat(e.node.compareAtPrice.amount) : null,
    image: e.node.image ? e.node.image.url : null,
    available: e.node.availableForSale,
  }));
  const first = variants[0] || { price: 0, compareAtPrice: null };
  const options = (node.options || []).filter(o => o.name !== "Title").map(o => ({ name: o.name, values: o.values }));

  // Live rating from the free "Product Reviews" app (Settings -> Apps ->
  // install "Product Reviews" by Shopify): once installed and real
  // reviews come in, js/reviews.js prefers these over the placeholder
  // rating shown today. Absent/unparsable metafields are just skipped —
  // no app installed yet means this stays null and nothing changes.
  let liveRating = null;
  let liveRatingCount = null;
  (node.metafields || []).filter(Boolean).forEach(mf => {
    if (mf.key === "rating") {
      try { liveRating = parseFloat(JSON.parse(mf.value).value); } catch (e) { /* ignore */ }
    } else if (mf.key === "rating_count") {
      const n = parseInt(mf.value, 10);
      if (!isNaN(n)) liveRatingCount = n;
    }
  });

  return {
    handle: node.handle,
    title: node.title,
    category: node.productType || "Furniture",
    description: stripHtml(node.descriptionHtml),
    images: images.length ? images : ["images/placeholder.jpg"],
    options,
    variants,
    price: first.price,
    compareAtPrice: first.compareAtPrice || undefined,
    bestseller: node.tags.map(t => t.toLowerCase()).includes("bestseller"),
    sale: Boolean(first.compareAtPrice && first.compareAtPrice > first.price),
    liveRating: liveRatingCount ? liveRating : null,
    liveRatingCount: liveRatingCount || null,
  };
}

async function fetchAllLiveProducts() {
  const all = [];
  let cursor = null;
  let hasNext = true;
  while (hasNext) {
    const data = await shopifyStorefrontFetch(PRODUCTS_QUERY, { cursor });
    data.products.edges.forEach(e => all.push(shopifyProductToLocal(e.node)));
    hasNext = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }
  return all;
}

const LIVE_CACHE_KEY = "furnecia_live_products_v1";
const LIVE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function readLiveCache() {
  try {
    const raw = sessionStorage.getItem(LIVE_CACHE_KEY);
    if (!raw) return null;
    const { at, products } = JSON.parse(raw);
    if (Date.now() - at > LIVE_CACHE_TTL_MS) return null;
    return products;
  } catch (e) {
    return null;
  }
}

function writeLiveCache(products) {
  try {
    sessionStorage.setItem(LIVE_CACHE_KEY, JSON.stringify({ at: Date.now(), products }));
  } catch (e) { /* storage full/unavailable — fine, just skip caching */ }
}

function replaceProductsInPlace(liveProducts) {
  PRODUCTS.length = 0;
  liveProducts.forEach(p => PRODUCTS.push(p));
  const cats = [...new Set(PRODUCTS.map(p => p.category))];
  CATEGORIES.length = 0;
  cats.forEach(c => CATEGORIES.push(c));
}

// Resolves once product data is as fresh as it's going to get for this
// page load — either mutated in place with live Shopify data, or left
// as the static fallback if Shopify isn't configured / unreachable.
window.productsReady = (async () => {
  if (!shopifyConfigured()) return;
  try {
    const cached = readLiveCache();
    if (cached) {
      replaceProductsInPlace(cached);
      return;
    }
    const live = await fetchAllLiveProducts();
    if (live.length) {
      replaceProductsInPlace(live);
      writeLiveCache(live);
    }
  } catch (err) {
    console.warn("Live Shopify product fetch failed, using static catalogue:", err);
  }
})();
