// ============================================================
// Fully automatic order email via EmailJS — no server needed.
//
// Sends the order straight to SITE.email the moment a customer places a
// Cash on Delivery order, with no email client and no tap required from
// them. See the setup steps in js/config.js next to the emailjs* keys.
//
// If those keys are left blank, emailjsConfigured() is false and
// sendOrderEmailAuto() resolves to false without doing anything — the
// caller (js/shopify-cart.js's checkout flow) falls back to opening the
// customer's own email app instead, exactly like before this existed.
// ============================================================

function emailjsConfigured() {
  return !!(SITE.emailjsPublicKey && SITE.emailjsServiceId && SITE.emailjsTemplateId);
}

let emailjsLoadPromise = null;

function ensureEmailjsLoaded() {
  if (!emailjsConfigured()) return Promise.resolve(false);
  if (emailjsLoadPromise) return emailjsLoadPromise;
  emailjsLoadPromise = new Promise((resolve) => {
    if (window.emailjs) {
      window.emailjs.init({ publicKey: SITE.emailjsPublicKey });
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    script.onload = () => {
      window.emailjs.init({ publicKey: SITE.emailjsPublicKey });
      resolve(true);
    };
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return emailjsLoadPromise;
}

// Returns true only if the email was actually sent automatically.
async function sendOrderEmailAuto(orderText, fields) {
  if (!emailjsConfigured()) return false;
  const loaded = await ensureEmailjsLoaded();
  if (!loaded) return false;
  try {
    await window.emailjs.send(SITE.emailjsServiceId, SITE.emailjsTemplateId, {
      to_email: SITE.email,
      subject: "New Cash on Delivery Order — Furnecia",
      message: orderText,
      customer_name: fields.name || "",
      customer_phone: fields.phone || "",
      customer_email: fields.email || "",
      customer_address: fields.address || "",
      customer_city: fields.city || "",
      order_notes: fields.notes || "",
    });
    return true;
  } catch (err) {
    console.error("EmailJS send failed:", err);
    return false;
  }
}
