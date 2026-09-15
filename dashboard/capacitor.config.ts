import type { CapacitorConfig } from "@capacitor/cli";

// This wraps the dashboard's deployed web app in a native Android shell.
// The dashboard is a full server app (database, auth, API routes) — it
// cannot be bundled offline into the APK, so the app just points at your
// deployed HTTPS URL. Replace this with your real domain (see
// dashboard/ANDROID.md), then run `npx cap sync android` and rebuild.
const DASHBOARD_URL = process.env.CAPACITOR_SERVER_URL || "https://your-dashboard-domain.com";

const config: CapacitorConfig = {
  appId: "com.furnecia.dashboard",
  appName: "Furnecia Dashboard",
  webDir: "public",
  server: {
    url: DASHBOARD_URL,
    cleartext: DASHBOARD_URL.startsWith("http://"),
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
