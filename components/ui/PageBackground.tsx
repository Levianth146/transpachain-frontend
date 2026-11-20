"use client";

interface PageBackgroundProps {
  image?: string;
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
      ? "bg-gradient-to-b from-[var(--page-bg)]/92 via-[var(--page-bg)]/85 to-[var(--page-bg)]/90"
      : overlay === "light"
        ? "bg-gradient-to-b from-white/90 via-white/82 to-white/75 dark:from-black/40 dark:via-black/30 dark:to-black/50"
        : "bg-gradient-to-b from-white/88 via-white/78 to-white/68 dark:from-black/60 dark:via-black/55 dark:to-black/65";

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 z-0 ${className}`}>
      {image ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45 dark:opacity-35"
          style={{ backgroundImage: `url(${image})` }}
        />
      ) : (
        <div className="absolute inset-0 mesh-bg" />
      )}
      <div className={`absolute inset-0 ${overlayClass}`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(8,145,178,0.12),transparent_70%)]" />
    </div>
  );
}
