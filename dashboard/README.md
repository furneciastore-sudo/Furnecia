# Furnecia Order Management Dashboard

A professional internal dashboard for managing customer orders, vendors,
deliveries, payments, floor/fitting charges and your commission/profit —
built so nothing has to be calculated by hand.

This lives in `dashboard/` alongside the existing `furnecia.com` storefront
(the static HTML site in the repo root). They are two separate
applications: the storefront is a static site for customers, this
dashboard is a private Node.js app for you (the business owner) to run
orders through. It is not linked to or published on the public website.

---

## 1. Technology stack (and why)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router, TypeScript) | One project serves both the UI and the API — no separate backend to host/deploy. |
| Database | **SQLite** via **Prisma ORM** | Zero setup, zero monthly cost, the whole database is a single file you can copy/back up. Prisma also gives a typed schema that mirrors the "Google Sheets" layout from the brief, and can be pointed at Postgres/MySQL later by changing one line if you ever outgrow SQLite. |
| Styling | **Tailwind CSS** | Fast to build a clean, consistent, mobile-responsive UI without a component library to maintain. |
| Charts | **Recharts** | Lightweight charts for the Profit Dashboard. |
| Auth | A single shared password, signed session cookie (Web Crypto HMAC) | This is a single-owner internal tool, not a multi-user SaaS — a full user/roles system would be overkill. See §5. |

This is a deliberately low-cost, low-maintenance stack: no paid database,
no paid auth provider, no separate hosting bill for a backend.

---

## 2. Database structure

`prisma/schema.prisma` defines six tables that map directly onto the
"Google Sheets" structure described in the brief:

- **Order** — every field from the brief's Orders sheet (customer info,
  product info, floor/lift/fitting, all charges, customer payment, vendor
  cost/payment, commission/profit, delivery status, notes).
- **Vendor**, **Product**, **Setting**, **Payment**, **Reminder** — same
  idea as the brief's Vendors / Products / Settings / Payments / Reminders
  sheets.

Nothing about pricing is hard-coded: floor charges, the lift rule, the
default fitting charge, commission type/value, currency symbol and
business contact details all live in the `Setting` table and are edited
from **Settings** in the UI (`src/lib/settingsShared.ts` holds the
defaults that are used the first time the app runs, before you've changed
anything).

All the calculation logic (floor charge → fitting charge → customer total
→ customer pending → vendor total → vendor pending → gross/net profit →
commission) lives in one place, **`src/lib/calculations.ts`**, and is used
by both the API (when you save an order) and the live "Automatic
Calculation" preview in the order form, so the number you see while
typing is always the number that gets saved.

---

## 3. Google Sheets integration

Full two-way live sync with Google Sheets (edit a row in Sheets and have
it update the dashboard instantly) needs either Google's paid/limited
Sheets API quota plus OAuth, or a constantly-running sync service — that's
a lot of moving parts for a single-owner tool, and it's easy to end up
with two systems disagreeing about which order is correct.

What's built instead, which covers the brief's fallback instruction
("create the dashboard with a clean data layer/API structure so Google
Sheets can be connected easily later"):

1. **Export CSV** button on the Orders page and `GET /api/export/orders` —
   downloads every order in exactly the column layout from the brief's
   "Orders" sheet. Open it, or drag it into Google Sheets
   (File → Import → Upload), any time you want a snapshot.
2. **A token-protected live feed** at `GET /api/public/orders?token=...`
   (protect it by setting `EXPORT_API_TOKEN` in `.env`) returns the same
   CSV without needing a logged-in browser session — this is what an
   external script can pull from. Example Google Sheets **Apps Script**
   (Extensions → Apps Script in your Sheet) that refreshes a sheet called
   `Orders` every hour:

   ```javascript
   function syncFurneciaOrders() {
     const url = "https://your-dashboard-domain.com/api/public/orders?token=YOUR_TOKEN";
     const csv = UrlFetchApp.fetch(url).getContentText();
     const rows = Utilities.parseCsv(csv);
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
     sheet.clearContents();
     sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
   }
   // Then: Triggers (clock icon) → Add Trigger → Time-driven → Every hour.
   ```

   This gives you an always-up-to-date read-only copy of your orders in
   Google Sheets (handy for sharing with an accountant, or for pivot
   tables/extra charts Sheets is good at) without the dashboard ever
   trusting data back from the sheet.
3. **Writing back from Sheets into the dashboard is intentionally not
   built.** The simplest practical alternative, if you ever need it: add
   another Apps Script that reads new/changed rows and calls
   `POST /api/orders` (the same endpoint the Add Order form uses) — the
   route and validation already exist, so this is a follow-up script, not
   a redesign.

---

## 4. Authentication & security

- One shared password (set via `ADMIN_PASSWORD` in `.env`) protects the
  whole dashboard. Logging in sets a signed, `httpOnly` cookie
  (`src/lib/auth.ts`, `src/middleware.ts`) valid for 30 days; there's no
  separate database of users because this is a single-owner tool.
- **Change `ADMIN_PASSWORD` and `AUTH_SECRET` before putting this
  anywhere public** — the defaults in `.env.example` are only for local
  testing.
- Always deploy behind HTTPS (Vercel and most modern hosts do this
  automatically) so the password and session cookie aren't sent in the
  clear.
- The optional `/api/public/orders` feed is off unless you set
  `EXPORT_API_TOKEN`; keep that token as secret as the admin password.

---

## 5. Deployment

The static storefront in the repo root can stay on Hostinger shared
hosting exactly as it is today — **that plan cannot run this dashboard**,
because Hostinger's basic shared hosting doesn't run Node.js. Two simple,
low-cost options for the dashboard itself:

- **Vercel (recommended, free tier is enough for one business's orders)**
  — push this repo to GitHub, import the `dashboard/` folder as a new
  Vercel project, set the environment variables from `.env.example` in
  Vercel's dashboard, deploy. Vercel gives you HTTPS and a URL
  automatically.
- **A small VPS with Node.js** (e.g. Hostinger VPS, DigitalOcean,
  Railway) — `npm install && npm run build && npm run start` behind a
  reverse proxy (Nginx/Caddy) with a free Let's Encrypt certificate.

Either way, treat the SQLite file (`dashboard/dev.db`) as the single
source of truth — see backups below.

---

## 6. Backups

Because everything lives in one SQLite file:

- **Simplest backup:** copy `dashboard/dev.db` somewhere safe (cloud
  drive, email it to yourself) on whatever schedule you're comfortable
  with — daily is easy to script with a cron job (`cp dev.db backups/dev-$(date +%F).db`).
- **Human-readable backup:** click **Export CSV** on the Orders page
  whenever you like — it's a full snapshot you can open in Excel/Sheets
  even without the app running.
- If you move to a VPS host, most of them offer automatic disk snapshots
  — turn that on as a second safety net.

---

## 7. Running it locally

```bash
cd dashboard
cp .env.example .env        # then edit ADMIN_PASSWORD/AUTH_SECRET
npm install
npm run db:push             # creates dashboard/dev.db from the schema
npm run db:seed             # loads demo data (5 vendors, 8 products, 20 orders)
npm run dev                 # http://localhost:3000
```

Sign in with the password from your `.env` (`furnecia123` by default).

To wipe demo data and start clean: `npm run db:reset` recreates the
database empty, then re-seeds — if you don't want the demo rows, delete
`dashboard/dev.db` and run `npm run db:push` instead of the seed step.

**⚠️ All customers, vendors, products and orders created by the seed
script are fake demo data**, clearly separated in the database with an
`isDemo` flag — safe to delete once you're adding your own real orders
(there's no delete-all UI on purpose; drop them via `npx prisma studio`
or `npm run db:reset` before you go live).

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
Calculation" panel on the right updates live. Click vendor cost/discount/
commission fields open under **"+ Show vendor cost, discount & commission
details"** if you need them; otherwise just click **SAVE ORDER**.

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

**…back up / export your data** — Orders → **Export CSV** for everything,
or see §6 for backing up the whole database file.

---

## 9. Where this simplifies the original brief

Two spots where a literal reading of the brief would add real complexity
for little day-to-day benefit — noted here rather than silently skipped:

- **"Quick Add"** isn't a second, separate form. The one order form
  starts with the vendor-cost/discount/commission section collapsed, so
  adding an order with just the essentials (name, phone, address, product,
  price, vendor, delivery date, floor, lift, fitting) is already a
  few-fields-and-save flow; expand the extra section only when you need
  it. This avoids keeping two forms in sync as the calculation rules
  evolve.
- **Two-way Google Sheets sync** — see §3. One-way (dashboard → Sheets) is
  built; writing Sheets edits back into the dashboard is a follow-up Apps
  Script against the existing `POST /api/orders` endpoint, not a missing
  feature in the dashboard itself.
