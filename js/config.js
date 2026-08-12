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
