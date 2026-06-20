"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { useProposal } from "@/hooks/useGovernance";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { formatQuadraticVoteWeight } from "@/lib/format";

const STATE_STYLE: Record<number, string> = {
  0: "bg-gray-100 text-gray-700",
  1: "bg-emerald-100 text-emerald-800",
  2: "bg-red-100 text-red-800",
  3: "bg-blue-100 text-blue-800",
  4: "bg-purple-100 text-purple-800",
  5: "bg-gray-100 text-gray-600",
};

const STATE_LABEL: Record<number, string> = {
  0: "Pending",
  1: "Active",
  2: "Defeated",
  3: "Queued",
  4: "Executed",
  5: "Cancelled",
};

type ProposalRow = {
  proposalId: number;
  campaignId: number;
  milestoneIndex?: number;
  campaignTitle?: string;
  state?: number;
  stateLabel?: string;
};

export function ProposalListItem({ proposal, index }: { proposal: ProposalRow; index: number }) {
  const { data: chainRaw } = useProposal(BigInt(proposal.proposalId));
  const chain = chainRaw as Record<string, unknown> | undefined;
  const chainProposalId = chain?.id != null ? Number(chain.id) : 0;

  const forVotes = chain?.forVotes ?? 0;
  const againstVotes = chain?.againstVotes ?? 0;
  const abstainVotes = chain?.abstainVotes ?? 0;
  const stateNum = chainProposalId === 0
    ? 5
    : chain?.state != null
      ? Number(chain.state)
      : (proposal.state ?? 0);

  const fmt = (v: unknown) => formatQuadraticVoteWeight(
    typeof v === "bigint" ? v : BigInt(String(v ?? 0))
  );

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <GlassPanel hover className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="font-semibold text-gray-900 dark:text-cream-100">
              {proposal.campaignTitle}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Proposal #{proposal.proposalId} · Milestone {(proposal.milestoneIndex ?? 0) + 1}
            </p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
              <span>For: {fmt(forVotes)} QV</span>
              <span>Against: {fmt(againstVotes)} QV</span>
              <span>Abstain: {fmt(abstainVotes)} QV</span>
              <span className="text-emerald-600">on-chain</span>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${STATE_STYLE[stateNum] ?? STATE_STYLE[0]}`}>
            {STATE_LABEL[stateNum] ?? proposal.stateLabel ?? "Unknown"}
          </span>
        </div>
        <div className="flex gap-3 mt-3">
          <Link
            href={`/campaigns/${proposal.campaignId}`}
            className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
          >
            Campaign <ArrowRight size={14} />
          </Link>
          <Link
            href={`/governance/${proposal.proposalId}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Proposal detail
          </Link>
        </div>
      </GlassPanel>
    </motion.li>
  );
}
