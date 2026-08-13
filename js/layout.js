// ============================================================
// Shared header + footer, injected on every page.
// Edit nav links / footer links here ONCE and it updates everywhere.
// ============================================================

const HEADER_HTML = `
<div class="top-bar">
  <div class="container">
    <div class="top-bar-contact">
      <a data-phone-link href="#"><span data-shop-phone></span></a>
      <a data-mail-link href="#"><span data-shop-email></span></a>
    </div>
    <div>${"Free UK Delivery on selected items"} &middot; <a href="shop.html">Shop the Sale</a></div>
  </div>
</div>
<header class="site-header">
  <div class="container">
    <nav class="main-nav">
      <a href="shop.html?cat=Sofa%20Beds">Sofa Beds</a>
      <a href="shop.html?cat=Corner%20Sofas">Corner Sofas</a>
      <a href="shop.html?cat=Wardrobes">Wardrobes</a>
      <a href="shop.html?cat=Dining%20Tables">Dining Tables</a>
      <a href="shop.html">All Products</a>
      <a href="finance.html" class="nav-finance">Finance</a>
      <a href="contact.html">Contact</a>
    </nav>
    <a href="index.html" class="logo">Furnecia</a>
    <div class="header-actions">
      <button class="nav-toggle" aria-label="Menu">&#9776;</button>
      <a href="cart.html" class="cart-link">Cart (<span data-cart-count>0</span>)</a>
    </div>
  </div>
</header>
`;

const FOOTER_HTML = `
<footer class="site-footer">
  <div class="footer-top">
    <div class="footer-grid">
      <div class="footer-col">
        <h4>Get in touch</h4>
        <p data-shop-address></p>
        <p><a data-mail-link href="#" data-shop-email></a></p>
        <p><a data-phone-link href="#" data-shop-phone></a></p>
      </div>
      <div class="footer-col">
        <h4>Shop</h4>
        <a href="shop.html?cat=Sofa%20Beds">Sofa Beds</a>
        <a href="shop.html?cat=Corner%20Sofas">Corner Sofas</a>
        <a href="shop.html?cat=Wardrobes">Wardrobes</a>
        <a href="shop.html?cat=Dining%20Tables">Dining Tables</a>
        <a href="shop.html?cat=Outdoor%20Furniture">Outdoor Furniture</a>
      </div>
      <div class="footer-col">
        <h4>Policies</h4>
        <a href="contact.html">Contact Us</a>
        <a href="about.html">About Us</a>
        <a href="#">Refund &amp; Returns Policy</a>
        <a href="#">Shipping Policy</a>
      </div>
      <div class="footer-col footer-newsletter">
        <h4>Newsletter Signup</h4>
        <p>Subscribe and get 10% off your first purchase</p>
        <form onsubmit="event.preventDefault(); alert('Thanks for subscribing!'); this.reset();">
          <input type="email" placeholder="Your email" required>
          <button type="submit">Join</button>
        </form>
      </div>
    </div>
  </div>
  <div class="footer-bottom">Copyright &copy; ${new Date().getFullYear()} <strong>Furnecia</strong> all rights reserved.</div>
</footer>
<a class="whatsapp-btn" id="wa-float-btn" data-wa-link="Hi Furnecia, I'd like to ask about one of your products." target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="30" height="30" fill="#ffffff">
    <path d="M16.004 3C9.096 3 3.5 8.596 3.5 15.504c0 2.63.79 5.078 2.14 7.117L3 29l6.564-2.585a12.44 12.44 0 0 0 6.44 1.77h.004c6.908 0 12.504-5.596 12.504-12.504C28.512 8.773 22.912 3 16.004 3zm0 22.86h-.003a10.34 10.34 0 0 1-5.27-1.443l-.378-.224-3.9 1.536.83-3.848-.246-.395a10.29 10.29 0 0 1-1.593-5.482c0-5.71 4.646-10.356 10.363-10.356 2.768 0 5.368 1.08 7.324 3.037a10.29 10.29 0 0 1 3.033 7.325c0 5.71-4.646 10.356-10.36 10.356zm5.68-7.756c-.312-.156-1.845-.91-2.13-1.015-.286-.104-.494-.156-.702.157-.208.312-.805 1.014-.987 1.222-.182.208-.364.234-.676.078-.312-.156-1.318-.486-2.51-1.55-.928-.828-1.555-1.85-1.737-2.162-.182-.312-.02-.48.137-.636.14-.14.312-.364.468-.546.156-.182.208-.312.312-.52.104-.208.052-.39-.026-.546-.078-.156-.702-1.694-.962-2.32-.253-.61-.512-.526-.702-.536-.182-.008-.39-.01-.598-.01a1.15 1.15 0 0 0-.833.39c-.286.312-1.092 1.068-1.092 2.606s1.118 3.022 1.274 3.23c.156.208 2.2 3.36 5.33 4.71.745.322 1.325.514 1.778.658.747.238 1.427.204 1.964.124.6-.09 1.845-.754 2.105-1.484.26-.73.26-1.354.182-1.484-.078-.13-.286-.208-.598-.364z"/>
  </svg>
</a>
`;

document.addEventListener("DOMContentLoaded", function () {
  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");
  if (headerEl) headerEl.innerHTML = HEADER_HTML;
  if (footerEl) footerEl.innerHTML = FOOTER_HTML;

  // re-run the data-attribute binding now that header/footer exist
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

  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".main-nav");
  if (toggle && menu) toggle.addEventListener("click", () => menu.classList.toggle("open"));

  updateCartCount();
});
