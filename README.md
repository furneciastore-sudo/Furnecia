# Furnecia — Self-Hosted Website (Hostinger ke liye)

Ye aapki asal Shopify store (`furnecia.com`) jaisi hi ek website hai — **HTML/CSS/JavaScript** mein banai gayi hai, taake Hostinger ki normal (shared) hosting par bhi chal sake, koi monthly Shopify fee ke bagair.

- Real products, prices (GBP £), aur images **aapki asal Shopify store se liye gaye hain**.
- Real contact details use hui hain: phone **+44 7947 781613**, email **furneciastore@gmail.com**, address London wala.
- **Cash on Delivery** checkout — koi online payment nahi, order WhatsApp ya Email par jata hai.
- WhatsApp floating button har page par hai.

> ⚠️ Ye site **Shopify se bilkul independent** hai — na cart backend hai, na order database. Order sirf WhatsApp/Email message ban kar customer ke phone se bhejta hai. Beginner ke liye ye sabse aasan tareeqa hai.

---

## 1. Pehle apne computer par dekh lein (bilkul free, koi hosting nahi chahiye)

1. Is folder ko download/clone kar lein.
2. `index.html` file par **double-click** karein — browser mein khul jayegi.
3. Sara site (Home, Shop, Cart, Product, About, Contact) browse kar ke dekh lein.

Agar behtar tareeqe se dekhna hai (VS Code use kar rahe hain), to VS Code mein **"Live Server"** extension install kar ke `index.html` par right-click → "Open with Live Server" karein.

---

## 2. GitHub ke sath connect / files upload karna

Aapka GitHub repo already bana hua hai (`furneciastore-sudo/Furnecia`) aur ye code usi mein push ho chuka hai — is branch ka naam hai:
`claude/shopify-deployment-setup-4qi7mj`

Agar future mein khud se koi file change karni ho aur GitHub par upload karni ho, 2 tareeqe hain:

### A) GitHub website se seedha (sabse aasan, beginner ke liye)
1. GitHub par apne repo `furneciastore-sudo/Furnecia` mein jayein.
2. Jo file change karni hai us par click karein → pencil (✏️) icon "Edit" par click karein.
3. Changes karein → neeche "Commit changes" button dabayein.

### B) Computer se Git commands se
```bash
git clone https://github.com/furneciastore-sudo/Furnecia.git
cd Furnecia
# files edit karein
git add .
git commit -m "update products"
git push
```

---

## 3. Hostinger par TEST deploy karna (live jane se pehle check karne ke liye)

Best tareeqa: Hostinger ke `public_html` ke andar ek **subfolder** bana kar wahan test karein, taake asal domain disturb na ho.

1. **hPanel** (Hostinger control panel) mein login karein.
2. **Files → File Manager** kholein.
3. `public_html` folder ke andar jayein.
4. Ek nayi folder banayein, jaise `test` (to URL banega `furnecia.com/test`).
5. Is repo ki **saari files** (index.html, css/, js/, saare .html) us `test` folder mein upload kar dein:
   - File Manager mein "Upload" button se seedha files/folders drag-drop kar sakte hain, **ya**
   - Sab files ko ek `.zip` bana kar upload karein, phir File Manager mein us zip par right-click → "Extract" karein.
6. Browser mein jayein: `https://furnecia.com/test/index.html` (ya `https://furnecia.com/test/`)
7. Poori site check karein — Home, Shop, product pages, cart, checkout (WhatsApp/Email buttons), sab links.

✅ Agar sab theek chal raha hai to Step 4 (live) par jayein. Agar kuch ghalat lage, mujhe batayein, main fix kar dunga.

---

## 4. Hostinger par LIVE deploy karna

Jab test se satisfied ho jayen:

1. hPanel → **File Manager** → `public_html` folder kholein.
2. Agar wahan pehle se koi purani file/website hai (jaise koi default `index.html` ya WordPress files), unhe pehle **kisi backup folder mein move** kar lein (delete na karein, sirf move karein — taake kuch bhi loss na ho).
3. Ab is site ki saari files (index.html, css/, js/, saare .html) seedha `public_html` ke **root** mein upload kar dein (test folder ki tarah subfolder nahi, seedha andar).
4. Browser mein `https://furnecia.com` khol kar check karein — ab live site yahi dikhegi.

### Agar domain Hostinger par register nahi, kisi aur company se liya hai:
- Domain provider ki settings mein jayein → **Nameservers** section.
- Hostinger ke nameservers daal dein (Hostinger hPanel mein "Domains" section mein ye milte hain, kuch is tarah: `ns1.dns-parking.com`, `ns2.dns-parking.com` — exact values hPanel mein "Nameservers" wale page par milengi).
- DNS update hone mein 1–24 ghante lag sakte hain.

### Agar domain pehle se Shopify ke sath connected hai:
- Jab tak aap Hostinger wali site live nahi karna chahte, Shopify wali site chalti rahegi — koi jaldi nahi.
- Jis din switch karna ho, sirf domain ka DNS/nameserver Hostinger ki taraf point kar dein (upar wala step) — us waqt Shopify store automatically band ho jayega (domain us se hat jayega) aur naya Hostinger wala site chal jayega.

---

## 5. Apni details baad mein kaise badlein

### WhatsApp number / Email / Address
Sirf ye ek file kholein: **`js/config.js`**
```js
const SITE = {
  name: "Furnecia",
  whatsappNumber: "447947781613", // country code ke sath, + ya spaces mat likhein
  email: "furneciastore@gmail.com",
  phoneDisplay: "+44 7947 781613",
  address: "...",
  ...
};
```

### Products (naye add karna / price/image badalna)
Ye file kholein: **`js/products.js`** — har product ek block hai:
```js
{
  handle: "unique-id-no-space",
  title: "Product Name",
  price: 299.0,
  category: "Sofa Beds",
  image: "https://...jpg",
  bestseller: false
},
```
Naya product add karna ho to bas is jaisa ek naya block copy-paste kar ke details badal dein.

### Nav menu / footer links
Ye file kholein: **`js/layout.js`** — `HEADER_HTML` aur `FOOTER_HTML` ke andar links change kar sakte hain.

---

## 6. Site mein kya-kya hai (summary)

| Page | Kaam |
|---|---|
| `index.html` | Homepage — hero, bestsellers, budget finder, why us, FAQ |
| `shop.html` | Poori product catalog, category filter, search |
| `product.html?handle=...` | Single product detail page |
| `cart.html` | Cart + Cash on Delivery checkout form (WhatsApp ya Email se order jata hai) |
| `about.html` | About Furnecia |
| `contact.html` | Contact form (WhatsApp/Email) + address/phone |

Koi bhi cheez ajeeb lagey ya kuch aur add/change karwana ho — bata dein.
