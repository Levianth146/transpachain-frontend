"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Scales, ArrowLeft, FileMagnifyingGlass, Clock, CheckCircle } from "@phosphor-icons/react";
import { useProposal, useProposalState } from "@/hooks/useGovernance";
import { useCastVote, useQueueProposal, useExecuteProposal } from "@/hooks/useGovernance";
import { useAccount } from "wagmi";
import { VoteChoice } from "@/types";
import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { formatQuadraticVoteWeight } from "@/lib/format";
import { useVotingPower, useHasVoted } from "@/hooks/useGovernance";
import { api } from "@/lib/api";
import { getProofIpfsUrl, isPlaceholderProofCid, isValidIpfsCid } from "@/lib/ipfs";

const STATE_LABEL: Record<number, { label: string; color: string }> = {
  0: { label: "Pending",   color: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300" },
  1: { label: "Active",    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  2: { label: "Defeated",  color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
  3: { label: "Queued",    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" },
  4: { label: "Executed",  color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  5: { label: "Cancelled", color: "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400" },
};

const QUORUM_BPS = 5100;

function VoteBar({ label, value, total, color }: { label: string; value: bigint; total: bigint; color: string }) {
  const pct = total > 0n ? Number((value * 10000n) / total) / 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span>{formatQuadraticVoteWeight(value)} QV ({pct.toFixed(1)}%)</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.6 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

export default function ProposalPage({ params }: { params: Promise<{ proposalId: string }> }) {
  const resolvedParams = React.use(params);
  const { address } = useAccount();
  const proposalId  = BigInt(resolvedParams.proposalId);

  const { data: proposalRaw } = useProposal(proposalId);
  const { data: state } = useProposalState(proposalId);
  const { castVote, isPending: isVoting, isSuccess: voted } = useCastVote();
  const { queue, isPending: isQueuing } = useQueueProposal();
  const { execute, isPending: isExecuting } = useExecuteProposal();

  const [campaignTitle, setCampaignTitle] = useState<string>("");

  const p = proposalRaw as Record<string, unknown> | undefined;
  const campaignId = Number(p?.campaignId ?? 0);
  const { data: myPower } = useVotingPower(BigInt(campaignId || 0), address);
  const { data: alreadyVoted } = useHasVoted(proposalId, address);
  const milestoneIndex = Number(p?.milestoneIndex ?? 0);
  const proofCID = String(p?.proofCID ?? "");
  const forVotes = BigInt(String(p?.forVotes ?? 0));
  const againstVotes = BigInt(String(p?.againstVotes ?? 0));
  const abstainVotes = BigInt(String(p?.abstainVotes ?? 0));
  const totalVotingPower = BigInt(String(p?.totalVotingPower ?? 0));
  const executeAfter = Number(p?.executeAfter ?? 0);
  const endBlock = Number(p?.endBlock ?? 0);

  const stateNum = Number(state ?? p?.state ?? 0);
  const badge = STATE_LABEL[stateNum] ?? STATE_LABEL[0];

  const totalCast = forVotes + againstVotes + abstainVotes;
  const quorumRequired = totalVotingPower > 0n
    ? (totalVotingPower * BigInt(QUORUM_BPS)) / 10000n
    : 0n;
  const quorumPct = totalVotingPower > 0n
    ? Number((totalCast * 10000n) / totalVotingPower) / 100
    : 0;
  const quorumMet = totalCast >= quorumRequired;

  const now = Math.floor(Date.now() / 1000);
  const timelockReady = executeAfter > 0 && now >= executeAfter;
  const timelockRemaining = executeAfter > now ? executeAfter - now : 0;

  useEffect(() => {
    if (!campaignId) return;
    api.getCampaign(campaignId).then((c) => {
      setCampaignTitle(c?.title ?? `Campaign #${campaignId}`);
    }).catch(() => setCampaignTitle(`Campaign #${campaignId}`));
  }, [campaignId]);

  const proofUrl = getProofIpfsUrl(proofCID);
  const hasProofCid = proofCID.trim().length > 0;
  const isDemoProof = hasProofCid && (isPlaceholderProofCid(proofCID) || !isValidIpfsCid(proofCID));

  return (
    <AnimatedGradientBackground variant="dark" className="min-h-screen">
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/governance" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 mb-6">
        <ArrowLeft size={14} /> Back to governance
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scales size={28} className="text-gold-500" weight="duotone" />
              <h1 className="text-3xl font-display text-gray-900 dark:text-cream-100">
                Proposal #{resolvedParams.proposalId}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{campaignTitle}</p>
            <p className="text-sm text-gray-500 mt-1">
              Milestone {milestoneIndex + 1}
              {proofUrl ? (
                <> ·{" "}
                  <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline inline-flex items-center gap-1">
                    <FileMagnifyingGlass size={14} /> View proof
                  </a>
                </>
              ) : isDemoProof ? (
                <> ·{" "}
                  <span className="text-amber-600 dark:text-amber-400 text-xs">
                    Demo proof — submit real milestone proof via{" "}
                    <Link href={`/campaigns/${campaignId}`} className="underline hover:text-amber-700">
                      org dashboard
                    </Link>
                  </span>
                </>
              ) : null}
            </p>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full font-medium shrink-0 ${badge.color}`}>
            {badge.label}
          </span>
        </div>
      </motion.div>

      <GlassPanel className="p-5 mb-6">
        <h3 className="font-semibold mb-4">Vote progress</h3>
        <div className="space-y-3 mb-4">
          <VoteBar label="For" value={forVotes} total={totalVotingPower || totalCast || 1n} color="bg-emerald-500" />
          <VoteBar label="Against" value={againstVotes} total={totalVotingPower || totalCast || 1n} color="bg-red-500" />
          <VoteBar label="Abstain" value={abstainVotes} total={totalVotingPower || totalCast || 1n} color="bg-gray-400" />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-white/50 dark:bg-white/5 p-3">
            <p className="text-xs text-gray-500">Quorum (51% required)</p>
            <p className={`font-bold ${quorumMet ? "text-emerald-600" : "text-amber-600"}`}>
              {quorumPct.toFixed(1)}%
              {quorumMet ? " ✓ Met" : " — Not met"}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {formatQuadraticVoteWeight(totalCast)} / {formatQuadraticVoteWeight(totalVotingPower)} QV cast
            </p>
          </div>
          <div className="rounded-lg bg-white/50 dark:bg-white/5 p-3">
            <p className="text-xs text-gray-500">Timelock (24h)</p>
            {stateNum === 3 ? (
              <p className={`font-bold ${timelockReady ? "text-emerald-600" : "text-amber-600"}`}>
                {timelockReady ? "Ready to execute" : `${Math.ceil(timelockRemaining / 3600)}h remaining`}
              </p>
            ) : stateNum === 4 ? (
              <p className="font-bold text-emerald-600">Executed</p>
            ) : (
              <p className="font-bold text-gray-500">Pending queue</p>
            )}
          </div>
        </div>
      </GlassPanel>

      <GlassPanel className="p-5 mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Clock size={18} className="text-blue-500" />
          Timeline
        </h3>
        <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-center gap-2">
            <CheckCircle size={14} className="text-emerald-500" /> Proof submitted → proposal created
          </li>
          <li className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded-full ${stateNum >= 1 ? "bg-blue-500" : "bg-gray-300"}`} />
            Voting period (ends block {endBlock.toLocaleString()})
          </li>
          <li className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded-full ${stateNum >= 3 ? "bg-yellow-500" : "bg-gray-300"}`} />
            Queued with 24h timelock
            {executeAfter > 0 && (
              <span className="text-xs text-gray-400">
                (after {new Date(executeAfter * 1000).toLocaleString()})
              </span>
            )}
          </li>
          <li className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded-full ${stateNum === 4 ? "bg-emerald-500" : "bg-gray-300"}`} />
            Funds released to organization
          </li>
        </ol>
        <Link href={`/campaigns/${campaignId}`} className="inline-block mt-3 text-sm text-emerald-600 hover:underline">
          View campaign →
        </Link>
      </GlassPanel>

      {stateNum === 1 && (
        <GlassPanel className="p-5 mb-4">
          <h3 className="font-semibold mb-3">Cast your vote</h3>
          {address && myPower != null && (
            <p className="text-xs text-gray-500 mb-3">
              Your quadratic vote power: {formatQuadraticVoteWeight(myPower as bigint)} QV
              {Number(myPower) === 0 && " — donate to this campaign to vote"}
            </p>
          )}
          {alreadyVoted && (
            <p className="text-xs text-emerald-600 mb-2">You already voted on this proposal.</p>
          )}
          <div className="flex gap-2">
            <button onClick={() => castVote(proposalId, VoteChoice.For)}
              disabled={!address || isVoting}
              className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-emerald-700">
              {isVoting ? "Voting…" : "Vote For"}
            </button>
            <button onClick={() => castVote(proposalId, VoteChoice.Against)}
              disabled={!address || isVoting}
              className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-red-600">
              Vote Against
            </button>
            <button onClick={() => castVote(proposalId, VoteChoice.Abstain)}
              disabled={!address || isVoting}
              className="flex-1 py-2 border rounded-lg text-sm disabled:opacity-50">
              Abstain
            </button>
          </div>
          <button onClick={() => queue(proposalId)}
            disabled={isQueuing}
            className="w-full mt-2 py-2 border rounded-lg text-sm disabled:opacity-50">
            {isQueuing ? "Queuing…" : "Queue proposal"}
          </button>
          {!address && <p className="text-xs text-amber-600 mt-2">Connect wallet to vote</p>}
        </GlassPanel>
      )}

      {stateNum === 3 && (
        <GlassPanel className="p-5">
          <h3 className="font-semibold mb-3">Execute proposal</h3>
          <p className="text-sm text-gray-500 mb-3">
            {timelockReady
              ? "Timelock period has passed. Execute to release milestone funds."
              : `Timelock active — ${Math.ceil(timelockRemaining / 3600)} hours remaining.`}
          </p>
          <button onClick={() => execute(proposalId)}
            disabled={isExecuting || !timelockReady}
            className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700">
            {isExecuting ? "Executing…" : "Execute & release funds"}
          </button>
        </GlassPanel>
      )}

      {voted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center mt-4">
          <p className="text-emerald-700 font-medium">Vote recorded on-chain!</p>
        </div>
      )}
    </main>
    </AnimatedGradientBackground>
  );
}
