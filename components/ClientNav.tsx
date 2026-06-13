"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useReadContract } from "wagmi";
import { ConnectWallet } from "./ConnectWallet";
import { useMounted } from "@/hooks/useMounted";
import { ADDRESSES, CHARITY_CORE_ABI } from "@/lib/contracts";
import { keccak256, toBytes } from "viem";

const NAV_LINKS = [
  { href: "/campaigns", label: "Campaigns" },
  { href: "/campaigns/create", label: "Create" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/governance", label: "Governance" },
  { href: "/about", label: "About" },
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

const ADMIN_ROLE = keccak256(toBytes("ADMIN_ROLE"));
const VERIFIER_ROLE = keccak256(toBytes("VERIFIER_ROLE"));
const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

export function ClientNav() {
  const mounted = useMounted();
  const pathname = usePathname();
  const { address } = useAccount();

  const { data: isAdminRole } = useReadContract({
    address: ADDRESSES.charityCore,
    abi: CHARITY_CORE_ABI,
    functionName: "hasRole",
    args: address ? [ADMIN_ROLE, address] : undefined,
    query: { enabled: !!address, staleTime: 0 },
  });

  const { data: isDefaultAdminRole } = useReadContract({
    address: ADDRESSES.charityCore,
    abi: CHARITY_CORE_ABI,
    functionName: "hasRole",
    args: address ? [DEFAULT_ADMIN_ROLE, address] : undefined,
    query: { enabled: !!address, staleTime: 0 },
  });

  const { data: isVerifierRole } = useReadContract({
    address: ADDRESSES.charityCore,
    abi: CHARITY_CORE_ABI,
    functionName: "hasRole",
    args: address ? [VERIFIER_ROLE, address] : undefined,
    query: { enabled: !!address, staleTime: 0 },
  });

  const isAdmin = Boolean(isAdminRole || isDefaultAdminRole);
  const isVerifier = Boolean(isVerifierRole);
  const showAdmin = isAdmin || isVerifier;

  if (!mounted) return null;

  const links = [
    ...NAV_LINKS,
    ...(showAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <div className="flex items-center gap-4">
      <nav className="flex items-center gap-1 rounded-full border border-gray-700 px-1.5 py-1">
        {links.map(({ href, label }) => {
          const active = isNavActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <ConnectWallet />
    </div>
  );
}
