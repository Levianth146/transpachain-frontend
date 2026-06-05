"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { ConnectWallet } from "./ConnectWallet";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "Campaigns" },
  { href: "/campaigns/create", label: "Create" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/governance", label: "Governance" },
  { href: "/about", label: "About" },
  { href: "/admin", label: "Admin" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700"
        aria-label="Menu"
      >
        {open ? <X size={22} /> : <List size={22} />}
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full bg-white dark:bg-ink-900 border-b shadow-lg z-50 p-4 flex flex-col gap-3">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium py-2 ${
                pathname === href ? "text-emerald-600" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {label}
            </Link>
          ))}
          <ConnectWallet />
          <ThemeToggle />
        </div>
      )}
    </div>
  );
}
