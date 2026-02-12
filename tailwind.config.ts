// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "falu-red": {
          50: "#fef2f2",
          100: "#ffe1e2",
          200: "#ffc9cb",
          300: "#fea3a6",
          400: "#fc6d72",
          500: "#f43f46",
          600: "#e12128",
          700: "#bd181e",
          800: "#9c181d",
          900: "#851b1f",
          950: "#47080a",
        },
        "yellow-orange": {
          50: "#fff8eb",
          100: "#feeac7",
          200: "#fdd48a",
          300: "#fbb03b",
          400: "#fa9e25",
          500: "#f47a0c",
          600: "#d85607",
          700: "#b3390a",
          800: "#922b0e",
          900: "#78250f",
          950: "#451003",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
