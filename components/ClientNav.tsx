"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useReadContract } from "wagmi";
import { motion } from "framer-motion";
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
      <motion.div
        layout
        className="flex gap-1 p-1 rounded-2xl bg-gray-100/80 dark:bg-ink-950/60 border border-gray-200/60 dark:border-zinc-800 backdrop-blur-md"
      >
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="relative">
              {active && (
                <motion.span
                  layoutId="nav-dock-pill"
                  className="absolute inset-0 rounded-xl bg-white dark:bg-ink-900 shadow-sm border border-emerald-200/40 dark:border-emerald-800/40"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-cream-100"
                }`}
              >
                <Icon size={15} />
                {label}
              </span>
            </Link>
          );
        })}
        {showAdmin && (
          <Link href="/admin" className="relative">
            {pathname === "/admin" && (
              <motion.span
                layoutId="nav-dock-pill"
                className="absolute inset-0 rounded-xl bg-white dark:bg-ink-900 shadow-sm border border-purple-200/40"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === "/admin"
                  ? "text-purple-700 dark:text-purple-400"
                  : "text-gray-600 hover:text-purple-700"
              }`}
            >
              <ShieldCheck size={15} weight="duotone" />
              Admin
            </span>
          </Link>
        )}
      </motion.div>
      <ConnectWallet />
    </div>
  );
}