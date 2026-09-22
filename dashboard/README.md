# Furnecia Order Management Dashboard

A professional, fully **offline** dashboard for managing customer orders,
vendors, deliveries, payments, floor/fitting charges and your
commission/profit — built so nothing has to be calculated by hand, and
nothing needs an internet connection to run.

This lives in `dashboard/` alongside the existing `furnecia.com` storefront
(the static HTML site in the repo root). They are two separate
applications: the storefront is a public site for customers, this
dashboard is a private, offline tool for you (the business owner). It is
not linked to or published on the public website.

---

## 1. Technology stack (and why)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router, TypeScript), built as a **static export** | Produces a plain HTML/CSS/JS site with no server required at all — the same build works as a website, an installable PWA, or bundled straight into an Android `.apk`. |
| Data storage | **The browser's own local storage** (`src/lib/localApi.ts`) | Every order, vendor, product, payment, reminder and setting lives on the device itself. No database to host, no monthly cost, no internet dependency, works the moment the app opens. |
| Styling | **Tailwind CSS** + self-hosted **Inter** font | Fast to build a clean, consistent, mobile-responsive UI. |
| Charts | **Recharts** | Lightweight charts for the Profit Dashboard. |
| AI Auto-fill | **Claude or ChatGPT**, called directly from the browser with your own API key (`src/lib/aiOrderParser.ts`) | Optional: reads a free-text order description and fills the Add Order form. The only feature that needs internet — see §9. |

This is about as low-cost and low-maintenance as it gets: no server bill,
no database to manage, no accounts, nothing to keep running.

---

## 2. Data structure

`src/lib/models.ts` defines the same six record types the original
brief's "Google Sheets" structure described — **Order**, **Vendor**,
**Product**, **Setting**, **Payment**, **Reminder** — except each is a
plain JSON array stored under its own key in `localStorage`
(`src/lib/localStore.ts`).

Nothing about pricing is hard-coded: floor charges, the lift rule, the
default fitting charge, commission type/value, currency symbol and
business contact details all live in `Setting` and are edited from
**Settings** in the UI (`src/lib/settingsShared.ts` holds the defaults
used before you've changed anything).

All the calculation logic (floor charge → fitting charge → customer total
→ customer pending → vendor total → vendor pending → gross/net profit →
commission) lives in one place, **`src/lib/calculations.ts`**, and is used
by both `src/lib/localApi.ts` (when you save an order) and the live
"Automatic Calculation" preview in the order form, so the number you see
while typing is always the number that gets saved.

**`src/lib/localApi.ts`** is the entire "backend" — every function does
exactly what a server API route would, just reading/writing local storage
instead of a database. **`src/lib/localFetch.ts`** is a drop-in
replacement for `fetch()` used throughout the UI, so components still
call `fetch('/api/orders', ...)` and read `res.json()` exactly as they
would against a real API — it just resolves locally instead of over the
network.

---

## 3. Data portability (the "Google Sheets" question)

Because this is now a genuinely offline, single-device app, there is no
live server for Google Sheets to sync against. What's still built in:

- **Export CSV** (Orders page, and used internally by several reports) —
  downloads every order in the same column layout the original brief's
  "Orders" sheet described. Open it directly, or drag it into Google
  Sheets (File → Import → Upload) any time you want a snapshot to share
  or analyze.
- Since there's no server, there's no live/automatic sync — moving data
  between devices or into Sheets is a deliberate export step, not a
  background process. See §5 for why that's the right tradeoff for a
  single-device offline tool, and what to do if you outgrow it.

---

## 4. Data safety

- The app opens straight to the dashboard — no password or lock screen.
  **All data lives only on this device.** There is nothing to back up on
  a server because there is no server. See §6.
- If you ever host the built site somewhere (to install the PWA — see
  `ANDROID.md`), still serve it over HTTPS, but note the security model
  here is "keep casual users out," not "protect sensitive data in
  transit" — there's no transit, the data never leaves the device.

---

## 5. Single device, by design

You chose local-only storage: each phone/browser that runs this app has
its own independent copy of the data. Two phones will not see each
other's orders. This is the simplest, most reliable option for one
person using one device, with zero ongoing cost or maintenance.

If your business grows and you need multiple people or devices sharing
the same live order data, that's a different, larger project (a real
backend + database + sync), not a setting to flip here. The clean
`localApi.ts` layer means that migration is realistic later — every
function already has a well-defined input/output shape — but it is not
part of this build.

---

## 6. Backups

Because everything lives in the browser's local storage on one device:

- **Regularly click Export CSV** (Orders page) and save the file
  somewhere safe — email it to yourself, save to Google Drive/Files. This
  is your backup; treat it as such.
- Do this **before** uninstalling the app, clearing browser/site data, or
  switching phones — none of those can be undone, and there is no server
  copy to recover from.
- If you want a full raw backup (not just orders), the data lives in
  `localStorage` under keys prefixed `furnecia:` — technically inspectable
  via browser dev tools, but the CSV export is the practical, supported
  way to keep a copy.

---

## 7. Running it locally

```bash
cd dashboard
npm install
npm run dev            # http://localhost:3000
```

The first time the app runs, it loads the real UK postcode delivery-day
reference data into the Delivery Checker (see `dashboard/ANDROID.md`
for the full note on reviewing it) — orders, vendors and products start
empty, ready for your real data.

To build the production static site (what actually ships to the phone or
gets hosted): `npm run build` — output lands in `dashboard/out/`. Preview
it with `npm run preview` (serves `out/` locally).

---

## 8. How to…

**…add a vendor** — Vendors → **+ Add Vendor**, fill in name/contact/
phone/WhatsApp, Save. New vendors appear immediately in the Vendor
dropdown on the order form.

**…add a product** — Products → **+ Add Product**. Set a default price,
default vendor and default vendor cost so that picking this product on
the order form auto-fills those fields (you can still override them per
order).

**…create an order** — Orders → **+ Add Order**. Fill in customer info,
pick or type the product, choose floor/lift/fitting — the "Automatic
Calculation" panel on the right updates live. Click **"+ Show vendor
cost, discount & commission details"** if you need them; otherwise just
click **SAVE ORDER**.

**…add an order by typing it in free text** — On the same Add Order
page, use the **Quick Add via AI** box at the top: type or paste the
order in any order or wording (name, phone, address, product, price,
floor, delivery date, whatever you have) and click **Auto-fill from
text** — it fills in what it recognises for you to check before saving.
This is the one feature that needs internet and an API key (Settings →
AI Auto-fill); everything else in the app stays fully offline. See §9.

**…update a delivery** — On the Orders table, change the **Delivery
Status** dropdown on that row (saves instantly), or open the order and
use the same dropdown in the form, or use **Actions → Mark Delivered**.

**…record a customer payment** — Open the order → **Customer Payment
History → + Record Customer Payment**, enter the amount received. Amount
Paid / Amount Pending / Payment Status update automatically. (Or use
**Actions → Mark Fully Paid** on the Orders table for a one-click full
settlement.)

**…record a vendor payment** — Same order page, **Vendor Payment History
→ + Record Vendor Payment**.

**…see your commission/profit** — It's shown live on every order (Gross
Profit / Net Profit / My Commission), on the Dashboard home cards, and in
full detail with charts under **Reports → Profit Dashboard**.

**…generate a daily vendor report** — Reports → **Daily Vendor Report**,
pick a date and vendor, then **Export CSV** or **Print Report** to send it
to that vendor.

**…check delivery dates for a postcode** — Delivery Checker → **Check by
Postcode** (the default tab) — a completely separate tool from Orders.

**…correct the delivery-day schedule** — Delivery Checker → **Manage
Schedule** — a plain-text editor, one line per postcode area.

**…back up your data** — Orders → **Export CSV**, regularly — see §6.

**…install it on an Android phone** — see [`ANDROID.md`](./ANDROID.md):
install it as a web app (works fully offline after the first visit), or
build a real downloadable `.apk` with Android Studio.

---

## 9. AI Auto-fill (optional, the one online feature)

The **Quick Add via AI** box on the Add Order page (§8) is the only part
of this app that talks to the internet, and only when you use it:

- Set it up in **Settings → AI Auto-fill**: pick **Claude** or
  **ChatGPT**, then paste in your own API key from that provider
  (`console.anthropic.com` or `platform.openai.com/api-keys`). The key
  is stored in this device's local storage, same as everything else —
  it is never bundled into the app or sent anywhere except that one
  provider's API.
- When you click **Auto-fill from text**, the text you typed (and that
  API key) is sent directly from the app to whichever provider you
  picked — this is the one moment any data leaves the device. Be mindful
  of that if the text includes real customer details.
- The AI is instructed to only fill in what's clearly stated in your
  text and to leave the rest blank rather than guess — always review the
  filled fields (they're listed after it runs) before hitting **SAVE
  ORDER**, same as any other order.
- No key set, or no internet, or the request fails: you get a clear
  error message and can just fill the form in by hand — nothing else in
  the app is affected (`src/lib/aiOrderParser.ts`).

---

## 10. Where this simplifies the original brief

- **"Quick Add"** isn't a second, separate form. The one order form
  starts with the vendor-cost/discount/commission section collapsed, so
  adding an order with just the essentials (name, phone, address, product,
  price, vendor, delivery date, floor, lift, fitting) is already a
  few-fields-and-save flow; expand the extra section only when you need
  it.
- **Google Sheets sync** is one-way and manual (Export CSV), not live —
  see §3 and §5 for why, given the single-device offline architecture,
  and what a fuller multi-device version would require.
