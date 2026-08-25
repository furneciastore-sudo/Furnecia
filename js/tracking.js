// ============================================================
// Cookie consent + marketing pixels (Meta Pixel, GA4) for pages on
// this site. Shopify's own checkout page is tracked separately —
// connect the free "Google & YouTube" and "Facebook & Instagram"
// sales channel apps in Shopify Admin for that (handles GA4 + Meta
// CAPI on checkout/purchase automatically, no code needed here).
//
// Nothing loads until the visitor accepts cookies, and nothing loads
// at all if SITE.metaPixelId / SITE.ga4MeasurementId are left empty.
// ============================================================

const CONSENT_KEY = "furnecia_cookie_consent"; // "accepted" | "rejected"

function getCookieConsent() {
  try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
}

function setCookieConsent(value) {
  try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* ignore */ }
}

function trackingConfigured() {
  return Boolean(SITE.metaPixelId || SITE.ga4MeasurementId);
}

function loadMetaPixel() {
  if (!SITE.metaPixelId || window.fbq) return;
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  fbq('init', SITE.metaPixelId);
  fbq('track', 'PageView');
}

function loadGA4() {
  if (!SITE.ga4MeasurementId || window.gtag) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${SITE.ga4MeasurementId}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', SITE.ga4MeasurementId);
}

function loadTrackingScripts() {
  loadMetaPixel();
  loadGA4();
}

// Fires a marketing event to whichever pixels are loaded. Standard Meta
// event names: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase.
function trackEvent(eventName, params = {}) {
  if (getCookieConsent() !== "accepted") return;
  if (window.fbq) fbq('track', eventName, params);
  if (window.gtag) {
    const ga4EventMap = { ViewContent: "view_item", AddToCart: "add_to_cart", InitiateCheckout: "begin_checkout", Purchase: "purchase" };
    gtag('event', ga4EventMap[eventName] || eventName, params);
  }
}

function renderCookieBanner() {
  if (!trackingConfigured() || getCookieConsent()) return;
  const bar = document.createElement("div");
  bar.className = "cookie-banner";
  bar.innerHTML = `
    <p>We use cookies for essential site features and, if you accept, for marketing analytics. See how your data is used.</p>
    <div class="cookie-banner-actions">
      <button type="button" class="btn btn-secondary" id="cookie-reject">Reject</button>
      <button type="button" class="btn btn-solid" id="cookie-accept">Accept</button>
    </div>
  `;
  document.body.appendChild(bar);
  document.getElementById("cookie-accept").addEventListener("click", () => {
    setCookieConsent("accepted");
    bar.remove();
    loadTrackingScripts();
  });
  document.getElementById("cookie-reject").addEventListener("click", () => {
    setCookieConsent("rejected");
    bar.remove();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCookieBanner();
  if (getCookieConsent() === "accepted") loadTrackingScripts();
});
