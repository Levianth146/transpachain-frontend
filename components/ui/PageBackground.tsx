"use client";

interface PageBackgroundProps {
  image: string;
  overlay?: "dark" | "light" | "hero";
  className?: string;
}

export function PageBackground({
  image,
  overlay = "dark",
  className = "",
}: PageBackgroundProps) {
  const overlayClass =
    overlay === "hero"
      ? "bg-gradient-to-b from-white/90 via-white/80 to-white/70 dark:from-black/55 dark:via-black/50 dark:to-black/65"
      : overlay === "light"
        ? "bg-gradient-to-b from-white/90 via-white/82 to-white/75 dark:bg-black/65"
        : "bg-gradient-to-b from-white/88 via-white/78 to-white/68 dark:from-black/60 dark:via-black/55 dark:to-black/65";

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 z-0 ${className}`}>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className={`absolute inset-0 ${overlayClass}`} />
      <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(94,234,212,0.1),transparent_70%)]" />
      <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(168,85,247,0.08),transparent_70%)]" />
    </div>
  );
}
