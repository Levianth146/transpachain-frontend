"use client";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { addToast } from "@/components/Toast";
import { Clock, FileImage, Scales } from "@phosphor-icons/react";

export function AdminPendingPanel() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [evidence, setEvidence] = useState<any[]>([]);

  const load = useCallback(() => {
    api.getPendingProposals().then((d) => setProposals(d.proposals ?? [])).catch(() => {});
    api.getPendingEvidence().then((d) => setEvidence(d.evidence ?? [])).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const reviewProposal = async (id: number, status: string) => {
    await api.reviewProposal(id, status);
    addToast({ type: "success", title: `Proposal ${status}` });
    load();
  };

  const reviewEvidence = async (id: string, status: string) => {
    await api.reviewEvidence(id, status);
    addToast({ type: "success", title: `Evidence ${status}` });
    load();
  };

  if (proposals.length === 0 && evidence.length === 0) return null;

  return (
    <GlassPanel className="p-5 mb-6 border-amber-200/50 dark:border-amber-800/40">
      <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2 text-amber-700 dark:text-amber-400">
        <Clock size={22} weight="duotone" />
        Awaiting your approval
      </h2>

      {proposals.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Scales size={16} /> Proposals ({proposals.length})
          </h3>
          <p className="text-xs text-gray-500 mb-2">Approve before they appear on Governance for public vote.</p>
          <ul className="space-y-2">
            {proposals.map((p) => (
              <li key={p.proposalId} className="flex flex-wrap items-center justify-between gap-2 text-sm border rounded-lg p-3 dark:border-zinc-700">
                <span>Proposal #{p.proposalId} · Campaign #{p.campaignId} · M{p.milestoneIndex}</span>
                <div className="flex gap-2">
                  <button onClick={() => reviewProposal(p.proposalId, "approved")} className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs">Approve</button>
                  <button onClick={() => reviewProposal(p.proposalId, "rejected")} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs">Reject</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {evidence.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <FileImage size={16} /> Evidence ({evidence.length})
          </h3>
          <ul className="space-y-2">
            {evidence.map((e) => (
              <li key={e._id} className="flex flex-wrap items-center justify-between gap-2 text-sm border rounded-lg p-3 dark:border-zinc-700">
                <span>{e.title || "Evidence"} · Campaign #{e.campaignId}</span>
                <div className="flex gap-2">
                  <button onClick={() => reviewEvidence(e._id, "approved")} className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs">Approve</button>
                  <button onClick={() => reviewEvidence(e._id, "rejected")} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs">Reject</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </GlassPanel>
  );
}
