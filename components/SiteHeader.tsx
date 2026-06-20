"use client";

import { Logo } from "@/components/Logo";
import { ClientNav } from "@/components/ClientNav";
import { MobileNav } from "@/components/MobileNav";

interface SiteHeaderProps {
  variant?: "hero" | "default";
}

export function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const isHero = variant === "hero";

  return (
    <header
      className={
        isHero
          ? "relative z-20 w-full pt-4 sm:pt-6"
          : "sticky top-0 z-50 w-full border-b border-white/10 bg-black/85 backdrop-blur-xl shadow-[0_1px_0_0_rgba(94,234,212,0.08)]"
      }
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
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
