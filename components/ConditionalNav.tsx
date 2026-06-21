"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";

export function ConditionalNav() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  return <SiteHeader variant={isLanding ? "hero" : "default"} />;
}
