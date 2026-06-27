"use client";

interface PageBackgroundProps {
  image: string;
  overlay?: "dark" | "light";
  className?: string;
}

export function PageBackground({
  image,
  overlay = "dark",
  className = "",
}: PageBackgroundProps) {
  const overlayClass =
    overlay === "dark"
      ? "bg-black/75 dark:bg-black/80"
      : "bg-white/80 dark:bg-black/75";

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 -z-10 ${className}`}>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className={`absolute inset-0 ${overlayClass}`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(94,234,212,0.08),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(168,85,247,0.06),transparent_70%)]" />
    </div>
  );
}
