"use client";

import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MockYieldBadge } from "@/components/MockYieldBadge";
import { TxLink } from "@/components/TxLink";
import { api } from "@/lib/api";
import { formatCampaignAmountLabel } from "@/lib/format";
import { EXPLORER_NAME } from "@/lib/chain";

type Totals = {
  netDonations?: string;
  grossDonations?: string;
  platformFees?: string;
  expensesPaid?: string;
  refundsPaid?: string;
  yieldAllocated?: string;
  yieldRedeemed?: string;
  navProxy?: string;
  expenseRequestedCount?: number;
  milestoneApprovedCount?: number;
};

type LedgerEntry = {
  classification?: string;
  eventName?: string;
  amount?: string;
  txHash?: string;
  blockNumber?: number;
  timestamp?: string;
};

export function CampaignFinanceTab({
  campaignId,
  paymentToken,
}: {
  campaignId: number;
  paymentToken: number;
}) {
  const [totals, setTotals] = useState<Totals | null>(null);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [meta, setMeta] = useState<{ chainId?: number; asOfBlock?: number; syncStatus?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      api.getCampaignFinancialSummary(campaignId),
      api.getCampaignLedger(campaignId, undefined, 40),
    ])
      .then(([summary, ledger]) => {
        if (cancelled) return;
        setTotals((summary.totals as Totals) || null);
        setEntries((ledger.entries as LedgerEntry[]) || []);
        setMeta({
          chainId: summary.chainId as number | undefined,
          asOfBlock: summary.asOfBlock as number | undefined,
          syncStatus: summary.syncStatus as string | undefined,
        });
        setError(null);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load finance data");
          setTotals(null);
          setEntries([]);
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

  const downloadCsv = () => {
    window.open(api.campaignStatementCsvUrl(campaignId), "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return <p className="text-sm text-white/50">Loading finance…</p>;
  }

  if (error) {
    return (
      <GlassPanel className="p-5">
        <p className="text-sm text-rose-400">{error}</p>
        <p className="mt-2 text-xs text-white/40">
          Indexed finance requires the Module B backend. No invented totals are shown.
        </p>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-white/40">
          chainId {meta.chainId ?? "—"} · asOfBlock {meta.asOfBlock ?? "—"} ·{" "}
          {meta.syncStatus ?? "unknown"}
        </div>
        <button
          type="button"
          onClick={downloadCsv}
          className="rounded-lg border border-holo-mint/40 bg-holo-mint/10 px-3 py-1.5 text-sm font-medium text-holo-mint hover:bg-holo-mint/20"
        >
          Export CSV
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Gross donations" value={fmt(totals?.grossDonations)} />
        <Stat label="Net donations" value={fmt(totals?.netDonations)} />
        <Stat label="Platform fees" value={fmt(totals?.platformFees)} />
        <Stat label="Expenses paid" value={fmt(totals?.expensesPaid)} />
        <Stat label="Refunds paid" value={fmt(totals?.refundsPaid)} />
        <Stat label="NAV proxy" value={fmt(totals?.navProxy)} />
        <Stat
          label="Yield allocated"
          value={fmt(totals?.yieldAllocated)}
          badge
        />
        <Stat
          label="Yield redeemed"
          value={fmt(totals?.yieldRedeemed)}
          badge
        />
        <Stat
          label="Approvals / requests"
          value={`${totals?.milestoneApprovedCount ?? 0} / ${totals?.expenseRequestedCount ?? 0}`}
        />
      </div>

      <GlassPanel className="p-5">
        <h3 className="mb-3 font-semibold text-white">Ledger (indexed)</h3>
        {entries.length === 0 ? (
          <p className="text-sm text-white/50">No ledger entries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/70">
              <thead className="text-white/40">
                <tr>
                  <th className="pb-2 pr-3">Class</th>
                  <th className="pb-2 pr-3">Event</th>
                  <th className="pb-2 pr-3">Amount</th>
                  <th className="pb-2">Tx ({EXPLORER_NAME})</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={`${e.txHash}-${e.blockNumber}-${i}`} className="border-t border-white/5">
                    <td className="py-2 pr-3">{e.classification}</td>
                    <td className="py-2 pr-3">{e.eventName}</td>
                    <td className="py-2 pr-3 font-mono">{fmt(e.amount)}</td>
                    <td className="py-2">
                      <TxLink hash={e.txHash} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>
    </div>
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
      <div className="mb-1 flex items-center gap-2">
        <p className="text-xs text-white/50">{label}</p>
        {badge && <MockYieldBadge />}
      </div>
      <p className="text-lg font-semibold text-white">{value}</p>
    </GlassPanel>
  );
}
