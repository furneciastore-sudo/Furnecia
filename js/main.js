// ============================================================
// Shared page behaviour: mobile nav, product cards, image fallback, live chat bubble
// ============================================================

// Grey "image unavailable" placeholder — used if a product photo fails to load,
// so a broken image never shows a broken-image icon to a customer.
const IMG_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="#f3f1ee"/><text x="50%" y="50%" font-family="sans-serif" font-size="22" fill="#b5502e" text-anchor="middle" dominant-baseline="middle">Furnecia</text></svg>`
  );

function imgFallbackAttr() {
  return `onerror="this.onerror=null;this.src='${IMG_FALLBACK}';"`;
}

function productCardHTML(p) {
  const onSale = p.sale && p.compareAtPrice;
  const badge = onSale ? `<span class="product-card-badge">Save ${discountPercent(p)}%</span>` : "";
  const wasPrice = onSale ? `<span class="product-card-was">${formatPrice(p.compareAtPrice)}</span>` : "";
  return `
    <a href="product.html?handle=${encodeURIComponent(p.handle)}" class="product-card">
      <div class="product-card-img">
        ${badge}
        <img src="${shopifyImg(p.images[0], 600)}" alt="${p.title}" loading="lazy" width="600" height="600" ${imgFallbackAttr()}>
      </div>
      <div class="product-card-info">
        <h3 class="product-card-name">${p.title}</h3>
        ${ratingRowHTML(p.handle)}
        <div class="product-card-price-row">
          <span class="product-card-price">${formatPrice(p.price)}</span>
          ${wasPrice}
        </div>
      </div>
    </a>
  `;
}

function dealCardHTML(p) {
  const onSale = p.sale && p.compareAtPrice;
  const priceRow = onSale
    ? `<span class="deal-price-now">${formatPrice(p.price)}</span>
       <span class="deal-price-was">${formatPrice(p.compareAtPrice)}</span>
       <span class="deal-off">Save ${discountPercent(p)}%</span>`
    : `<span class="deal-price-now">${formatPrice(p.price)}</span>`;
  return `
    <a href="product.html?handle=${encodeURIComponent(p.handle)}" class="deal-card">
      <div class="deal-card-img"><img src="${shopifyImg(p.images[0], 300)}" alt="${p.title}" loading="lazy" ${imgFallbackAttr()}></div>
      <div class="deal-card-info">
        <h4>${p.title}</h4>
        <div class="deal-price-row">${priceRow}</div>
      </div>
    </a>
  `;
}

function renderDealsStrip(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const deals = saleProducts().slice(0, 14);
  if (!deals.length) { el.style.display = "none"; return; }
  el.innerHTML = `
    <div class="deals-strip-label"><span class="eyebrow">While Stock Lasts</span></div>
    <div class="deals-track-wrap">
      <div class="deals-track">${deals.map(dealCardHTML).join("")}</div>
    </div>
  `;
}

// Generic horizontal slider — used for category showcases like "Sofa Collection".
function renderProductSlider(targetId, products, label) {
  const el = document.getElementById(targetId);
  if (!el) return;
  if (!products.length) { el.style.display = "none"; return; }
  el.innerHTML = `
    <div class="deals-strip-label"><span class="eyebrow">${label}</span></div>
    <div class="deals-track-wrap">
      <div class="deals-track">${products.map(dealCardHTML).join("")}</div>
    </div>
  `;
}

function signatureCardHTML(p) {
  return `
    <a href="product.html?handle=${encodeURIComponent(p.handle)}" class="signature-card">
      <div class="signature-card-img">
        <img src="${shopifyImg(p.images[0], 900)}" alt="${p.title}" loading="lazy" ${imgFallbackAttr()}>
      </div>
      <div class="signature-card-info">
        <span class="signature-card-eyebrow">${p.category}</span>
        <h3 class="signature-card-name">${p.title}</h3>
        <div class="signature-card-price">${formatPrice(p.price)}</div>
        <span class="signature-card-link">Shop Now</span>
      </div>
    </a>
  `;
}

function renderSignatureCollection(targetId, products) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.innerHTML = products.map(signatureCardHTML).join("");
}

function relatedProductsHTML(product, count) {
  const pool = PRODUCTS.filter(p => p.handle !== product.handle && p.category === product.category);
  const chosen = pool.length >= count ? pool : PRODUCTS.filter(p => p.handle !== product.handle);
  const picked = [];
  const seed = hashSeed(product.handle);
  const shuffled = chosen.slice().sort((a, b) => hashSeed(a.handle + seed) - hashSeed(b.handle + seed));
  for (const p of shuffled) {
    if (picked.length >= count) break;
    picked.push(p);
  }
  if (!picked.length) return "";
  return `
    <section class="related-section">
      <div class="section-inner">
        <h2 class="section-title" style="font-size:24px;">You May Also Like</h2>
      </div>
      <div class="product-grid related-grid">${picked.map(productCardHTML).join("")}</div>
    </section>
  `;
}

function initChatBubble() {
  const waBtn = document.getElementById("wa-float-btn") || document.querySelector(".whatsapp-btn");
  if (!waBtn) return;
  if (sessionStorage.getItem("furnecia_chat_dismissed")) return;

  setTimeout(() => {
    if (document.getElementById("chat-bubble")) return;
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.id = "chat-bubble";
    bubble.innerHTML = `
      <button class="chat-bubble-close" aria-label="Close">&times;</button>
      <strong>Need help? 👋</strong>
      Chat with our team live on WhatsApp — usually replies within minutes.
      <a class="chat-bubble-cta" href="${waBtn.href || "#"}" target="_blank" rel="noopener noreferrer">Start chat</a>
    `;
    document.body.appendChild(bubble);
    bubble.querySelector(".chat-bubble-close").addEventListener("click", () => {
      bubble.remove();
      sessionStorage.setItem("furnecia_chat_dismissed", "1");
    });
  }, 4000);
}

document.addEventListener("DOMContentLoaded", function () {
  // nav-toggle click handling lives in layout.js (it owns the injected header)

  document.querySelectorAll("[data-wa-link]").forEach(el => {
    const msg = el.getAttribute("data-wa-link") || "Hi Furnecia, I'd like to ask about one of your products.";
    el.href = waLink(msg);
    el.id = el.id || "wa-float-btn";
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

  initChatBubble();
});
