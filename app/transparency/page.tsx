"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TxLink, AddressLink } from "@/components/TxLink";
import { MockYieldBadge } from "@/components/MockYieldBadge";
import { api } from "@/lib/api";
import { EXPLORER_NAME, NETWORK_NAME } from "@/lib/chain";

type Totals = {
  netDonations?: string;
  grossDonations?: string;
  platformFees?: string;
  expensesPaid?: string;
  refundsPaid?: string;
  yieldAllocated?: string;
  yieldRedeemed?: string;
  navProxy?: string;
};

type Payout = {
  requestId: number;
  campaignId: number;
  amount?: string;
  recipient?: string;
  executedTxHash?: string;
  status?: string;
  receiptCid?: string;
};

type Activity = {
  classification?: string;
  eventName?: string;
  campaignId?: number;
  amount?: string;
  txHash?: string;
  blockNumber?: number;
};

/** Public transparency — no wallet required (spec §4.3). */
export default function TransparencyPage() {
  const [totals, setTotals] = useState<Totals | null>(null);
  const [campaignCount, setCampaignCount] = useState<number | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [meta, setMeta] = useState<{ chainId?: number; asOfBlock?: number; syncStatus?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .getTransparencySummary()
      .then((data) => {
        if (cancelled) return;
        setTotals((data.totals as Totals) || null);
        setCampaignCount(
          typeof data.campaignCount === "number" ? data.campaignCount : null
        );
        setPayouts((data.recentPayouts as Payout[]) || []);
        setActivity((data.recentActivity as Activity[]) || []);
        setMeta({
          chainId: data.chainId as number | undefined,
          asOfBlock: data.asOfBlock as number | undefined,
          syncStatus: data.syncStatus as string | undefined,
        });
        setError(null);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load transparency data");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageShell
      eyebrow="Public ledger"
      title="Transparency"
      description={`Indexed totals on ${NETWORK_NAME}. No wallet required. Amounts are raw on-chain units from the indexer — not invented dashboard figures.`}
      maxWidth="5xl"
    >
      <p className="mb-4 text-xs text-white/40">
        chainId {meta.chainId ?? "—"} · asOfBlock {meta.asOfBlock ?? "—"} ·{" "}
        {meta.syncStatus ?? "—"} · explorer {EXPLORER_NAME}
      </p>

      {loading && <p className="text-sm text-white/50">Loading summary…</p>}

      {error && (
        <GlassPanel className="mb-6 p-5">
          <p className="text-sm text-rose-400">{error}</p>
          <p className="mt-2 text-xs text-white/40">
            Backend Module B endpoint unavailable. Totals intentionally left blank.
          </p>
        </GlassPanel>
      )}

      {!loading && !error && (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Campaigns" value={campaignCount != null ? String(campaignCount) : "—"} />
            <Stat label="Gross donations (wei/units)" value={totals?.grossDonations ?? "—"} />
            <Stat label="Net donations" value={totals?.netDonations ?? "—"} />
            <Stat label="Expenses paid" value={totals?.expensesPaid ?? "—"} />
            <Stat label="Refunds paid" value={totals?.refundsPaid ?? "—"} />
            <Stat label="Platform fees" value={totals?.platformFees ?? "—"} />
            <Stat
              label="Yield allocated"
              value={totals?.yieldAllocated ?? "—"}
              badge
            />
            <Stat label="NAV proxy" value={totals?.navProxy ?? "—"} />
          </div>

          <GlassPanel className="mb-6 p-5">
            <h2 className="mb-3 text-lg font-semibold text-white">Recent payouts</h2>
            {payouts.length === 0 ? (
              <p className="text-sm text-white/50">No executed expenses indexed yet.</p>
            ) : (
              <ul className="space-y-3">
                {payouts.map((p) => (
                  <li
                    key={p.requestId}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3 text-sm last:border-0"
                  >
                    <div>
                      <Link
                        href={`/expenses/${p.requestId}`}
                        className="font-medium text-holo-mint hover:underline"
                      >
                        Expense #{p.requestId}
                      </Link>
                      <span className="text-white/50">
                        {" "}
                        ·{" "}
                        <Link
                          href={`/campaigns/${p.campaignId}`}
                          className="hover:underline"
                        >
                          Campaign {p.campaignId}
                        </Link>
                      </span>
                      <p className="mt-1 font-mono text-xs text-white/60">
                        amount {p.amount ?? "—"}
                        {p.recipient && (
                          <>
                            {" "}
                            → <AddressLink address={p.recipient} />
                          </>
                        )}
                      </p>
                    </div>
                    <div className="text-xs">
                      {p.executedTxHash ? (
                        <TxLink hash={p.executedTxHash} />
                      ) : (
                        <span className="text-white/40">{p.status}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </GlassPanel>

          <GlassPanel className="p-5">
            <h2 className="mb-3 text-lg font-semibold text-white">Recent activity</h2>
            {activity.length === 0 ? (
              <p className="text-sm text-white/50">No recent ledger rows.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-white/70">
                  <thead className="text-white/40">
                    <tr>
                      <th className="pb-2 pr-3">Class</th>
                      <th className="pb-2 pr-3">Campaign</th>
                      <th className="pb-2 pr-3">Amount</th>
                      <th className="pb-2">Tx</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.map((a, i) => (
                      <tr key={`${a.txHash}-${i}`} className="border-t border-white/5">
                        <td className="py-2 pr-3">
                          {a.classification}
                          {a.classification?.startsWith("YIELD") && (
                            <span className="ml-2">
                              <MockYieldBadge />
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-3">
                          {a.campaignId != null ? (
                            <Link
                              href={`/campaigns/${a.campaignId}`}
                              className="text-holo-mint hover:underline"
                            >
                              #{a.campaignId}
                            </Link>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-2 pr-3 font-mono">{a.amount ?? "—"}</td>
                        <td className="py-2">
                          <TxLink hash={a.txHash} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassPanel>
        </>
      )}
    </PageShell>
  );
}

function Stat({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <GlassPanel className="p-4">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <p className="text-xs text-white/50">{label}</p>
        {badge && <MockYieldBadge />}
      </div>
      <p className="break-all font-mono text-sm font-semibold text-white">{value}</p>
    </GlassPanel>
  );
}
