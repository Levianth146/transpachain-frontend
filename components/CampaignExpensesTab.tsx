"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { DisbursementPanel } from "@/components/DisbursementPanel";
import { TxLink, AddressLink } from "@/components/TxLink";
import { api } from "@/lib/api";
import { formatCampaignAmountLabel } from "@/lib/format";
import { getProofIpfsUrl } from "@/lib/ipfs";

type ExpenseRow = {
  requestId: number;
  milestoneIdx?: number;
  proposalId?: number;
  recipient?: string;
  amount?: string;
  status?: string;
  receiptCid?: string;
  receiptHash?: string;
  executedTxHash?: string;
  requestedTxHash?: string;
};

export function CampaignExpensesTab({
  campaignId,
  orgAddress,
  paymentToken,
  totalMilestones,
  completedMilestones,
}: {
  campaignId: number;
  orgAddress: string;
  paymentToken: number;
  totalMilestones: number;
  completedMilestones: number;
}) {
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getCampaignExpenses(campaignId)
      .then((data) => {
        if (cancelled) return;
        setExpenses((data.expenses as ExpenseRow[]) || []);
        setError(null);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load expenses");
          setExpenses([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  const fmt = (raw?: string) => {
    if (raw == null || raw === "") return "—";
    try {
      return formatCampaignAmountLabel(BigInt(raw), paymentToken);
    } catch {
      return raw;
    }
  };

  return (
    <div className="space-y-6">
      <DisbursementPanel
        campaignId={BigInt(campaignId)}
        orgAddress={orgAddress}
        paymentToken={paymentToken}
        totalMilestones={totalMilestones}
        completedMilestones={completedMilestones}
      />

      <GlassPanel className="p-5">
        <h3 className="mb-3 font-semibold text-white">Expense requests</h3>
        {loading && <p className="text-sm text-white/50">Loading…</p>}
        {error && (
          <p className="text-sm text-rose-400">
            {error}
            <span className="mt-1 block text-xs text-white/40">
              Showing empty list — no placeholder payouts invented.
            </span>
          </p>
        )}
        {!loading && !error && expenses.length === 0 && (
          <p className="text-sm text-white/50">No disbursement requests indexed yet.</p>
        )}
        {expenses.length > 0 && (
          <ul className="space-y-3">
            {expenses.map((e) => {
              const ipfs = getProofIpfsUrl(e.receiptCid);
              return (
                <li
                  key={e.requestId}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/expenses/${e.requestId}`}
                        className="font-medium text-holo-mint hover:underline"
                      >
                        Request #{e.requestId}
                      </Link>
                      <p className="mt-1 text-sm text-white/70">
                        {fmt(e.amount)} · Milestone {(e.milestoneIdx ?? 0) + 1} ·{" "}
                        <span className="capitalize">{e.status || "unknown"}</span>
                      </p>
                      {e.recipient && (
                        <p className="mt-1 text-xs text-white/50">
                          Recipient: <AddressLink address={e.recipient} />
                        </p>
                      )}
                    </div>
                    <div className="text-right text-xs space-y-1">
                      {e.proposalId != null && e.proposalId > 0 && (
                        <div>
                          <Link
                            href={`/governance/${e.proposalId}`}
                            className="text-holo-mint hover:underline"
                          >
                            DAO proposal #{e.proposalId}
                          </Link>
                        </div>
                      )}
                      {e.executedTxHash && (
                        <div>
                          Safe/exec: <TxLink hash={e.executedTxHash} />
                        </div>
                      )}
                      {!e.executedTxHash && e.requestedTxHash && (
                        <div>
                          Requested: <TxLink hash={e.requestedTxHash} />
                        </div>
                      )}
                      {ipfs && (
                        <a
                          href={ipfs}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent-shine hover:underline"
                        >
                          Receipt IPFS ↗
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </GlassPanel>
    </div>
  );
}
