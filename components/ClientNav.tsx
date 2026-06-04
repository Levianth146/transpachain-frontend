"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useReadContract } from "wagmi";
import { ConnectWallet } from "./ConnectWallet";
import { useMounted } from "@/hooks/useMounted";
import { GlobeHemisphereWest, PlusCircle, SquaresFour, ShieldCheck, Scales } from "@phosphor-icons/react";
import { ADDRESSES, CHARITY_CORE_ABI } from "@/lib/contracts";
import { keccak256, toBytes } from "viem";

const NAV_LINKS = [
  { href: "/",                 label: "Campaigns", icon: GlobeHemisphereWest },
  { href: "/campaigns/create", label: "Create",    icon: PlusCircle },
  { href: "/dashboard",        label: "Dashboard", icon: SquaresFour },
  { href: "/governance",       label: "Governance", icon: Scales },
];

const ADMIN_ROLE    = keccak256(toBytes("ADMIN_ROLE"));
const VERIFIER_ROLE = keccak256(toBytes("VERIFIER_ROLE"));
const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

export function ClientNav() {
  const mounted  = useMounted();
  const pathname = usePathname();
  const { address } = useAccount();

  const { data: isAdminRole } = useReadContract({
    address:      ADDRESSES.charityCore,
    abi:          CHARITY_CORE_ABI,
    functionName: "hasRole",
    args:         address ? [ADMIN_ROLE, address] : undefined,
    query:        { enabled: !!address, staleTime: 0 },
  });

  const { data: isDefaultAdminRole } = useReadContract({
    address:      ADDRESSES.charityCore,
    abi:          CHARITY_CORE_ABI,
    functionName: "hasRole",
    args:         address ? [DEFAULT_ADMIN_ROLE, address] : undefined,
    query:        { enabled: !!address, staleTime: 0 },
  });

  const { data: isVerifierRole } = useReadContract({
    address:      ADDRESSES.charityCore,
    abi:          CHARITY_CORE_ABI,
    functionName: "hasRole",
    args:         address ? [VERIFIER_ROLE, address] : undefined,
    query:        { enabled: !!address, staleTime: 0 },
  });

  const isAdmin    = Boolean(isAdminRole || isDefaultAdminRole);
  const isVerifier = Boolean(isVerifierRole);
  const showAdmin  = isAdmin || isVerifier;

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
        {showAdmin && (
          <Link
            href="/admin"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === "/admin"
                ? "bg-purple-50 text-purple-700"
                : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <ShieldCheck size={15} weight="duotone" />
            Admin
          </Link>
        )}
      </div>
      <ConnectWallet />
    </div>
  );
}