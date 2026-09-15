import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          50: "#f4f7f5",
          100: "#e3ebe4",
          200: "#c3d6c6",
          300: "#9ebda3",
          400: "#6f9c76",
          500: "#4a7d52",
          600: "#396440",
          700: "#2f5034",
          800: "#28422c",
          900: "#223727",
        },
      },
    },
  },
  plugins: [],
};

export default config;
