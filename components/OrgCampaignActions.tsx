"use client";
import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import {
  useCancelCampaign,
  useExtendDeadline,
  useFinalizeCampaign,
  useCanFinalize,
} from "@/hooks/useCharityCore";
import { useSubmitMilestoneProof } from "@/hooks/useDonationVault";
import { addToast } from "@/components/Toast";
import { motion } from "framer-motion";
import { CalendarPlus, XCircle, CheckCircle, FileArrowUp, Warning } from "@phosphor-icons/react";
import { ADDRESSES, CHARITY_CORE_ABI } from "@/lib/contracts";
import { api } from "@/lib/api";
import { TxLink } from "@/components/TxLink";
import { FileUploadButton } from "@/components/FileUploadButton";
import { formatContractError } from "@/lib/formatContractError";

const FE_MAX_EXTENSIONS = 2;
const SECONDS_PER_DAY = 24 * 3600;

function getExtensionCount(campaignId: bigint): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(`tc-ext-${campaignId.toString()}`);
  return raw ? Number(raw) : 0;
}

function incrementExtensionCount(campaignId: bigint) {
  const next = getExtensionCount(campaignId) + 1;
  localStorage.setItem(`tc-ext-${campaignId.toString()}`, String(next));
  return next;
}

export function OrgCampaignActions({
  campaignId,
  orgAddress,
  status,
  deadline,
  totalMilestones,
  completedMilestones,
  raisedWei,
  goalWei,
  isExpired,
}: {
  campaignId: bigint;
  orgAddress: string;
  status: number;
  deadline: number;
  totalMilestones: number;
  completedMilestones: number;
  raisedWei?: bigint;
  goalWei?: bigint;
  isExpired?: boolean;
}) {
  const { address } = useAccount();
  const isOrg =
    address?.toLowerCase() === orgAddress?.toLowerCase() && status === 0;

  const { data: maxExtensionRaw } = useReadContract({
    address:      ADDRESSES.charityCore,
    abi:          CHARITY_CORE_ABI,
    functionName: "MAX_EXTENSION",
  });
  const maxExtensionSec = Number(maxExtensionRaw ?? 30 * SECONDS_PER_DAY);
  const maxExtensionDays = Math.floor(maxExtensionSec / SECONDS_PER_DAY);

  const { data: canFinalizeRaw } = useCanFinalize(campaignId);
  const canFinalizeTuple = canFinalizeRaw as
    | readonly [boolean, boolean, boolean]
    | undefined;
  const finalizeEligible = canFinalizeTuple?.[0] ?? false;
  const goalReachedOnChain = canFinalizeTuple?.[1] ?? false;
  const expiredOnChain = canFinalizeTuple?.[2] ?? isExpired ?? false;

  const goalReached =
    goalReachedOnChain ||
    (raisedWei !== undefined &&
      goalWei !== undefined &&
      goalWei > 0n &&
      raisedWei >= goalWei);

  const { cancelCampaign, isPending: cancelling } = useCancelCampaign();
  const { extendDeadline, isPending: extending, isSuccess: extended } = useExtendDeadline();
  const { finalizeCampaign, isPending: finalizing } = useFinalizeCampaign();
  const {
    submitMilestoneProof,
    hash: proofTxHash,
    isPending: submitting,
    isSuccess: submitted,
  } = useSubmitMilestoneProof();

  const [proofCID, setProofCID] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofUploading, setProofUploading] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidenceSubmitting, setEvidenceSubmitting] = useState(false);
  const [milestoneIdx, setMilestoneIdx] = useState(0);
  const [extendDays, setExtendDays] = useState(7);
  const [extensionsUsed, setExtensionsUsed] = useState(0);
  const [showExtendConfirm, setShowExtendConfirm] = useState(false);

  useEffect(() => {
    setExtensionsUsed(getExtensionCount(campaignId));
  }, [campaignId]);

  useEffect(() => {
    if (extended) {
      const count = incrementExtensionCount(campaignId);
      setExtensionsUsed(count);
      setShowExtendConfirm(false);
      addToast({ type: "success", title: "Deadline extended", message: `${count}/${FE_MAX_EXTENSIONS} extensions used` });
    }
  }, [extended, campaignId]);

  if (!isOrg) return null;

  const extensionsRemaining = Math.max(0, FE_MAX_EXTENSIONS - extensionsUsed);
  const atExtensionLimit = extensionsUsed >= FE_MAX_EXTENSIONS;

  const finalizeDisabledReason = finalizeEligible
    ? null
    : goalReached
    ? "Waiting for on-chain sync — refresh if goal was just met"
    : !expiredOnChain
    ? "Finalize when the funding goal is met or the deadline has passed"
    : "Campaign cannot be finalized in its current state";

  const handleExtend = () => {
    const newDeadline = BigInt(deadline) + BigInt(extendDays * SECONDS_PER_DAY);
    if (newDeadline > BigInt(deadline) + BigInt(maxExtensionSec)) {
      addToast({
        type: "error",
        title: "Extension too long",
        message: `On-chain max: ${maxExtensionDays} days from current deadline`,
      });
      return;
    }
    if (atExtensionLimit) {
      addToast({
        type: "error",
        title: "Extension limit reached",
        message: `Platform policy allows ${FE_MAX_EXTENSIONS} extensions per campaign`,
      });
      return;
    }
    extendDeadline(campaignId, newDeadline);
    addToast({ type: "info", title: "Extending deadline…" });
  };

  const deadlineDate = new Date(deadline * 1000).toLocaleDateString();

  const handleProofFileChange = async (file: File | null) => {
    setProofFile(file);
    if (!file) return;
    setProofUploading(true);
    try {
      const up = await api.uploadFile(file);
      const cid = up.cid ?? up.IpfsHash ?? "";
      if (!cid) throw new Error("No CID returned");
      setProofCID(cid);
      addToast({ type: "success", title: "Image uploaded", message: `CID: ${cid.slice(0, 12)}…` });
    } catch {
      setProofFile(null);
      addToast({ type: "error", title: "Upload failed", message: "Could not upload to IPFS — paste CID manually" });
    } finally {
      setProofUploading(false);
    }
  };

  const handleFinalize = async () => {
    try {
      await finalizeCampaign(campaignId);
      addToast({
        type: "info",
        title: "Finalizing campaign…",
        message: goalReachedOnChain ? "Goal reached — marking successful" : "Deadline passed — closing campaign",
      });
    } catch (e) {
      addToast({
        type: "error",
        title: "Finalize failed",
        message: formatContractError(e),
      });
    }
  };

  const handleCancel = async () => {
    try {
      await cancelCampaign(campaignId);
      addToast({
        type: "info",
        title: "Cancelling campaign…",
        message: "Donors can claim proportional refunds after cancellation",
      });
    } catch (e) {
      addToast({
        type: "error",
        title: "Cancel failed",
        message: formatContractError(e),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/50 rounded-xl p-5 space-y-4"
    >
      <h3 className="font-semibold text-amber-900 dark:text-amber-200">Organization actions</h3>

      {goalReached && (
        <p className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg px-3 py-2">
          Funding goal reached — new donations are blocked. You can finalize now to close fundraising.
        </p>
      )}

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
        </div>
        <FileUploadButton
          file={proofFile}
          onFileChange={handleProofFileChange}
          uploading={proofUploading}
          disabled={submitting}
          buttonLabel="Upload proof image"
        />
        <div className="flex gap-2 flex-wrap">
          <input
            value={proofCID}
            onChange={(e) => setProofCID(e.target.value)}
            placeholder="Qm... (auto-filled after upload, or paste CID)"
            className="flex-1 min-w-[120px] border rounded-lg px-3 py-1.5 text-sm font-mono"
          />
          <button
            type="button"
            disabled={submitting || proofUploading || !proofCID.trim()}
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
          <p className="text-xs text-emerald-600">
            Proof submitted — awaiting admin approval before public vote.
            {proofTxHash && <span className="block mt-1"><TxLink hash={proofTxHash} /></span>}
          </p>
        )}
        <p className="text-xs text-gray-500">
          If a vote fails, you can submit additional evidence for the same milestone.
        </p>
      </div>

      <div className="space-y-2 border-t border-amber-200/40 pt-3">
        <label className="text-xs font-medium text-gray-600">Evidence (image + description) — awaiting admin approval</label>
        <input
          value={evidenceTitle}
          onChange={(e) => setEvidenceTitle(e.target.value)}
          placeholder="Evidence title"
          className="w-full border rounded-lg px-3 py-1.5 text-sm"
        />
        <textarea
          value={evidenceDesc}
          onChange={(e) => setEvidenceDesc(e.target.value)}
          placeholder="Detailed description"
          className="w-full border rounded-lg px-3 py-1.5 text-sm min-h-[60px]"
        />
        <FileUploadButton
          file={evidenceFile}
          onFileChange={setEvidenceFile}
          disabled={evidenceSubmitting}
        />
        <button
          type="button"
          disabled={evidenceSubmitting || !evidenceTitle.trim()}
          onClick={async () => {
            if (!address) return;
            setEvidenceSubmitting(true);
            try {
              let imageUrl = "";
              let ipfsCID = "";
              if (evidenceFile) {
                const up = await api.uploadFile(evidenceFile);
                imageUrl = up.url ?? "";
                ipfsCID = up.cid ?? up.IpfsHash ?? "";
              }
              await api.submitEvidence({
                campaignId: Number(campaignId),
                milestoneIndex: milestoneIdx,
                orgAddress: address,
                title: evidenceTitle,
                description: evidenceDesc,
                imageUrl,
                ipfsCID,
              });
              addToast({ type: "success", title: "Evidence submitted", message: "Awaiting admin approval" });
              setEvidenceTitle("");
              setEvidenceDesc("");
              setEvidenceFile(null);
            } catch {
              addToast({ type: "error", title: "Upload failed" });
            } finally {
              setEvidenceSubmitting(false);
            }
          }}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
        >
          {evidenceSubmitting ? "…" : "Submit evidence"}
        </button>
      </div>

      <div className="rounded-lg border border-amber-200/60 bg-white/40 dark:bg-black/20 p-3 space-y-2">
        <div className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
          <Warning size={16} className="shrink-0 mt-0.5" weight="duotone" />
          <div>
            <p>Current deadline: <strong>{deadlineDate}</strong></p>
            <p className="mt-0.5">
              Extensions used: <strong>{extensionsUsed}/{FE_MAX_EXTENSIONS}</strong>
              {extensionsRemaining > 0 && ` · ${extensionsRemaining} remaining`}
            </p>
            <p className="mt-0.5 text-gray-500">
              On-chain: max +{maxExtensionDays} days per extension. See{" "}
              <a href="/about" className="text-emerald-600 hover:underline">About</a> for anti-abuse policy.
            </p>
          </div>
        </div>

        {!showExtendConfirm ? (
          <div className="flex flex-wrap gap-2 items-end">
            <div>
              <label className="text-xs text-gray-500">Extend deadline (days)</label>
              <input
                type="number"
                min={1}
                max={maxExtensionDays}
                value={extendDays}
                onChange={(e) => setExtendDays(Number(e.target.value))}
                className="block w-20 border rounded-lg px-2 py-1 text-sm mt-0.5"
              />
            </div>
            <button
              type="button"
              disabled={extending || atExtensionLimit}
              onClick={() => setShowExtendConfirm(true)}
              className="flex items-center gap-1 px-3 py-2 border rounded-lg text-sm hover:bg-white/50 disabled:opacity-50"
            >
              <CalendarPlus size={16} />
              Extend
            </button>
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            <p className="text-xs text-amber-900 dark:text-amber-200">
              Extend by {extendDays} day{extendDays !== 1 ? "s" : ""}? This will use extension{" "}
              {extensionsUsed + 1} of {FE_MAX_EXTENSIONS}.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={extending}
                onClick={handleExtend}
                className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm disabled:opacity-50"
              >
                {extending ? "…" : "Confirm extend"}
              </button>
              <button
                type="button"
                onClick={() => setShowExtendConfirm(false)}
                className="px-3 py-1.5 border rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-start">
        <div className="space-y-1">
          <button
            type="button"
            disabled={finalizing || !finalizeEligible}
            title={finalizeDisabledReason ?? undefined}
            onClick={handleFinalize}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle size={16} />
            Finalize
          </button>
          {!finalizeEligible && finalizeDisabledReason && (
            <p className="text-xs text-amber-800 dark:text-amber-300 max-w-xs">{finalizeDisabledReason}</p>
          )}
          {finalizeEligible && (
            <p className="text-xs text-gray-500 max-w-xs">
              {goalReachedOnChain
                ? "Goal met — finalize to stop fundraising and proceed with milestones."
                : expiredOnChain
                ? "Deadline passed — finalize as failed or cancel to refund donors."
                : "Ready to finalize."}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            disabled={cancelling}
            onClick={handleCancel}
            className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm disabled:opacity-50"
          >
            <XCircle size={16} />
            Cancel &amp; refund
          </button>
          <p className="text-xs text-gray-500 max-w-xs">
            Cancel anytime — donors claim proportional refunds from escrow.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
