"use client";

import { useState } from "react";

export function HeroVideoBackground() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(99,102,241,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_60%,rgba(168,85,247,0.1),transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base/20 via-bg-base/60 to-bg-base" />
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
        className="absolute inset-0 h-full w-full object-cover opacity-[0.18]"
        onError={() => setFailed(true)}
      >
        <source src="/hero-transition.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-bg-base/30 via-bg-base/70 to-bg-base" />
    </div>
  );
}
