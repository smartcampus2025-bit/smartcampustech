import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px"
      }
    },
    extend: {
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          500: "#4f46e5",
          600: "#4338ca",
          700: "#3730a3"
        }
      },
      boxShadow: {
        "soft-xl":
          "0 24px 60px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(148, 163, 184, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;

