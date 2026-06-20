"use client";

import { useState, useEffect } from "react";
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
    if (!isHero) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHero]);

  const heroScrolled = isHero && scrolled;

  return (
    <header
      className={
        isHero
          ? `fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
              heroScrolled ? "border-b border-white/[0.06] bg-black/70 backdrop-blur-[20px]" : ""
            }`
          : "sticky top-0 z-50 w-full border-b border-white/[0.06] bg-black/70 backdrop-blur-[20px]"
      }
    >
      <div
        className={
          isHero
            ? `mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
                heroScrolled ? "py-3" : "py-5 sm:py-6"
              }`
            : "relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
        }
      >
        <div
          className={
            isHero && !heroScrolled
              ? "nav-glass flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-2.5 sm:px-6"
              : "flex w-full items-center justify-between gap-4"
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
      </div>
    </header>
  );
}
