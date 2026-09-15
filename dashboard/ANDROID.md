# Installing the Dashboard on Android

The dashboard is now a fully offline app — no server, no internet
connection, no account. All your orders, vendors, products and settings
live only on the phone you're using, in the app's own local storage.
There are two ways to get it onto an Android phone.

## Option A — Install as a web app (fastest, no build needed)

If you host the built site anywhere reachable (even just briefly, to
install it — see §"Serving it once to install" below), open it in
**Chrome on Android**:

1. Chrome shows an **"Add to Home screen"** banner (or use ⋮ menu →
   **Install app**).
2. Tap it — you get a home-screen icon that opens full-screen, no browser
   address bar.
3. From then on it works with no internet at all: the service worker
   caches every page you've visited, and all your data lives in the
   browser's local storage on that phone.

## Option B — A real, downloadable `.apk` file

`dashboard/android/` contains a complete **Capacitor** project that
bundles the built app directly inside the package — `webDir: "out"` in
`dashboard/capacitor.config.ts` points at the static site produced by
`npm run build`, so there is no server URL to configure at all.

**Important — this can't be compiled inside this Claude Code sandbox.**
Building an Android APK requires downloading the Android Gradle Plugin
and SDK components from Google's servers (`dl.google.com`), and this
sandboxed environment's network policy blocks that host entirely (403 on
every request, confirmed while setting this up). Nothing wrong with the
project itself — it's ready to build, just not *here*.

Two ways to actually get the `.apk`:

### B1 — Let GitHub build it for you (easiest, no local setup)

A workflow is already set up at `.github/workflows/build-android-apk.yml`:

1. On GitHub, go to your repo → **Actions** tab → **"Build Furnecia
   Dashboard Android APK"** → **Run workflow**.
2. Wait for the run to finish (a few minutes), open it, and download the
   `furnecia-dashboard-debug-apk` artifact — that zip contains
   `app-debug.apk`.
3. Transfer that file to an Android phone (email, WhatsApp, Google
   Drive, USB) and tap it to install. Android will warn about "unknown
   sources" the first time — this is expected for any app not from the
   Play Store; allow it for this file.

Re-run the workflow any time you've changed something and want a fresh
build — no inputs needed, since there's no server URL to provide anymore.

### B2 — Build it yourself with Android Studio

If you have Android Studio (or just the Android SDK + a JDK) on your own
computer with normal internet access:

```bash
cd dashboard
npm install
npm run build        # produces the static site in dashboard/out
npx cap sync android
cd android
./gradlew assembleDebug
# APK is now at: android/app/build/outputs/apk/debug/app-debug.apk
```

Or open the `dashboard/android` folder directly in Android Studio and
use **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

## What "fully offline" actually means here

- **Every order, vendor, product, payment, reminder and setting is
  stored in the browser/WebView's own local storage** (`src/lib/localApi.ts`
  and `src/lib/localStore.ts`) — there is no server, no database to host,
  nothing to deploy for the app to work.
- The app password (Settings → Security) is a soft PIN check done on the
  device, not a real login system — appropriate for a single-device
  personal tool, not a shared multi-user system.
- **Data does not sync between devices.** If you install this on two
  phones, each has its own separate set of orders. If you want a backup,
  or to move data to a new phone, use **Orders → Export CSV** regularly
  and keep the file somewhere safe (email it to yourself, save to Google
  Drive/Files).
- Uninstalling the app, clearing the browser's site data, or resetting
  the phone without a backup **deletes all the data permanently** —
  there's no server copy to recover it from.
- The Delivery Checker's postcode schedule ships pre-loaded with real UK
  reference data on first launch (see `dashboard/README.md`) — review it
  once against your actual courier chart from Delivery Checker → Manage
  Schedule.

## Serving it once to install (Option A only)

Since the app never needs a server *while running*, you only need
temporary hosting to get Chrome to install it the first time. Any static
file host works: the same Hostinger account as the storefront (as a
subfolder), Vercel/Netlify's free tiers, or even a temporary local network
share while you're on the same Wi-Fi as the phone. Once installed, the
hosting can go away — the installed app keeps working from its cache.
