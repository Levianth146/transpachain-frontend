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
          purple: "#7c3aed",
          "purple-deep": "#5b21b6",
          "purple-light": "#a78bfa",
          teal: "#14b8a6",
          "teal-light": "#2dd4bf",
          navy: "#1e293b",
          charcoal: "#334155",
        },
        accent: {
          shine: "#06b6d4",
          purple: "#8b5cf6",
          pink: "#ec4899",
        },
        surface: {
          base: "#f8f9fb",
          elevated: "#ffffff",
          card: "rgba(255,255,255,0.72)",
          muted: "#f1f5f9",
        },
        holo: {
          mint: "var(--holo-mint)",
          lavender: "var(--holo-lavender)",
          pink: "var(--holo-pink)",
          silver: "var(--holo-silver)",
        },
        ink: {
          950: "#0f172a",
          900: "#1e293b",
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
          "linear-gradient(180deg, #f8f9fb 0%, #f1f5f9 50%, #eef2f7 100%)",
        "panel-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(20,184,166,0.08), transparent)",
        "holo-gradient":
          "linear-gradient(135deg, var(--holo-mint) 0%, var(--holo-lavender) 35%, var(--holo-pink) 65%, var(--holo-silver) 100%)",
        "premium-gradient":
          "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)",
        "cta-gradient":
          "linear-gradient(90deg, #06b6d4 0%, #14b8a6 35%, #8b5cf6 70%, #a855f7 100%)",
        "tagline-gradient":
          "linear-gradient(90deg, #14b8a6 0%, #06b6d4 50%, #10b981 100%)",
        "confidence-gradient":
          "linear-gradient(135deg, #06b6d4 0%, #14b8a6 50%, #2dd4bf 100%)",
        "hero-mesh":
          "radial-gradient(ellipse 100% 80% at 50% -20%, rgba(20,184,166,0.12), transparent 60%)",
        "holo-gradient-subtle":
          "linear-gradient(135deg, rgba(20,184,166,0.12) 0%, rgba(139,92,246,0.1) 50%, rgba(236,72,153,0.08) 100%)",
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        "brand-gradient-text":
          "linear-gradient(90deg, #06b6d4 0%, #8b5cf6 50%, #14b8a6 100%)",
        "stat-card-gradient":
          "linear-gradient(172deg, rgba(255,255,255,0.95) 0%, rgba(224,242,254,0.9) 50%, rgba(237,233,254,0.85) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
        "glass-lg": "0 16px 48px rgba(15, 23, 42, 0.1), inset 0 1px 0 rgba(255,255,255,0.95)",
        "glass-card": "0 4px 24px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
      },
      animation: {
        drift1: "drift1 24s ease-in-out infinite alternate",
        drift2: "drift2 31s ease-in-out infinite alternate",
        drift3: "drift3 39s ease-in-out infinite alternate",
        liveblink: "liveblink 2s ease-in-out infinite",
      },
      keyframes: {
        drift1: {
          to: { transform: "translate(8%, 10%) scale(1.1)" },
        },
        drift2: {
          to: { transform: "translate(-10%, 6%) scale(0.95)" },
        },
        drift3: {
          to: { transform: "translate(6%, -9%) scale(1.06)" },
        },
        liveblink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
