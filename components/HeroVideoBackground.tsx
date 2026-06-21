"use client";

interface HeroVideoBackgroundProps {
  variant?: "light" | "dark";
}

/**
 * CSS-only ambient hero background — teal/purple charity mesh with subtle motion.
 * No external video assets.
 */
export function HeroVideoBackground({ variant = "light" }: HeroVideoBackgroundProps) {
  const isLight = variant === "light";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 animate-drift1 ${
          isLight
            ? "bg-[radial-gradient(ellipse_70%_55%_at_20%_30%,rgba(20,184,166,0.14),transparent_65%)]"
            : "bg-[radial-gradient(ellipse_70%_55%_at_20%_30%,rgba(99,102,241,0.18),transparent_65%)]"
        }`}
      />
      <div
        className={`absolute inset-0 animate-drift2 ${
          isLight
            ? "bg-[radial-gradient(ellipse_60%_50%_at_85%_25%,rgba(139,92,246,0.1),transparent_60%)]"
            : "bg-[radial-gradient(ellipse_60%_50%_at_85%_25%,rgba(168,85,247,0.12),transparent_60%)]"
        }`}
      />
      <div
        className={`absolute inset-0 animate-drift3 ${
          isLight
            ? "bg-[radial-gradient(ellipse_50%_45%_at_55%_75%,rgba(236,72,153,0.07),transparent_55%)]"
            : "bg-[radial-gradient(ellipse_50%_45%_at_55%_75%,rgba(94,234,212,0.08),transparent_55%)]"
        }`}
      />
      <div className="hero-mesh-particles absolute inset-0 opacity-40" />
      <div
        className={
          isLight
            ? "absolute inset-0 bg-gradient-to-b from-surface-base/20 via-surface-base/55 to-surface-base"
            : "absolute inset-0 bg-gradient-to-b from-[#030711]/25 via-[#030711]/65 to-[#030711]"
        }
      />
    </div>
  );
}
