"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import {
  useCancelCampaign,
  useExtendDeadline,
  useFinalizeCampaign,
} from "@/hooks/useCharityCore";
import { useSubmitMilestoneProof } from "@/hooks/useDonationVault";
import { addToast } from "@/components/Toast";
import { motion } from "framer-motion";
import { CalendarPlus, XCircle, CheckCircle, FileArrowUp } from "@phosphor-icons/react";

export function OrgCampaignActions({
  campaignId,
  orgAddress,
  status,
  deadline,
  totalMilestones,
  completedMilestones,
}: {
  campaignId: bigint;
  orgAddress: string;
  status: number;
  deadline: number;
  totalMilestones: number;
  completedMilestones: number;
}) {
  const { address } = useAccount();
  const isOrg =
    address?.toLowerCase() === orgAddress?.toLowerCase() && status === 0;

  const { cancelCampaign, isPending: cancelling } = useCancelCampaign();
  const { extendDeadline, isPending: extending } = useExtendDeadline();
  const { finalizeCampaign, isPending: finalizing } = useFinalizeCampaign();
  const { submitMilestoneProof, isPending: submitting, isSuccess: submitted } =
    useSubmitMilestoneProof();

  const [proofCID, setProofCID] = useState("");
  const [milestoneIdx, setMilestoneIdx] = useState(0);
  const [extendDays, setExtendDays] = useState(7);

  if (!isOrg) return null;

  const handleExtend = () => {
    const maxExtend = 30 * 24 * 3600;
    const newDeadline = BigInt(deadline) + BigInt(extendDays * 24 * 3600);
    if (newDeadline > BigInt(deadline) + BigInt(maxExtend)) {
      addToast({ type: "error", title: "Extension too long", message: "Max 30 days from current deadline" });
      return;
    }
    extendDeadline(campaignId, newDeadline);
    addToast({ type: "info", title: "Extending deadline…" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/50 rounded-xl p-5 space-y-4"
    >
      <h3 className="font-semibold text-amber-900 dark:text-amber-200">Organization actions</h3>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600">Submit milestone proof (IPFS CID)</label>
        <div className="flex gap-2 flex-wrap">
          <select
            value={milestoneIdx}
            onChange={(e) => setMilestoneIdx(Number(e.target.value))}
            className="border rounded-lg px-2 py-1.5 text-sm"
          >
            {Array.from({ length: totalMilestones }, (_, i) => (
              <option key={i} value={i} disabled={i < completedMilestones}>
                Milestone {i + 1}
                {i < completedMilestones ? " (done)" : ""}
              </option>
            ))}
          </select>
          <input
            value={proofCID}
            onChange={(e) => setProofCID(e.target.value)}
            placeholder="Qm..."
            className="flex-1 min-w-[120px] border rounded-lg px-3 py-1.5 text-sm"
          />
          <button
            type="button"
            disabled={submitting || !proofCID.trim()}
            onClick={() => {
              submitMilestoneProof(campaignId, milestoneIdx, proofCID.trim());
              addToast({ type: "info", title: "Submitting milestone proof…" });
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm disabled:opacity-50"
          >
            <FileArrowUp size={16} />
            {submitting ? "…" : "Submit"}
          </button>
        </div>
        {submitted && (
          <p className="text-xs text-emerald-600">Proof submitted — donors can vote on the new proposal.</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="text-xs text-gray-500">Extend deadline (days)</label>
          <input
            type="number"
            min={1}
            max={30}
            value={extendDays}
            onChange={(e) => setExtendDays(Number(e.target.value))}
            className="block w-20 border rounded-lg px-2 py-1 text-sm mt-0.5"
          />
        </div>
        <button
          type="button"
          disabled={extending}
          onClick={handleExtend}
          className="flex items-center gap-1 px-3 py-2 border rounded-lg text-sm hover:bg-white/50 disabled:opacity-50"
        >
          <CalendarPlus size={16} />
          Extend
        </button>
        <button
          type="button"
          disabled={finalizing}
          onClick={() => {
            finalizeCampaign(campaignId);
            addToast({ type: "info", title: "Finalizing campaign…" });
          }}
          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
        >
          <CheckCircle size={16} />
          Finalize
        </button>
        <button
          type="button"
          disabled={cancelling}
          onClick={() => {
            cancelCampaign(campaignId);
            addToast({ type: "info", title: "Cancelling campaign…", message: "Only if zero donors" });
          }}
          className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm disabled:opacity-50"
        >
          <XCircle size={16} />
          Cancel
        </button>
      </div>
    </motion.div>
  );
}
