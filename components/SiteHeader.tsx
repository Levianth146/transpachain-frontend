"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { ClientNav } from "@/components/ClientNav";
import { MobileNav } from "@/components/MobileNav";
import { ConnectWallet } from "@/components/ConnectWallet";

interface SiteHeaderProps {
  variant?: "hero" | "default";
}

export function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const isHero = variant === "hero";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isHero && !scrolled
          ? "border-transparent bg-transparent"
          : "border-b border-slate-200/60 bg-white/75 backdrop-blur-[20px] shadow-sm"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center gap-4 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          isHero && !scrolled ? "py-5 sm:py-6" : "py-3"
        }`}
      >
        <div
          className={
            isHero && !scrolled
              ? "nav-glass flex w-full items-center gap-4 rounded-2xl px-4 py-2.5 sm:px-6"
              : "flex w-full items-center gap-4"
          }
        >
          <Logo />

          <div className="hidden flex-1 items-center justify-center lg:flex">
            <ClientNav linksOnly />
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <ConnectWallet />
          </div>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <ConnectWallet />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
