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
          : "sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-md"
      }
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3">
        <Logo variant={isHero ? "light" : "light"} />
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
