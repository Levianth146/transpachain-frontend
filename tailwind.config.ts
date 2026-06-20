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
        brand: {
          purple: "#6f38da",
          "purple-deep": "#2d14bc",
          "purple-light": "#a074ff",
        },
        accent: {
          shine: "#64CEFB",
          purple: "#8c67ff",
        },
        surface: {
          base: "#040506",
          elevated: "#0a0a0c",
          card: "#141414",
        },
        holo: {
          mint: "var(--holo-mint)",
          lavender: "var(--holo-lavender)",
          pink: "var(--holo-pink)",
          silver: "var(--holo-silver)",
        },
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
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #000000 0%, #0c0a09 40%, #0a1628 100%)",
        "panel-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(94,234,212,0.12), transparent)",
        "holo-gradient":
          "linear-gradient(135deg, var(--holo-mint) 0%, var(--holo-lavender) 35%, var(--holo-pink) 65%, var(--holo-silver) 100%)",
        "premium-gradient":
          "linear-gradient(135deg, #6f38da 0%, #8c67ff 50%, #a074ff 100%)",
        "hero-mesh":
          "radial-gradient(ellipse 100% 80% at 50% -20%, rgba(111,56,218,0.35), transparent 60%)",
        "holo-gradient-subtle":
          "linear-gradient(135deg, rgba(94,234,212,0.15) 0%, rgba(196,181,253,0.12) 50%, rgba(249,168,212,0.1) 100%)",
        "grain":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
