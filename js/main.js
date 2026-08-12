// ============================================================
// Shared page behaviour: mobile nav, product card rendering
// ============================================================

function productCardHTML(p) {
  return `
    <a href="product.html?handle=${encodeURIComponent(p.handle)}" class="product-card">
      <div class="product-card-img">
        <img src="${p.image}" alt="${p.title}" loading="lazy" width="600" height="600">
      </div>
      <div class="product-card-info">
        <h3 class="product-card-name">${p.title}</h3>
        <span class="product-card-price">${formatPrice(p.price)}</span>
      </div>
    </a>
  `;
}

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".main-nav");
  if (toggle && menu) {
    toggle.addEventListener("click", () => menu.classList.toggle("open"));
  }

  // Set WhatsApp float button + header links dynamically from config
  document.querySelectorAll("[data-wa-link]").forEach(el => {
    const msg = el.getAttribute("data-wa-link") || "Hi Furnecia, I'd like to ask about one of your products.";
    el.href = waLink(msg);
  });
  document.querySelectorAll("[data-mail-link]").forEach(el => {
    el.href = `mailto:${SITE.email}`;
  });
  document.querySelectorAll("[data-phone-link]").forEach(el => {
    el.href = `tel:+${SITE.whatsappNumber}`;
  });
  document.querySelectorAll("[data-shop-email]").forEach(el => { el.textContent = SITE.email; });
  document.querySelectorAll("[data-shop-phone]").forEach(el => { el.textContent = SITE.phoneDisplay; });
  document.querySelectorAll("[data-shop-address]").forEach(el => { el.textContent = SITE.address; });
});
