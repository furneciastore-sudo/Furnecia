// ============================================================
// SITE CONFIG — apni details yahan badal sakte hain
// ============================================================
const SITE = {
  name: "Furnecia",
  whatsappNumber: "447947781613", // country code ke sath, "+" ya spaces nahi
  email: "furneciastore@gmail.com",
  phoneDisplay: "+44 7947 781613",
  address: "Office 15399, 182-184 High Street North, East Ham, London E6 2JA, United Kingdom",
  currencySymbol: "£",
  freeDeliveryNote: "Free Delivery in England &middot; £20 to Wales &middot; £30 to Scotland",
  deliveryNotePlain: "Free delivery in England. £20 to Wales, £30 to Scotland.",

  // ---- Homepage hero video (optional) ----
  // Drop an MP4 into videos/hero.mp4 (see js/product-videos.js for specs
  // and product-page video setup) and set this to "videos/hero.mp4" — the
  // homepage hero plays it muted/looped instead of the static photo. Leave
  // blank to keep the current image; nothing breaks either way.
  heroVideoUrl: "",

  // ---- Shopify headless backend (live products, cart, checkout) ----
  // Fill these in from Shopify Admin: Settings -> Apps and sales channels ->
  // Develop apps -> (your app) -> API credentials -> Storefront API access token.
  // shopifyDomain is your *.myshopify.com domain, not furnecia.com.
  // Leaving storefrontToken empty means the site falls back to the static
  // product catalogue baked into js/products.js — nothing breaks either way.
  shopifyDomain: "",
  storefrontToken: "",

  // ---- Automatic order email (EmailJS, no server needed) ----
  // Sends the Cash on Delivery order straight to your inbox the moment a
  // customer places it — no click needed from them. Free to set up:
  //   1. Sign up at emailjs.com, add this Gmail as an "Email Service".
  //   2. Create an Email Template using variables: subject, message,
  //      customer_name, customer_phone, customer_email, customer_address,
  //      customer_city, order_notes.
  //   3. Fill in the three values below from EmailJS's dashboard.
  // Leaving any of these blank means the "Send Order via Email" button
  // falls back to opening the customer's own email app instead — nothing
  // breaks either way, it just needs their tap.
  emailjsPublicKey: "DR3SM_WQtlbAK-F9y",
  emailjsServiceId: "service_vtp635h",
  emailjsTemplateId: "template_e8elpbn",

  // ---- Marketing tracking (optional, all off until filled in) ----
  // metaPixelId: Meta Events Manager -> your Pixel -> Pixel ID (numbers only).
  // ga4MeasurementId: Google Analytics 4 -> Admin -> Data Streams -> your
  //   stream -> Measurement ID (looks like "G-XXXXXXXXXX").
  // For Shopify's own hosted checkout page, don't add IDs here for that —
  // instead connect the free "Google & YouTube" and "Facebook & Instagram"
  // sales channel apps in Shopify Admin, which handle GA4 + Meta Pixel/CAPI
  // on checkout automatically. The IDs below only cover pages on this site
  // (product/collection pages, cart) which are outside Shopify's domain.
  metaPixelId: "",
  ga4MeasurementId: "",
};

function waLink(message) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function mailLink(subject, body) {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function formatPrice(amount) {
  return `${SITE.currencySymbol}${Number(amount).toFixed(2)}`;
}

// Ask Shopify's CDN for an appropriately-sized image instead of the
// full original (which can be several MB) — keeps photos sharp
// without the slow page loads that full-resolution everywhere causes.
function shopifyImg(url, width) {
  if (!url || url.startsWith("data:")) return url;
  return url + (url.includes("?") ? "&" : "?") + "width=" + width;
}

function formatDateShort(d) {
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

// Skips Sat/Sun. minDays/maxDays = working days from today.
function addWorkingDays(startDate, days) {
  const d = new Date(startDate);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d;
}

function deliveryEstimateText() {
  const today = new Date();
  const from = addWorkingDays(today, 3);
  const to = addWorkingDays(today, 5);
  return `${formatDateShort(from)} – ${formatDateShort(to)}`;
}
