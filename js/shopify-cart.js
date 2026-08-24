// ============================================================
// Real checkout, handed off to Shopify's own hosted checkout page.
//
// The local cart (js/cart.js, localStorage) stays the source of truth
// while shopping — it works with zero backend. At the moment the
// customer wants to actually pay, we build a real Shopify Cart from
// those line items and send them to cart.checkoutUrl: Shopify's own
// checkout, with live stock, discount codes, and (once Cash on
// Delivery is enabled in Settings -> Payments) no card details asked
// for. The order lands in Shopify Admin like any other order.
//
// If SITE.storefrontToken isn't set, or a variant's live Shopify ID
// isn't known (e.g. still on the static product catalogue), this
// quietly does nothing and the existing WhatsApp/Email checkout on
// cart.html keeps working exactly as before.
// ============================================================

const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

function shopifyCartLinesFromLocal() {
  return cartItemsWithDetails()
    .filter(i => i.variant && i.variant.id)
    .map(i => ({ merchandiseId: i.variant.id, quantity: i.qty }));
}

// True only when every current cart line has a live Shopify variant ID
// to check out with (i.e. Storefront data loaded successfully).
function shopifyCheckoutAvailable() {
  if (!shopifyConfigured()) return false;
  const items = cartItemsWithDetails();
  return items.length > 0 && items.every(i => i.variant && i.variant.id);
}

async function goToShopifyCheckout() {
  const lines = shopifyCartLinesFromLocal();
  if (!lines.length) return;
  const data = await shopifyStorefrontFetch(CART_CREATE_MUTATION, { lines });
  const result = data.cartCreate;
  if (result.userErrors && result.userErrors.length) {
    throw new Error("Shopify cart error: " + result.userErrors.map(e => e.message).join("; "));
  }
  window.location.href = result.cart.checkoutUrl;
}
