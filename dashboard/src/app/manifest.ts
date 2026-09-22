import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Furnecia Order Dashboard",
    short_name: "Furnecia",
    description: "Order, Vendor, Delivery & Payment Management Dashboard",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f6f5",
    theme_color: "#396440",
    orientation: "portrait",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
