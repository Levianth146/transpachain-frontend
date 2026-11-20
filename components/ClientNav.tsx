"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useReadContract } from "wagmi";
import { ConnectWallet } from "./ConnectWallet";
import { ThemeToggle } from "./ThemeToggle";
import { useMounted } from "@/hooks/useMounted";
import { ADDRESSES, CHARITY_CORE_ABI } from "@/lib/contracts";
import { PRIMARY_NAV, isNavActive } from "@/lib/nav";
import { keccak256, toBytes } from "viem";

const ADMIN_ROLE = keccak256(toBytes("ADMIN_ROLE"));
const VERIFIER_ROLE = keccak256(toBytes("VERIFIER_ROLE"));
const DEFAULT_ADMIN =
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
    args: address ? [DEFAULT_ADMIN, address] : undefined,
    query: { enabled: !!address, staleTime: 0 },
  });

  const { data: isVerifierRole } = useReadContract({
    address: ADDRESSES.charityCore,
    abi: CHARITY_CORE_ABI,
    functionName: "hasRole",
    args: address ? [VERIFIER_ROLE, address] : undefined,
    query: { enabled: !!address, staleTime: 0 },
  });

  const showAdmin = Boolean(isAdminRole || isDefaultAdminRole || isVerifierRole);

  if (!mounted) return null;

  const links = [
    ...PRIMARY_NAV.map((l) => ({ href: l.href, label: l.label })),
    ...(showAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <div className="flex items-center gap-3">
      <nav
        aria-label="Primary"
        className="flex max-w-[min(72vw,52rem)] items-center gap-0.5 overflow-x-auto rounded-full border p-1 scrollbar-none"
        style={{ borderColor: "var(--border-glass)", background: "var(--surface-glass)" }}
      >
        {links.map(({ href, label }) => {
          const active = isNavActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`min-h-9 shrink-0 cursor-pointer rounded-full px-2.5 py-1.5 text-[12px] font-medium transition-colors duration-200 xl:px-3 xl:text-[13px] ${
                active
                  ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                  : "text-[var(--page-fg-muted)] hover:bg-[var(--color-muted)] hover:text-[var(--page-fg)]"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="flex shrink-0 items-center gap-2 border-l pl-2.5" style={{ borderColor: "var(--border-glass)" }}>
        <ThemeToggle />
        <ConnectWallet />
      </div>
    </div>
  );
}
