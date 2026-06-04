"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Scales, ArrowRight } from "@phosphor-icons/react";
import { api } from "@/lib/api";

const STATE_STYLE: Record<number, string> = {
  0: "bg-gray-100 text-gray-700",
  1: "bg-emerald-100 text-emerald-800",
  2: "bg-red-100 text-red-800",
  3: "bg-blue-100 text-blue-800",
  4: "bg-purple-100 text-purple-800",
  5: "bg-gray-100 text-gray-600",
};

export default function GovernanceHubPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProposals().then((data) => {
      setProposals(data.proposals ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Scales size={32} className="text-gold-500" weight="duotone" />
          <h1 className="text-3xl font-display text-gold-500">DAO Governance</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Milestone releases are decided by donor votes. Each proof submission opens a proposal;
          51% quorum and a 24-hour timelock protect escrowed funds.
        </p>
      </motion.div>

      {loading ? (
        <p className="text-gray-400">Loading proposals…</p>
      ) : proposals.length === 0 ? (
        <p className="text-gray-500">No proposals indexed yet. Submit a milestone proof on an active campaign.</p>
      ) : (
        <ul className="space-y-4">
          {proposals.map((p, i) => (
            <motion.li
              key={p.proposalId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-ink-900 border rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-cream-100">
                    {p.campaignTitle}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Proposal #{p.proposalId} · Milestone {(p.milestoneIndex ?? 0) + 1}
                  </p>
                  <div className="flex gap-3 mt-2 text-xs text-gray-500">
                    <span>For: {p.forVotes}</span>
                    <span>Against: {p.againstVotes}</span>
                    <span>Abstain: {p.abstainVotes}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${STATE_STYLE[p.state] ?? STATE_STYLE[0]}`}>
                  {p.stateLabel}
                </span>
              </div>
              <div className="flex gap-3 mt-3">
                <Link
                  href={`/campaigns/${p.campaignId}`}
                  className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
                >
                  Campaign <ArrowRight size={14} />
                </Link>
                <Link
                  href={`/governance/${p.proposalId}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Proposal detail
                </Link>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </main>
  );
}
