"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";

export function ConditionalNav() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <SiteHeader variant="default" />;
}
