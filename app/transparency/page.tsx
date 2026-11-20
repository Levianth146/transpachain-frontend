"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatEther, formatUnits } from "viem";
import { PageShell } from "@/components/PageShell";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TxLink, AddressLink } from "@/components/TxLink";
import { MockYieldBadge } from "@/components/MockYieldBadge";
import { TransparencyLive } from "@/components/transparency/TransparencyLive";
import { api } from "@/lib/api";
import { EXPLORER_NAME, NETWORK_NAME, NATIVE_SYMBOL } from "@/lib/chain";

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

function tryFormatIndexed(raw?: string): { human: string; raw: string } {
  if (!raw || raw === "0") return { human: "0", raw: raw ?? "0" };
  try {
    const n = BigInt(raw);
    // Heuristic: large wei-like → AVAX; smaller with 6-dec feel still show both
    const asAvax = Number(formatEther(n));
    const asUsdc = Number(formatUnits(n, 6));
    const human =
      asAvax >= 0.0001
        ? `${asAvax.toFixed(4)} ${NATIVE_SYMBOL}-units (if AVAX) · ${asUsdc.toFixed(2)} (if USDC-units)`
        : raw;
    return { human, raw };
  } catch {
    return { human: raw, raw };
  }
}

/** Public transparency — no wallet required (spec §4.3). */
export default function TransparencyPage() {
  const [totals, setTotals] = useState<Totals | null>(null);
  const [campaignCount, setCampaignCount] = useState<number | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [meta, setMeta] = useState<{
    chainId?: number;
    asOfBlock?: number;
    syncStatus?: string;
  }>({});
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
          setError(
            err instanceof Error ? err.message : "Failed to load transparency data"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const indexedStats: { label: string; raw?: string; badge?: boolean }[] = [
    { label: "Indexed campaign rows", raw: campaignCount != null ? String(campaignCount) : undefined },
    { label: "Gross donations (ledger)", raw: totals?.grossDonations },
    { label: "Net donations (ledger)", raw: totals?.netDonations },
    { label: "Platform fees", raw: totals?.platformFees },
    { label: "Expenses paid", raw: totals?.expensesPaid },
    { label: "Refunds paid", raw: totals?.refundsPaid },
    { label: "Yield allocated", raw: totals?.yieldAllocated, badge: true },
    { label: "Yield redeemed", raw: totals?.yieldRedeemed, badge: true },
    { label: "NAV proxy", raw: totals?.navProxy, badge: true },
  ];

  return (
    <PageShell
      eyebrow="Public ledger"
      title="Transparency"
      description={`Live ${NETWORK_NAME} contract reads + indexed ledger cache. Amounts above the fold are on-chain; Mongo totals are a reconcilable cache — verify every figure on ${EXPLORER_NAME}.`}
      maxWidth="5xl"
      backgroundImage="/backgrounds/panels.png"
    >
      <p className="mb-6 text-xs text-slate-500 dark:text-white/40">
        chainId {meta.chainId ?? "—"} · indexer asOfBlock {meta.asOfBlock ?? "—"} ·{" "}
        {meta.syncStatus ?? "—"} · explorer {EXPLORER_NAME} · no wallet required
      </p>

      <TransparencyLive />

      <section className="mt-8 space-y-6">
        <GlassPanel className="p-5">
          <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
            Indexed ledger cache (Mongo)
          </h2>
          <p className="mb-4 text-xs text-slate-600 dark:text-white/50">
            Built from chain events by the backend indexer. Prefer on-chain reads above when
            numbers disagree. Raw units are as stored in the ledger (wei / smallest token unit).
          </p>
          {loading && (
            <p className="text-sm text-slate-500 dark:text-white/50">Loading summary…</p>
          )}
          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
              <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-white/40">
                Module B `/api/transparency/summary` unavailable — on-chain panel above still works.
              </p>
            </div>
          )}
          {!loading && !error && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {indexedStats.map((s) => {
                const formatted =
                  s.label.includes("campaign")
                    ? { human: s.raw ?? "—", raw: s.raw ?? "—" }
                    : tryFormatIndexed(s.raw);
                return (
                  <div
                    key={s.label}
                    className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <p className="text-[11px] text-slate-500 dark:text-white/45">{s.label}</p>
                      {s.badge && <MockYieldBadge />}
                    </div>
                    <p className="break-all font-mono text-xs font-semibold text-slate-900 dark:text-white">
                      {formatted.human}
                    </p>
                    {formatted.raw !== formatted.human && (
                      <p className="mt-1 break-all font-mono text-[10px] text-slate-400 dark:text-white/30">
                        raw {formatted.raw}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </GlassPanel>

        {!loading && !error && (
          <>
            <GlassPanel className="p-5">
              <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                Recent payouts
              </h2>
              {payouts.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-white/50">
                  No executed expenses indexed yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {payouts.map((p) => (
                    <li
                      key={p.requestId}
                      className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 text-sm last:border-0 dark:border-white/5"
                    >
                      <div>
                        <Link
                          href={`/expenses/${p.requestId}`}
                          className="font-medium text-teal-700 hover:underline dark:text-holo-mint"
                        >
                          Expense #{p.requestId}
                        </Link>
                        <span className="text-slate-500 dark:text-white/50">
                          {" "}
                          ·{" "}
                          <Link
                            href={`/campaigns/${p.campaignId}`}
                            className="hover:underline"
                          >
                            Campaign {p.campaignId}
                          </Link>
                        </span>
                        <p className="mt-1 font-mono text-xs text-slate-600 dark:text-white/60">
                          amount {p.amount ?? "—"}
                          {p.recipient && (
                            <>
                              {" "}
                              → <AddressLink address={p.recipient} />
                            </>
                          )}
                          {p.receiptCid && (
                            <span className="ml-2 text-slate-400">CID {p.receiptCid}</span>
                          )}
                        </p>
                      </div>
                      <div className="text-xs">
                        {p.executedTxHash ? (
                          <TxLink hash={p.executedTxHash} />
                        ) : (
                          <span className="text-slate-400 dark:text-white/40">{p.status}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </GlassPanel>

            <GlassPanel className="p-5">
              <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                Recent activity
              </h2>
              {activity.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-white/50">No recent ledger rows.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-white/70">
                    <thead className="text-slate-500 dark:text-white/40">
                      <tr>
                        <th className="pb-2 pr-3">Class</th>
                        <th className="pb-2 pr-3">Event</th>
                        <th className="pb-2 pr-3">Campaign</th>
                        <th className="pb-2 pr-3">Amount</th>
                        <th className="pb-2 pr-3">Block</th>
                        <th className="pb-2">Tx · {EXPLORER_NAME}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activity.map((a, i) => (
                        <tr
                          key={`${a.txHash}-${i}`}
                          className="border-t border-slate-200 dark:border-white/5"
                        >
                          <td className="py-2 pr-3">
                            {a.classification}
                            {a.classification?.startsWith("YIELD") && (
                              <span className="ml-2">
                                <MockYieldBadge />
                              </span>
                            )}
                          </td>
                          <td className="py-2 pr-3 font-mono text-[10px]">
                            {a.eventName ?? "—"}
                          </td>
                          <td className="py-2 pr-3">
                            {a.campaignId != null ? (
                              <Link
                                href={`/campaigns/${a.campaignId}`}
                                className="text-teal-700 hover:underline dark:text-holo-mint"
                              >
                                #{a.campaignId}
                              </Link>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="py-2 pr-3 font-mono">{a.amount ?? "—"}</td>
                          <td className="py-2 pr-3 font-mono">{a.blockNumber ?? "—"}</td>
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
      </section>
    </PageShell>
  );
}
