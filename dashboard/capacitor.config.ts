import type { CapacitorConfig } from "@capacitor/cli";

// The dashboard is now a fully offline, client-side app (see
// src/lib/localApi.ts) — `next build` produces a static site in `out/`,
// which Capacitor bundles directly into the APK. No server, no URL, no
// internet connection needed at any point.
const config: CapacitorConfig = {
  appId: "com.furnecia.dashboard",
  appName: "Furnecia Dashboard",
  webDir: "out",
};

export default config;
