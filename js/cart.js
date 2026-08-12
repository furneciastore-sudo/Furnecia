// ============================================================
// CART — localStorage me store hota hai, koi backend nahi chahiye
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

function addToCart(handle, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.handle === handle);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ handle, qty });
  }
  saveCart(cart);
}

function removeFromCart(handle) {
  saveCart(getCart().filter(i => i.handle !== handle));
}

function updateQty(handle, qty) {
  const cart = getCart();
  const item = cart.find(i => i.handle === handle);
  if (!item) return;
  if (qty <= 0) {
    saveCart(cart.filter(i => i.handle !== handle));
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
    .map(i => ({ ...i, product: getProductByHandle(i.handle) }))
    .filter(i => i.product);
}

function cartTotal() {
  return cartItemsWithDetails().reduce((sum, i) => sum + i.product.price * i.qty, 0);
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
