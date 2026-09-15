# Installing the Dashboard on Android

There are two ways to get this dashboard onto an Android phone. Both are
set up in this repo — pick whichever fits how you want to use it.

## Option A — Install as a web app (works today, no build needed)

The dashboard is a PWA (Progressive Web App): once it's deployed to a
real HTTPS URL (see `dashboard/README.md` §5 — Vercel is the easy path),
just open that URL in **Chrome on Android**:

1. Chrome shows an **"Add Furnecia Order Dashboard to Home screen"**
   banner automatically (or use ⋮ menu → **Install app**).
2. Tap it — you get a home-screen icon that opens full-screen, no browser
   address bar, indistinguishable from a native app.
3. It always shows live data (there's deliberately no offline caching of
   orders/payments — a stale "pending" balance would be worse than no app
   at all), and it updates itself the moment you redeploy the dashboard.

This needs zero building, zero Android Studio, and works on any Android
phone with Chrome. **This is the recommended option** for day-to-day use.

## Option B — A real, downloadable `.apk` file

`dashboard/android/` contains a complete **Capacitor** project — a thin
native Android shell that loads your deployed dashboard URL inside a
full-screen WebView, with its own launcher icon (`F` on the Furnecia
green) and app name.

**Important — this can't be compiled inside this Claude Code sandbox.**
Building an Android APK requires downloading the Android Gradle Plugin
and SDK components from Google's servers (`dl.google.com`), and this
sandboxed environment's network policy blocks that host entirely (403 on
every request, confirmed while setting this up). Nothing wrong with the
project itself — it's ready to build, just not *here*.

Two ways to actually get the `.apk`, both work with what's committed:

### B1 — Let GitHub build it for you (easiest, no local setup)

A workflow is already set up at
`.github/workflows/build-android-apk.yml`:

1. On GitHub, go to your repo → **Actions** tab → **"Build Furnecia
   Dashboard Android APK"** → **Run workflow**.
2. Enter your dashboard's deployed URL (e.g.
   `https://furnecia-dashboard.vercel.app`) when prompted.
3. Wait for the run to finish (a few minutes), open it, and download the
   `furnecia-dashboard-debug-apk` artifact — that zip contains
   `app-debug.apk`.
4. Transfer that file to an Android phone (email, WhatsApp, Google
   Drive, USB) and tap it to install. Android will warn about "unknown
   sources" the first time — this is expected for any app not from the
   Play Store; allow it for this file.

Re-run the workflow (with the same or an updated URL) any time you want
a fresh build.

### B2 — Build it yourself with Android Studio

If you have Android Studio (or just the Android SDK + a JDK) on your own
computer with normal internet access:

```bash
cd dashboard
npm install
# Point the app at your real deployed URL:
export CAPACITOR_SERVER_URL="https://your-dashboard-domain.com"
npx cap sync android
cd android
./gradlew assembleDebug
# APK is now at: android/app/build/outputs/apk/debug/app-debug.apk
```

Or open the `dashboard/android` folder directly in Android Studio and
use **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

### Changing the URL later

The app loads whatever `CAPACITOR_SERVER_URL` was set to at build time
(see `dashboard/capacitor.config.ts`). If your dashboard's URL changes,
re-run the GitHub Action (B1) or rebuild locally (B2) with the new URL —
there's no in-app settings screen for this by design, since a business
tool shouldn't let just anyone repoint it to a different server.

### Why not an offline-only app?

This dashboard is a full multi-table database (orders, vendors, payments,
reminders) with authentication — it isn't something that can be frozen
into a static bundle and shipped inside the APK. The APK is a shell; the
dashboard itself has to be reachable at a real URL, exactly like any
banking or business app on your phone talks to its own server. That's
also why Option A (an installed PWA) behaves identically to Option B once
installed — same app, same server, different install mechanism.
