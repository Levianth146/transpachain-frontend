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
          primary: "var(--color-primary)",
          secondary: "var(--color-secondary)",
          accent: "var(--color-accent)",
          bg: "var(--color-background)",
          fg: "var(--color-foreground)",
          card: "var(--color-card)",
          muted: "var(--color-muted)",
          border: "var(--color-border)",
          ring: "var(--color-ring)",
        },
        accent: {
          shine: "var(--accent-cyan)",
          cyan: "var(--accent-cyan)",
          emerald: "var(--accent-emerald)",
          amber: "var(--accent-amber)",
        },
        holo: {
          mint: "var(--holo-mint)",
          lavender: "var(--holo-lavender)",
          pink: "var(--holo-pink)",
          silver: "var(--holo-silver)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(160deg, #ecfeff 0%, #cffafe 45%, #e0f2fe 100%)",
        "panel-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(8,145,178,0.12), transparent)",
        "holo-gradient":
          "linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%)",
        "holo-gradient-subtle":
          "linear-gradient(135deg, rgba(8,145,178,0.16) 0%, rgba(34,211,238,0.1) 100%)",
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
