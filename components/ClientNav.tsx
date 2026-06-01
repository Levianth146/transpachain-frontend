"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWallet } from "./ConnectWallet";
import { useMounted } from "@/hooks/useMounted";
import { Globe, PlusCircle, LayoutDashboard } from "lucide-react";

const NAV_LINKS = [
  { href: "/",                 label: "Campaigns", icon: Globe },
  { href: "/campaigns/create", label: "Create",    icon: PlusCircle },
  { href: "/dashboard",        label: "Dashboard", icon: LayoutDashboard },
];

export function ClientNav() {
  const mounted  = useMounted();
  const pathname = usePathname();

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-6">
      <div className="flex gap-1">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </div>
      <ConnectWallet />
    </div>
  );
}
