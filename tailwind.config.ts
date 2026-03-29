import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep navy terminal palette — replaces default Tailwind grays
        gray: {
          50:  "#eaf2fb",
          100: "#d5e6f5",
          200: "#b8d0ea",
          300: "#8fb3d0",
          400: "#6090b0",
          500: "#3f6480",
          600: "#2a4862",
          700: "#1a3248",
          750: "#142840",
          800: "#0e2038",
          900: "#070d1a",
          950: "#03060e",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
        mono: ["'JetBrains Mono'", "'Courier New'", "Courier", "monospace"],
      },
      animation: {
        "scroll-left": "scroll-left 40s linear infinite",
        "pulse-fast": "pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "scroll-left": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
