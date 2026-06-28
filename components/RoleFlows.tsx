"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Icon } from "@phosphor-icons/react";
import {
  ArrowRight,
  Buildings,
  ChartLineUp,
  FileMagnifyingGlass,
  HandCoins,
  Medal,
  Scales,
  ShieldCheck,
  UserCircle,
  Wallet,
} from "@phosphor-icons/react";

type RoleId = "donor" | "organization" | "admin";

interface FlowStep {
  title: string;
  desc: string;
  href: string;
  icon: Icon;
}

interface RoleFlow {
  id: RoleId;
  label: string;
  summary: string;
  icon: Icon;
  accent: string;
  bg: string;
  steps: FlowStep[];
}

const ROLES: RoleFlow[] = [
  {
    id: "donor",
    label: "For donors",
    summary: "Give with confidence — funds stay in escrow until you approve each release.",
    icon: HandCoins,
    accent: "text-holo-mint",
    bg: "bg-holo-mint/10",
    steps: [
      {
        title: "Connect wallet",
        desc: "Link MetaMask on Sepolia testnet from the nav or dashboard.",
        href: "/dashboard",
        icon: Wallet,
      },
      {
        title: "Browse campaigns",
        desc: "Explore active fundraisers, milestones, and escrow status.",
        href: "/campaigns",
        icon: ChartLineUp,
      },
      {
        title: "Donate to escrow",
        desc: "Send ETH or USDC — funds lock in DonationVault, not the org wallet.",
        href: "/campaigns",
        icon: HandCoins,
      },
      {
        title: "Vote on milestones",
        desc: "Cast quadratic-weighted votes after admin approves milestone evidence.",
        href: "/governance",
        icon: Scales,
      },
      {
        title: "Earn Impact NFT",
        desc: "Receive a Bronze, Silver, or Gold badge minted to your wallet.",
        href: "/dashboard",
        icon: Medal,
      },
    ],
  },
  {
    id: "organization",
    label: "For organizations",
    summary: "Get verified, launch campaigns, and earn releases through donor governance.",
    icon: Buildings,
    accent: "text-holo-lavender",
    bg: "bg-holo-lavender/10",
    steps: [
      {
        title: "Connect verified wallet",
        desc: "Submit your org profile on the dashboard and wait for admin verification.",
        href: "/dashboard",
        icon: UserCircle,
      },
      {
        title: "Create a campaign",
        desc: "Set goals, milestones, deadline, and payment token (ETH or USDC).",
        href: "/campaigns/create",
        icon: Buildings,
      },
      {
        title: "Submit milestone evidence",
        desc: "Upload proof to IPFS and submit on-chain for admin review.",
        href: "/campaigns",
        icon: FileMagnifyingGlass,
      },
      {
        title: "Funds released after vote",
        desc: "Donors vote with 51% quorum; after a 24h timelock, escrow releases to your wallet.",
        href: "/governance",
        icon: Scales,
      },
    ],
  },
  {
    id: "admin",
    label: "For admins",
    summary: "Gate org access, review evidence, and monitor platform health.",
    icon: ShieldCheck,
    accent: "text-holo-pink",
    bg: "bg-holo-pink/10",
    steps: [
      {
        title: "Review org applications",
        desc: "Inspect pending organization profiles submitted from the dashboard.",
        href: "/admin",
        icon: UserCircle,
      },
      {
        title: "Approve or reject",
        desc: "Approve off-chain, then verify on-chain to grant ORG_ROLE.",
        href: "/admin",
        icon: ShieldCheck,
      },
      {
        title: "Monitor campaigns",
        desc: "Review milestone evidence, queue proposals, and execute releases.",
        href: "/admin",
        icon: ChartLineUp,
      },
    ],
  },
];

export function RoleFlows() {
  const [selectedId, setSelectedId] = useState<RoleId>("donor");

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let next = index;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next = (index + 1) % ROLES.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        next = (index - 1 + ROLES.length) % ROLES.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        next = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        next = ROLES.length - 1;
      } else {
        return;
      }
      setSelectedId(ROLES[next].id);
      document.getElementById(`role-tab-${ROLES[next].id}`)?.focus();
    },
    [],
  );

  const selected = ROLES.find((r) => r.id === selectedId) ?? ROLES[0];
  const RoleIcon = selected.icon;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Choose your role to see the onboarding journey"
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {ROLES.map((role, i) => {
          const isSelected = role.id === selectedId;
          const TabIcon = role.icon;

          return (
            <motion.button
              key={role.id}
              type="button"
              role="tab"
              id={`role-tab-${role.id}`}
              aria-selected={isSelected}
              aria-controls={`role-panel-${role.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelectedId(role.id)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60 dark:focus-visible:ring-holo-mint/60 ${
                isSelected
                  ? "border-teal-400/50 bg-teal-50 shadow-lg shadow-teal-500/10 dark:border-holo-mint/40 dark:bg-teal-950/50 dark:shadow-holo-mint/10"
                  : "border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-slate-900/90 dark:hover:border-white/20"
              }`}
            >
              <div className={`inline-flex rounded-lg p-2 ${role.bg} mb-2`}>
                <TabIcon size={20} className={role.accent} weight="duotone" aria-hidden />
              </div>
              <p
                className={`text-sm font-semibold ${isSelected ? "text-slate-900 dark:text-slate-100" : "text-slate-800 dark:text-slate-200"}`}
              >
                {role.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{role.summary}</p>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        key={selected.id}
        id={`role-panel-${selected.id}`}
        role="tabpanel"
        aria-labelledby={`role-tab-${selected.id}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/95 sm:p-6"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className={`rounded-lg p-2 ${selected.bg}`}>
            <RoleIcon size={22} className={selected.accent} weight="duotone" aria-hidden />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100">
              {selected.label} — step by step
            </h3>
            <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">{selected.summary}</p>
          </div>
        </div>

        <ol className="space-y-3">
          {selected.steps.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={step.href}
                  className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-teal-300 hover:bg-teal-50/50 dark:border-white/10 dark:bg-slate-800/50 dark:hover:border-holo-mint/30 dark:hover:bg-slate-800/80"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700 dark:bg-holo-mint/20 dark:text-holo-mint">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <StepIcon
                        size={16}
                        className="shrink-0 text-teal-600 dark:text-holo-mint"
                        weight="duotone"
                        aria-hidden
                      />
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-teal-700 dark:text-slate-100 dark:group-hover:text-holo-mint">
                        {step.title}
                      </p>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{step.desc}</p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="mt-1 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-600 dark:group-hover:text-holo-mint"
                    weight="bold"
                    aria-hidden
                  />
                </Link>
              </motion.li>
            );
          })}
        </ol>
      </motion.div>
    </div>
  );
}
