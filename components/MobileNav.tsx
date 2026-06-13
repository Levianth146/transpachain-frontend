"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ConnectWallet } from "./ConnectWallet";

const LINKS = [
  { href: "/campaigns", label: "Campaigns" },
  { href: "/campaigns/create", label: "Create" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/governance", label: "Governance" },
  { href: "/about", label: "About" },
  { href: "/admin", label: "Admin" },
];

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/campaigns") {
    return (
      pathname === "/campaigns" ||
      (pathname.startsWith("/campaigns/") && !pathname.startsWith("/campaigns/create"))
    );
  }
  return pathname === href;
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-full border border-gray-700 p-2 text-white/80 transition-colors hover:text-white"
        aria-label="Menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-gray-800 bg-black/95 p-4 shadow-lg backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isNavActive(pathname, href)
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="mt-3 border-t border-gray-800 pt-3">
              <ConnectWallet />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
