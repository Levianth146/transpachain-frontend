"use client";
import { AnimatePresence, motion } from "framer-motion";
import type { Icon } from "@phosphor-icons/react";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Coins,
  FileMagnifyingGlass,
  Lock,
  Medal,
  Scales,
  ShieldCheck,
  User,
  Vault,
  XCircle,
} from "@phosphor-icons/react";

export type WorkflowStepId =
  | "escrow"
  | "evidence"
  | "dao"
  | "refund"
  | "nft"
  | "tokens";

export interface WorkflowStepMeta {
  id: WorkflowStepId;
  title: string;
  summary: string;
}

type Accent = "mint" | "lavender" | "pink" | "amber" | "gold" | "teal";

const ACCENT_STYLES: Record<Accent, { border: string; bg: string; text: string; glow: string }> = {
  mint: {
    border: "border-holo-mint/40",
    bg: "bg-holo-mint/10",
    text: "text-holo-mint",
    glow: "shadow-holo-mint/20",
  },
  lavender: {
    border: "border-holo-lavender/40",
    bg: "bg-holo-lavender/10",
    text: "text-holo-lavender",
    glow: "shadow-holo-lavender/20",
  },
  pink: {
    border: "border-holo-pink/40",
    bg: "bg-holo-pink/10",
    text: "text-holo-pink",
    glow: "shadow-holo-pink/20",
  },
  amber: {
    border: "border-amber-400/40",
    bg: "bg-amber-400/10",
    text: "text-amber-400",
    glow: "shadow-amber-400/20",
  },
  gold: {
    border: "border-gold-400/40",
    bg: "bg-gold-400/10",
    text: "text-gold-400",
    glow: "shadow-gold-400/20",
  },
  teal: {
    border: "border-teal-400/40",
    bg: "bg-teal-400/10",
    text: "text-teal-400",
    glow: "shadow-teal-400/20",
  },
};

interface FlowNode {
  label: string;
  sublabel?: string;
  icon: Icon;
  accent: Accent;
}

interface FlowConfig {
  nodes: FlowNode[];
  detail: string[];
}

const WORKFLOWS: Record<WorkflowStepId, FlowConfig> = {
  escrow: {
    nodes: [
      { label: "Donor", sublabel: "ETH or USDC", icon: User, accent: "mint" },
      { label: "DonationVault", sublabel: "Escrow lock", icon: Vault, accent: "lavender" },
      { label: "Locked funds", sublabel: "Not org wallet", icon: Lock, accent: "pink" },
    ],
    detail: [
      "Donor connects wallet and selects campaign payment token.",
      "Funds transfer to DonationVault — not the organization.",
      "Escrow balance visible on-chain until milestone release.",
    ],
  },
  evidence: {
    nodes: [
      { label: "Org uploads", sublabel: "IPFS proof CID", icon: FileMagnifyingGlass, accent: "mint" },
      { label: "Admin review", sublabel: "Off-chain gate", icon: ShieldCheck, accent: "lavender" },
      { label: "Proposal", sublabel: "Pending vote", icon: Scales, accent: "pink" },
    ],
    detail: [
      "Organization submits milestone evidence as an IPFS content ID.",
      "Admin verifies authenticity before the proposal goes live.",
      "Approved proposals appear in GovernanceDAO for donor voting.",
    ],
  },
  dao: {
    nodes: [
      { label: "√ weight", sublabel: "Quadratic vote", icon: Scales, accent: "mint" },
      { label: "51% quorum", sublabel: "Donor majority", icon: CheckCircle, accent: "lavender" },
      { label: "24h timelock", sublabel: "Then release", icon: Clock, accent: "pink" },
    ],
    detail: [
      "Vote weight = √(total donated) — large donors have diminishing influence.",
      "Proposal must reach 51% quorum of eligible voting power.",
      "After vote passes, a 24-hour timelock runs before funds release.",
    ],
  },
  refund: {
    nodes: [
      { label: "Failed campaign", sublabel: "Goal not met", icon: XCircle, accent: "amber" },
      { label: "Eligibility", sublabel: "On-chain check", icon: CheckCircle, accent: "lavender" },
      { label: "Claim refund", sublabel: "Donor wallet", icon: ArrowRight, accent: "mint" },
    ],
    detail: [
      "Campaign fails deadline or is cancelled by the organization.",
      "DonationVault marks donors as eligible via canRefund().",
      "Donors call claimRefund() to recover their original contribution.",
    ],
  },
  nft: {
    nodes: [
      { label: "Donate", sublabel: "Any amount", icon: Coins, accent: "mint" },
      { label: "Mint NFT", sublabel: "ImpactNFT", icon: Medal, accent: "lavender" },
      { label: "Tier badge", sublabel: "B / S / G", icon: Medal, accent: "gold" },
    ],
    detail: [
      "Each donation triggers an Impact NFT mint (one per donor per campaign).",
      "Tier assigned by threshold: Bronze, Silver, or Gold.",
      "Further donations can upgrade tier via upgradeTier().",
    ],
  },
  tokens: {
    nodes: [
      { label: "Select token", sublabel: "ETH or USDC", icon: Coins, accent: "teal" },
      { label: "Correct decimals", sublabel: "18 vs 6", icon: Scales, accent: "lavender" },
      { label: "Escrow display", sublabel: "Matching unit", icon: Lock, accent: "mint" },
    ],
    detail: [
      "Campaign creator picks payment token at launch (ETH = 0, USDC = 1).",
      "ETH uses 18 decimals; USDC uses 6 — amounts display accordingly.",
      "USDC donations require ERC-20 approve before donateUSDC().",
    ],
  },
};

function FlowArrow({ accent, delay }: { accent: Accent; delay: number }) {
  const style = ACCENT_STYLES[accent];
  return (
    <div className="relative flex shrink-0 items-center justify-center px-1 sm:px-2" aria-hidden>
      <motion.div
        className={`h-px w-6 sm:w-10 bg-gradient-to-r from-transparent via-current to-transparent ${style.text} opacity-50`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay, duration: 0.4 }}
      />
      <motion.div
        className={`absolute h-2 w-2 rounded-full ${style.bg} ${style.text}`}
        initial={{ x: -12, opacity: 0 }}
        animate={{ x: [0, 16, 0], opacity: [0, 1, 0] }}
        transition={{ delay: delay + 0.3, duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <ArrowRight size={14} className={`${style.text} opacity-60`} weight="bold" />
    </div>
  );
}

function FlowNodeCard({ node, index }: { node: FlowNode; index: number }) {
  const style = ACCENT_STYLES[node.accent];
  const IconComp = node.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.12, duration: 0.35 }}
      className={`flex min-w-0 flex-1 flex-col items-center rounded-xl border ${style.border} ${style.bg} p-3 shadow-lg ${style.glow} sm:p-4`}
    >
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ delay: index * 0.12 + 0.5, duration: 2, repeat: Infinity, repeatDelay: 1 }}
        className={`mb-2 rounded-lg p-2 ${style.bg}`}
      >
        <IconComp size={22} className={style.text} weight="duotone" aria-hidden />
      </motion.div>
      <p className="text-center text-xs font-semibold text-white sm:text-sm">{node.label}</p>
      {node.sublabel && (
        <p className="mt-0.5 text-center text-[10px] text-white/50 sm:text-xs">{node.sublabel}</p>
      )}
    </motion.div>
  );
}

interface HowItWorksWorkflowProps {
  stepId: WorkflowStepId;
  stepMeta: WorkflowStepMeta;
}

export function HowItWorksWorkflow({ stepId, stepMeta }: HowItWorksWorkflowProps) {
  const flow = WORKFLOWS[stepId];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepId}
        id={`workflow-panel-${stepId}`}
        role="tabpanel"
        aria-labelledby={`workflow-tab-${stepId}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white sm:text-lg">{stepMeta.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-white/60 sm:text-sm">{stepMeta.summary}</p>
          </div>
          <span className="hidden rounded-full border border-holo-mint/30 bg-holo-mint/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-holo-mint sm:inline">
            Live flow
          </span>
        </div>

        <div
          className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center"
          aria-label={`Animated workflow for ${stepMeta.title}`}
        >
          {flow.nodes.map((node, i) => (
            <div key={node.label} className="flex flex-col items-center sm:flex-row">
              <FlowNodeCard node={node} index={i} />
              {i < flow.nodes.length - 1 && (
                <div className="flex rotate-90 items-center py-1 sm:rotate-0 sm:py-0">
                  <FlowArrow accent={node.accent} delay={i * 0.15 + 0.2} />
                </div>
              )}
            </div>
          ))}
        </div>

        <motion.ol
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-5 space-y-2 border-t border-white/10 pt-4"
        >
          {flow.detail.map((line, i) => (
            <motion.li
              key={line}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.08 }}
              className="flex gap-2 text-xs leading-relaxed text-white/70 sm:text-sm"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-holo-lavender/20 text-[10px] font-bold text-holo-lavender">
                {i + 1}
              </span>
              {line}
            </motion.li>
          ))}
        </motion.ol>
      </motion.div>
    </AnimatePresence>
  );
}
