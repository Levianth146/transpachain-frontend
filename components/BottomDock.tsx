"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Target,
  LayoutDashboard,
  Scale,
  PlusCircle,
  Info,
} from "lucide-react";

const DOCK_LINKS = [
  { href: "/campaigns", label: "Campaigns", icon: Target },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/governance", label: "Governance", icon: Scale },
  { href: "/campaigns/create", label: "Create", icon: PlusCircle },
  { href: "/about", label: "About", icon: Info },
];

function isDockActive(pathname: string, href: string): boolean {
  if (href === "/campaigns") {
    return (
      pathname === "/campaigns" ||
      (pathname.startsWith("/campaigns/") && !pathname.startsWith("/campaigns/create"))
    );
  }
  return pathname === href;
}

export function BottomDock() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 px-2"
      aria-label="Product hub"
    >
      <div className="dock-glass flex items-center gap-1 rounded-[20px] px-2 py-2">
        {DOCK_LINKS.map(({ href, label, icon: Icon }) => {
          const active = isDockActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`group flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-all duration-200 hover:scale-110 sm:px-4 ${
                active
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "text-text-primary/45 hover:bg-white/[0.06] hover:text-text-primary"
              }`}
            >
              <Icon
                size={18}
                className={active ? "text-indigo-400" : "group-hover:text-indigo-400"}
              />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
