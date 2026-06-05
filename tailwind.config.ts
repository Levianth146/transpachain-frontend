import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0c0a09",
          900: "#1c1917",
        },
        cream: {
          100: "#E8D5B5",
          50: "#F5EDE0",
        },
        gold: {
          600: "#A68523",
          500: "#C9A227",
          400: "#D4B84A",
          200: "#E8D9A8",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "cursive"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0c0a09 0%, #1c1917 40%, #14532d 100%)",
        "grain":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
