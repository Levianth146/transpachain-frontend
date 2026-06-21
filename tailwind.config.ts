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
        "bg-base": "#030711",
        "text-primary": "#F1F5F9",
        brand: {
          indigo: "#6366F1",
          purple: "#A855F7",
          cyan: "#22D3EE",
          emerald: "#10B981",
          teal: "#14b8a6",
          navy: "#1e293b",
          charcoal: "#334155",
        },
        accent: {
          shine: "#06b6d4",
          purple: "#8b5cf6",
          pink: "#ec4899",
        },
        surface: {
          base: "#030711",
          elevated: "rgba(255,255,255,0.04)",
          card: "rgba(255,255,255,0.03)",
          muted: "rgba(255,255,255,0.05)",
        },
        holo: {
          mint: "#2dd4bf",
          lavender: "#c4b5fd",
          pink: "#f9a8d4",
          silver: "#e2e8f0",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "hero-gradient-dark":
          "radial-gradient(ellipse 100% 80% at 50% -20%, rgba(99,102,241,0.12), transparent 60%)",
        "holo-gradient":
          "linear-gradient(135deg, var(--holo-mint) 0%, var(--holo-lavender) 35%, var(--holo-pink) 65%, var(--holo-silver) 100%)",
        "cta-gradient":
          "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glass-lg": "0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        "glass-card": "0 4px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
        glow: "0 8px 40px rgba(99, 102, 241, 0.35)",
      },
      animation: {
        ticker: "ticker 44s linear infinite",
        drift1: "drift1 24s ease-in-out infinite alternate",
        drift2: "drift2 31s ease-in-out infinite alternate",
        drift3: "drift3 39s ease-in-out infinite alternate",
        drift4: "drift4 44s ease-in-out infinite alternate",
        liveblink: "liveblink 2s ease-in-out infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        drift1: {
          to: { transform: "translate(8%, 10%) scale(1.1)" },
        },
        drift2: {
          to: { transform: "translate(-10%, 6%) scale(0.95)" },
        },
        drift3: {
          to: { transform: "translate(6%, -9%) scale(1.06)" },
        },
        drift4: {
          to: { transform: "translate(-4%, 14%) scale(1.08)" },
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
