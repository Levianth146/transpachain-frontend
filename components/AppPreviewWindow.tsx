"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  formatCampaignAmount,
  formatCampaignAmountLabel,
  getCampaignFractionDigits,
} from "@/lib/format";
import { useCampaignProgressBatch } from "@/hooks/useCharityCore";
import { CampaignStatus } from "@/types";

const PREVIEW_ROWS = [
  { emoji: "🎗️", category: "ENVIRONMENT", org: "GreenViet", title: "Clean Water for Rural Vietnam", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  { emoji: "💊", category: "HEALTHCARE", org: "MedReach", title: "Medical Aid for Gaza", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
  { emoji: "📚", category: "EDUCATION", org: "EduBuild", title: "Flood School Rebuild", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" },
];

function getTimeLeft(deadline: number): string {
  const diff = deadline - Math.floor(Date.now() / 1000);
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / 86400);
  if (days > 0) return `${days} days left`;
  const hours = Math.floor(diff / 3600);
  return `${hours}h left`;
}

export function AppPreviewWindow() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    api
      .getCampaigns(1, 6)
      .then((d) => {
        const active = (d.campaigns ?? []).filter(
          (c: any) => c.status === CampaignStatus.Active
        );
        setCampaigns(active.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const ids = campaigns.map((c) => Number(c.campaignId));
  const { data: progressResults } = useCampaignProgressBatch(ids);

  const rows =
    campaigns.length >= 2
      ? campaigns.slice(0, 3).map((c, i) => {
          const paymentToken = c.paymentToken ?? 0;
          const raisedWei =
            progressResults?.[i]?.status === "success"
              ? (progressResults[i].result![0] as bigint)
              : undefined;
          const raised =
            raisedWei !== undefined
              ? Number(formatCampaignAmount(raisedWei, paymentToken))
              : 0;
          const goal = Number(formatCampaignAmount(c.goalAmount ?? "0", paymentToken));
          const pct = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
          const label =
            raisedWei !== undefined
              ? formatCampaignAmountLabel(
                  raisedWei,
                  paymentToken,
                  getCampaignFractionDigits(paymentToken)
                )
              : "…";
          const meta = PREVIEW_ROWS[i] ?? PREVIEW_ROWS[0];
          return {
            ...meta,
            title: c.title ?? meta.title,
            org: c.orgName ?? meta.org,
            amount: label,
            pct: Math.round(pct),
            donors: c.donorCount ?? 0,
            timeLeft: c.deadline ? getTimeLeft(c.deadline) : "",
          };
        })
      : PREVIEW_ROWS.map((r, i) => ({
          ...r,
          amount: ["0.8 ETH", "4,800 USDC", "0.4 ETH"][i],
          pct: [62, 96, 40][i],
          donors: [24, 18, 12][i],
          timeLeft: ["3 days left", "1 day left", "5 days left"][i],
        }));

  const liveCount = campaigns.length || 12;

  return (
    <div className="relative overflow-hidden rounded-[20px] bg-white shadow-[0_48px_120px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)]">
      <div className="flex items-center gap-0 border-b border-slate-200 bg-slate-50 px-4 py-[11px]">
        <div className="mr-3 flex shrink-0 gap-1.5">
          <span className="h-[11px] w-[11px] rounded-full bg-indigo-500" />
          <span className="h-[11px] w-[11px] rounded-full bg-purple-500" />
          <span className="h-[11px] w-[11px] rounded-full bg-cyan-400" />
        </div>
        <div className="flex-1 rounded-md bg-slate-100 px-3 py-1 text-center font-mono text-[11px] font-medium text-slate-500">
          transpachain.site/campaigns
        </div>
      </div>

      <div className="p-[18px]">
        <div className="mb-3.5 flex items-center justify-between">
          <span className="font-display text-sm font-bold text-slate-900">
            Active Campaigns
          </span>
          <div className="flex items-center gap-1.5">
            <span className="live-blink h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold text-emerald-500">
              {liveCount} live
            </span>
          </div>
        </div>

        {rows.map((row) => (
          <div
            key={row.title}
            className="mb-2 rounded-xl border border-slate-100 bg-slate-50 p-3 last:mb-0"
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-1">
                  <span
                    className={`whitespace-nowrap rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${row.bg} ${row.color} ${row.border}`}
                  >
                    {row.category}
                  </span>
                  <span className="whitespace-nowrap text-[9px] font-bold text-emerald-500">
                    ✓ {row.org}
                  </span>
                </div>
                <p className="truncate text-xs font-semibold text-slate-900">
                  {row.emoji} {row.title}
                </p>
              </div>
              <span className="ml-2 shrink-0 font-display text-[11px] font-bold text-indigo-700">
                {row.amount}
              </span>
            </div>
            <div className="mb-1 h-[5px] overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500"
                style={{ width: `${row.pct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>
                {row.pct}% · {row.donors} donors
              </span>
              {row.timeLeft && (
                <span className="font-semibold text-amber-500">{row.timeLeft}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
