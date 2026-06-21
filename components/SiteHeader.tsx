"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ClientNav } from "@/components/ClientNav";
import { MobileNav } from "@/components/MobileNav";
import { ConnectWallet } from "@/components/ConnectWallet";

interface SiteHeaderProps {
  variant?: "hero" | "default";
}

export function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const isLanding = variant === "hero";

  return (
    <header className="nav-glass-dark fixed left-0 right-0 top-0 z-50 h-[60px]">
      <div className="mx-auto flex h-full max-w-[1380px] items-center justify-between gap-4 px-4 sm:px-10">
        <Logo dark />

        <div className="hidden flex-1 items-center justify-center lg:flex">
          <ClientNav linksOnly dark landing={isLanding} />
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ConnectWallet />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <ConnectWallet />
          <MobileNav dark />
        </div>
      </div>
    </header>
  );
}
