/** @type {import('next').NextConfig} */
const nextConfig = {
  // The whole app is now client-side/offline (see src/lib/localApi.ts) —
  // this produces a plain static HTML/CSS/JS bundle with no Node server
  // required, which is what Capacitor bundles straight into the APK.
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
