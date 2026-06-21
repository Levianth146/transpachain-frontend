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

export function MobileNav({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={
          dark
            ? "rounded-full border border-white/[0.12] bg-white/[0.05] p-2 text-text-primary/70 transition-colors hover:border-white/[0.25] hover:text-text-primary"
            : "rounded-full border border-slate-200 bg-white/80 p-2 text-slate-600 transition-colors hover:border-slate-300 hover:text-brand-navy"
        }
        aria-label="Menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <div
          className={
            dark
              ? "absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-2xl border border-white/[0.1] bg-bg-base/95 p-3 shadow-glass backdrop-blur-2xl"
              : "absolute left-0 right-0 top-full z-50 border-b border-slate-200/80 bg-white/95 p-4 shadow-lg backdrop-blur-[20px]"
          }
        >
          <div className="flex flex-col gap-0.5">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isNavActive(pathname, href)
                    ? dark
                      ? "bg-white/[0.08] text-text-primary"
                      : "bg-teal-50 text-brand-navy"
                    : dark
                      ? "text-text-primary/60 hover:bg-white/[0.05] hover:text-text-primary"
                      : "text-slate-600 hover:bg-slate-50 hover:text-brand-navy"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
