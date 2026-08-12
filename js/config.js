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
  freeDeliveryNote: "Free UK Delivery on selected items",
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
