"use client";

import { useState } from "react";

interface HeroVideoBackgroundProps {
  variant?: "light" | "dark";
}

export function HeroVideoBackground({ variant = "light" }: HeroVideoBackgroundProps) {
  const [failed, setFailed] = useState(false);
  const isLight = variant === "light";

  if (failed) {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {isLight ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(20,184,166,0.1),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_60%,rgba(139,92,246,0.08),transparent_65%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-surface-base/30 via-surface-base/70 to-surface-base" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(99,102,241,0.15),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_60%,rgba(168,85,247,0.1),transparent_65%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#030711]/20 via-[#030711]/60 to-[#030711]" />
          </>
        )}
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className={`absolute inset-0 h-full w-full object-cover ${
          isLight ? "opacity-[0.14]" : "opacity-[0.18]"
        }`}
        onError={() => setFailed(true)}
      >
        <source src="/hero-transition.mp4" type="video/mp4" />
      </video>
      <div
        className={
          isLight
            ? "absolute inset-0 bg-gradient-to-b from-surface-base/25 via-surface-base/65 to-surface-base"
            : "absolute inset-0 bg-gradient-to-b from-[#030711]/30 via-[#030711]/70 to-[#030711]"
        }
      />
    </div>
  );
}
