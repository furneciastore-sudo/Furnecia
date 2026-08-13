// ============================================================
// CART — localStorage me store hota hai, koi backend nahi chahiye
// Each line item is keyed by handle + variantTitle (so two colours
// of the same product sit as separate cart lines).
// ============================================================
const CART_KEY = "furnecia_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(handle, variantTitle, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.handle === handle && i.variantTitle === variantTitle);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ handle, variantTitle, qty });
  }
  saveCart(cart);
}

function removeFromCart(handle, variantTitle) {
  saveCart(getCart().filter(i => !(i.handle === handle && i.variantTitle === variantTitle)));
}

function updateQty(handle, variantTitle, qty) {
  const cart = getCart();
  const item = cart.find(i => i.handle === handle && i.variantTitle === variantTitle);
  if (!item) return;
  if (qty <= 0) {
    saveCart(cart.filter(i => !(i.handle === handle && i.variantTitle === variantTitle)));
  } else {
    item.qty = qty;
    saveCart(cart);
  }
}

function clearCart() {
  saveCart([]);
}

function cartItemsWithDetails() {
  return getCart()
    .map(i => {
      const product = getProductByHandle(i.handle);
      if (!product) return null;
      const variant = getVariant(product, i.variantTitle);
      return { ...i, product, variant };
    })
    .filter(Boolean);
}

function cartTotal() {
  return cartItemsWithDetails().reduce((sum, i) => sum + i.variant.price * i.qty, 0);
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function updateCartCount() {
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = cartCount();
  });
}

document.addEventListener("DOMContentLoaded", updateCartCount);
