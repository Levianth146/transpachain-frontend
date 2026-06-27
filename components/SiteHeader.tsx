"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ClientNav } from "@/components/ClientNav";
import { MobileNav } from "@/components/MobileNav";

interface SiteHeaderProps {
  variant?: "hero" | "default";
}

export function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const isHero = variant === "hero";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const glassBar =
    "rounded-2xl border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-2xl";

  return (
    <header
      className={
        isHero
          ? `sticky top-0 z-50 w-full pt-4 transition-all duration-300 sm:pt-6 ${scrolled ? "pt-2 sm:pt-3" : ""}`
          : "sticky top-0 z-50 w-full border-b border-white/[0.08] bg-black/80 backdrop-blur-2xl"
      }
    >
      <div
        className={
          isHero
            ? `relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 transition-all duration-300 sm:px-6 ${
                scrolled ? `${glassBar} bg-black/60` : glassBar
              }`
            : "relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
        }
      >
        <Logo variant="light" />
        <div className="hidden items-center lg:flex">
          <ClientNav />
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
