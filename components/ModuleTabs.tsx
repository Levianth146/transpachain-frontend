"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LockKey, Vault, ChartLineUp } from "@phosphor-icons/react";
import { MockYieldBadge } from "@/components/MockYieldBadge";
import { GlassPanel } from "@/components/ui/GlassPanel";

type ModuleId = "a" | "b" | "c";

const MODULES: {
  id: ModuleId;
  label: string;
  title: string;
  icon: typeof LockKey;
  body: React.ReactNode;
  bullets?: string[];
  href: string;
  linkLabel: string;
  badge?: boolean;
}[] = [
  {
    id: "a",
    label: "Module A",
    title: "Safe multi-sign",
    icon: LockKey,
    body: (
      <>
        After donors pass a milestone proposal and the timelock elapses, the DAO only{" "}
        <em>approves</em> the release. Actual payment requires a registered disbursement request
        (with receipt hash/CID) and <strong>at least 3 of 5 Safe owner signatures</strong>. Any
        account can submit the final execute transaction — the Safe threshold is the authority.
      </>
    ),
    bullets: [
      "No single admin key can pay a third party from campaign escrow",
      "EIP-712 signatures collected in-app (Fuji-friendly; no Safe UI required)",
      "Demo Safe owners are team-held MetaMask keys — production would use independent custodians",
    ],
    href: "/transparency",
    linkLabel: "See contracts & Safe on Transparency →",
  },
  {
    id: "b",
    label: "Module B",
    title: "Public ledger",
    icon: Vault,
    body: (
      <>
        An indexer writes an append-only ledger from chain events so anyone can reconcile donations,
        fees, expenses, refunds, and mock yield without a wallet. When the indexer lags, prefer live
        contract reads and Snowtrace.
      </>
    ),
    href: "/transparency",
    linkLabel: "Browse the public Transparency page →",
  },
  {
    id: "c",
    label: "Module C",
    title: "Mock Yield",
    icon: ChartLineUp,
    badge: true,
    body: (
      <>
        USDC campaigns can opt in to park <em>idle</em> escrow in a{" "}
        <strong>Mock ERC-4626 vault</strong> via YieldManager. This demonstrates NAV / allocate /
        redeem / settle-before-refund flows on Fuji — <strong>not real DeFi yield</strong> and not
        marketed APY.
      </>
    ),
    bullets: [
      "USDC only — AVAX campaigns have no yield path",
      "Internal moves (liquid ↔ vault) never pay a third party",
      "UI always shows the Mock Yield badge",
    ],
    href: "/yield",
    linkLabel: "Open the Yield page →",
  },
];

export function ModuleTabs() {
  const [active, setActive] = useState<ModuleId>("a");
  const mod = MODULES.find((m) => m.id === active) ?? MODULES[0];
  const Icon = mod.icon;

  return (
    <GlassPanel holoBorder className="p-6">
      <div
        role="tablist"
        aria-label="Platform modules"
        className="mb-5 flex flex-wrap gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-slate-950/60"
      >
        {MODULES.map((m) => {
          const selected = m.id === active;
          return (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(m.id)}
              className={`min-h-10 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                selected
                  ? "bg-teal-600 text-white dark:bg-holo-mint dark:text-slate-950"
                  : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              {m.label}
              <span className="ml-1.5 font-normal opacity-80">— {m.title}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mod.id}
          role="tabpanel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="mb-2 flex flex-wrap items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
            <Icon size={22} className="text-teal-600 dark:text-holo-mint" weight="duotone" />
            {mod.label} — {mod.title}
            {mod.badge && <MockYieldBadge />}
          </h2>
          <p className="mb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{mod.body}</p>
          {mod.bullets && (
            <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
              {mod.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          <Link href={mod.href} className="text-sm font-medium text-teal-700 hover:underline dark:text-holo-mint">
            {mod.linkLabel}
          </Link>
        </motion.div>
      </AnimatePresence>
    </GlassPanel>
  );
}
