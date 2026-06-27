"use client";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  FileMagnifyingGlass,
  Scales,
  ArrowCounterClockwise,
  Medal,
  Coins,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import {
  HowItWorksWorkflow,
  type WorkflowStepId,
  type WorkflowStepMeta,
} from "@/components/HowItWorksWorkflow";

const STEPS: (WorkflowStepMeta & {
  icon: Icon;
  desc: string;
  color: string;
  bg: string;
})[] = [
  {
    id: "escrow",
    icon: Lock,
    title: "Donate → Escrow",
    summary: "Funds lock in DonationVault until donors approve releases.",
    desc: "Donate in ETH or USDC — funds lock in DonationVault, not the org wallet.",
    color: "text-holo-mint",
    bg: "bg-holo-mint/10",
  },
  {
    id: "evidence",
    icon: FileMagnifyingGlass,
    title: "Evidence + review",
    summary: "Milestone proof is reviewed before proposals reach donors.",
    desc: "Orgs submit milestone proof to IPFS; admin reviews before it goes to donors.",
    color: "text-holo-lavender",
    bg: "bg-holo-lavender/10",
  },
  {
    id: "dao",
    icon: Scales,
    title: "Quadratic DAO vote",
    summary: "√donation weight, quorum, and timelock govern fund release.",
    desc: "Admin approves proposals off-chain; donors vote with √donation weight. 51% quorum + 24h timelock.",
    color: "text-holo-pink",
    bg: "bg-holo-pink/10",
  },
  {
    id: "refund",
    icon: ArrowCounterClockwise,
    title: "Refund path",
    summary: "Failed or cancelled campaigns enable on-chain refund claims.",
    desc: "Failed or cancelled campaigns trigger automatic refund eligibility on-chain.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    id: "nft",
    icon: Medal,
    title: "Impact NFT",
    summary: "Donors receive Bronze, Silver, or Gold tier badges.",
    desc: "Donors receive tiered NFTs — Bronze, Silver, or Gold — as on-chain proof of impact.",
    color: "text-gold-400",
    bg: "bg-gold-400/10",
  },
  {
    id: "tokens",
    icon: Coins,
    title: "ETH or USDC",
    summary: "Campaigns choose payment token with correct decimal display.",
    desc: "Campaigns choose their payment token; amounts and escrow display in the correct unit.",
    color: "text-teal-400",
    bg: "bg-teal-400/10",
  },
];

const STEP_IDS: WorkflowStepId[] = STEPS.map((s) => s.id);

export function HowItWorksBlock({ columns = 5 }: { columns?: 3 | 5 | 6 }) {
  const visibleSteps = STEPS.slice(0, columns);
  const [selectedId, setSelectedId] = useState<WorkflowStepId>(visibleSteps[0]?.id ?? "escrow");

  const gridCols =
    columns === 3
      ? "md:grid-cols-3"
      : columns === 6
        ? "md:grid-cols-3 lg:grid-cols-6"
        : "md:grid-cols-3 lg:grid-cols-5";

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let next = index;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next = (index + 1) % visibleSteps.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        next = (index - 1 + visibleSteps.length) % visibleSteps.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        next = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        next = visibleSteps.length - 1;
      } else {
        return;
      }
      setSelectedId(visibleSteps[next].id);
      document.getElementById(`workflow-tab-${visibleSteps[next].id}`)?.focus();
    },
    [visibleSteps],
  );

  const selectedStep = visibleSteps.find((s) => s.id === selectedId) ?? visibleSteps[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label="How TranspaChain works — select a step to view the workflow"
        className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-3`}
      >
        {visibleSteps.map((step, i) => {
          const isSelected = step.id === selectedId;
          const IconComp = step.icon;

          return (
            <motion.button
              key={step.id}
              type="button"
              role="tab"
              id={`workflow-tab-${step.id}`}
              aria-selected={isSelected}
              aria-controls={`workflow-panel-${step.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelectedId(step.id)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60 dark:focus-visible:ring-holo-mint/60 ${
                isSelected
                  ? "border-teal-400/50 bg-teal-50 shadow-lg shadow-teal-500/10 dark:border-holo-mint/40 dark:bg-teal-950/50 dark:shadow-holo-mint/10"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-slate-900/90 dark:hover:border-white/20 dark:hover:bg-slate-900"
              }`}
            >
              <div className={`inline-flex rounded-lg p-2 ${step.bg} mb-2`}>
                <IconComp size={20} className={step.color} weight="duotone" aria-hidden />
              </div>
              <p className={`text-sm font-semibold ${isSelected ? "text-slate-900 dark:text-slate-100" : "text-slate-800 dark:text-slate-200"}`}>{step.title}</p>
              <p className={`mt-1 text-xs leading-relaxed ${isSelected ? "text-slate-700 dark:text-slate-300" : "text-slate-600 dark:text-slate-300"}`}>{step.desc}</p>
              {isSelected && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-[10px] font-medium uppercase tracking-wider text-holo-mint"
                >
                  Viewing flow ↓
                </motion.p>
              )}
            </motion.button>
          );
        })}
      </div>

      {selectedStep && (
        <HowItWorksWorkflow
          stepId={selectedStep.id}
          stepMeta={{ id: selectedStep.id, title: selectedStep.title, summary: selectedStep.summary }}
        />
      )}
    </div>
  );
}

export { STEP_IDS };
