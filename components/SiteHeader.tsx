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
          : "sticky top-0 z-50 w-full border-b border-white/[0.08] bg-black/80 backdrop-blur-2xl"
      }
    >
      <div
        className={
          isHero
            ? "relative mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:px-6"
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
