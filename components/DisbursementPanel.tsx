"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWalletClient,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { FileUploadButton } from "@/components/FileUploadButton";
import { TxLink, AddressLink } from "@/components/TxLink";
import { api } from "@/lib/api";
import { sha256File } from "@/lib/sha256";
import {
  ADDRESSES,
  DISBURSEMENT_CONTROLLER_ABI,
  GET_MILESTONE_V2_ABI,
  SAFE_ABI,
  isContractConfigured,
} from "@/lib/contracts";
import { gasWithBuffer } from "@/lib/contractWrite";
import { formatCampaignAmountLabel } from "@/lib/format";
import {
  buildExecuteDisbursementSafeTx,
  getSafeTxHash,
  packSafeSignatures,
  signSafeTxHash,
  execSafeTransaction,
  type SafeTxParams,
} from "@/lib/safe";

const SAFE_THRESHOLD = 3;
const DEFAULT_VALIDITY_DAYS = 7;

type StoredSig = { signer: string; signature: string; safeTxHash: string };

type Props = {
  campaignId: bigint;
  orgAddress: string;
  paymentToken: number;
  totalMilestones: number;
  completedMilestones: number;
};

export function DisbursementPanel({
  campaignId,
  orgAddress,
  paymentToken,
  totalMilestones,
  completedMilestones,
}: Props) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const v2Ready =
    isContractConfigured(ADDRESSES.disbursementController) &&
    isContractConfigured(ADDRESSES.disbursementSafe);

  const isOrg =
    !!address &&
    !!orgAddress &&
    address.toLowerCase() === orgAddress.toLowerCase();

  // Prefer next incomplete milestone for request; scan approved ones
  const [selectedIdx, setSelectedIdx] = useState(
    Math.min(completedMilestones, Math.max(0, totalMilestones - 1))
  );

  const { data: milestoneRaw, refetch: refetchMilestone } = useReadContract({
    address: ADDRESSES.donationVault,
    abi: GET_MILESTONE_V2_ABI,
    functionName: "getMilestone",
    args: [campaignId, selectedIdx],
    query: { enabled: v2Ready },
  });
  const milestone = milestoneRaw as
    | {
        proofCID?: string;
        releaseAmount?: bigint;
        released?: boolean;
        proposalId?: bigint;
        approved?: boolean;
        approvedAt?: bigint;
      }
    | undefined;

  const { data: safeOwners } = useReadContract({
    address: ADDRESSES.disbursementSafe,
    abi: SAFE_ABI,
    functionName: "getOwners",
    query: { enabled: v2Ready },
  });

  const owners = (safeOwners as `0x${string}`[] | undefined) ?? [];
  const isSafeOwner =
    !!address && owners.some((o) => o.toLowerCase() === address.toLowerCase());

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptHash, setReceiptHash] = useState<`0x${string}` | null>(null);
  const [receiptCid, setReceiptCid] = useState("");
  const [uploading, setUploading] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);
  const [sigs, setSigs] = useState<StoredSig[]>([]);
  const [safeTx, setSafeTx] = useState<SafeTxParams | null>(null);
  const [safeTxHash, setSafeTxHash] = useState<`0x${string}` | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const { isLoading: confirming, isSuccess: confirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const loadSigs = useCallback(async (id: number) => {
    try {
      const data = await api.getSafeSignatures(id);
      const list = (data.signatures as StoredSig[]) || [];
      setSigs(list);
    } catch {
      /* backend may be down — leave empty */
    }
  }, []);

  useEffect(() => {
    if (requestId != null) loadSigs(requestId);
  }, [requestId, loadSigs]);

  useEffect(() => {
    if (confirmed) {
      setStatusMsg("Transaction confirmed.");
      refetchMilestone();
      if (requestId != null) loadSigs(requestId);
    }
  }, [confirmed, refetchMilestone, requestId, loadSigs]);

  const onPickReceipt = async (file: File | null) => {
    setReceiptFile(file);
    setReceiptHash(null);
    setReceiptCid("");
    setErrorMsg(null);
    if (!file) return;
    setUploading(true);
    try {
      const hash = await sha256File(file);
      setReceiptHash(hash);
      try {
        const uploaded = await api.uploadFile(file);
        setReceiptCid(uploaded.cid);
      } catch (err) {
        setErrorMsg(
          `SHA-256 ready, but IPFS upload failed: ${
            err instanceof Error ? err.message : String(err)
          }. You can still paste a CID manually if needed.`
        );
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Hash failed");
    } finally {
      setUploading(false);
    }
  };

  const requestDisbursement = async () => {
    if (!publicClient || !address || !receiptHash || !receiptCid.trim()) return;
    setBusy(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const validUntil = BigInt(
        Math.floor(Date.now() / 1000) + DEFAULT_VALIDITY_DAYS * 86400
      );
      const gas = await gasWithBuffer(
        publicClient,
        {
          address: ADDRESSES.disbursementController,
          abi: DISBURSEMENT_CONTROLLER_ABI,
          functionName: "requestDisbursement",
          args: [campaignId, selectedIdx, receiptHash, receiptCid.trim(), validUntil],
          account: address,
        },
        400000n
      );
      const hash = await writeContractAsync({
        address: ADDRESSES.disbursementController,
        abi: DISBURSEMENT_CONTROLLER_ABI,
        functionName: "requestDisbursement",
        args: [campaignId, selectedIdx, receiptHash, receiptCid.trim(), validUntil],
        gas,
      });
      setTxHash(hash);
      setStatusMsg(
        "Disbursement requested on-chain. After confirmation, enter the requestId from the event (or indexer) below for signing."
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const prepareSafeTx = async (id: number) => {
    if (!publicClient) throw new Error("No public client");
    const tx = await buildExecuteDisbursementSafeTx(publicClient, BigInt(id));
    const hash = await getSafeTxHash(publicClient, tx);
    setSafeTx(tx);
    setSafeTxHash(hash);
    return { tx, hash };
  };

  const signAsOwner = async () => {
    if (!walletClient || !address || requestId == null) return;
    setBusy(true);
    setErrorMsg(null);
    try {
      const { hash } = safeTxHash
        ? { hash: safeTxHash }
        : await prepareSafeTx(requestId);
      const signature = await signSafeTxHash(walletClient, address, hash);
      await api.postSafeSignature(requestId, {
        signer: address,
        signature,
        safeTxHash: hash,
      });
      setStatusMsg("Signature stored.");
      await loadSigs(requestId);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const executeWithSigs = async () => {
    if (!walletClient || !address || !publicClient || requestId == null) return;
    setBusy(true);
    setErrorMsg(null);
    try {
      let tx = safeTx;
      let hash = safeTxHash;
      if (!tx || !hash) {
        const prepared = await prepareSafeTx(requestId);
        tx = prepared.tx;
        hash = prepared.hash;
      }
      // Prefer signatures matching this safeTxHash
      const matching = sigs.filter(
        (s) => s.safeTxHash.toLowerCase() === hash!.toLowerCase()
      );
      const useSigs = matching.length >= SAFE_THRESHOLD ? matching : sigs;
      if (useSigs.length < SAFE_THRESHOLD) {
        throw new Error(`Need ≥${SAFE_THRESHOLD} signatures (have ${useSigs.length})`);
      }
      const packed = packSafeSignatures(useSigs.slice(0, Math.max(SAFE_THRESHOLD, useSigs.length)));
      const execHash = await execSafeTransaction(walletClient, address, tx!, packed);
      setTxHash(execHash);
      setStatusMsg("Safe execTransaction submitted.");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const releaseLabel = useMemo(() => {
    if (milestone?.releaseAmount == null) return "—";
    try {
      return formatCampaignAmountLabel(BigInt(milestone.releaseAmount), paymentToken);
    } catch {
      return "—";
    }
  }, [milestone?.releaseAmount, paymentToken]);

  if (!v2Ready) {
    return (
      <GlassPanel className="p-5">
        <h3 className="mb-2 font-semibold text-white">Disbursement (Safe 3/5)</h3>
        <p className="text-sm text-white/60">
          V2 DisbursementController / Safe addresses are not configured yet. Set{" "}
          <code className="text-xs text-holo-mint">NEXT_PUBLIC_DISBURSEMENT_CONTROLLER_ADDRESS</code>{" "}
          and <code className="text-xs text-holo-mint">NEXT_PUBLIC_DISBURSEMENT_SAFE</code> after
          Fuji deploy.
        </p>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel holoBorder className="p-5 space-y-4">
      <div>
        <h3 className="font-semibold text-white">Disbursement (Safe 3/5)</h3>
        <p className="mt-1 text-xs text-white/50">
          After DAO approval, the org attaches a receipt (SHA-256 + IPFS CID), then Safe owners
          sign. Execution requires ≥{SAFE_THRESHOLD} signatures.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <label className="text-white/60">Milestone</label>
        <select
          className="rounded-lg border border-white/15 bg-black/40 px-2 py-1 text-white"
          value={selectedIdx}
          onChange={(e) => setSelectedIdx(Number(e.target.value))}
        >
          {Array.from({ length: totalMilestones }, (_, i) => (
            <option key={i} value={i}>
              #{i + 1}
            </option>
          ))}
        </select>
        <span className="text-white/70">{releaseLabel}</span>
        {milestone?.approved && !milestone?.released && (
          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
            DAO approved
          </span>
        )}
        {milestone?.released && (
          <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/60">Released</span>
        )}
        {!milestone?.approved && (
          <span className="rounded bg-amber-500/15 px-2 py-0.5 text-xs text-amber-200">
            Awaiting DAO approval
          </span>
        )}
      </div>

      {isOrg && milestone?.approved && !milestone?.released && (
        <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-medium text-white">1. Request disbursement</p>
          <FileUploadButton
            accept="*/*"
            label="Upload receipt"
            uploading={uploading}
            selectedFileName={receiptFile?.name}
            onChange={onPickReceipt}
          />
          {receiptHash && (
            <p className="break-all font-mono text-[11px] text-white/50">
              SHA-256: {receiptHash}
            </p>
          )}
          <div>
            <label className="mb-1 block text-xs text-white/50">Receipt IPFS CID</label>
            <input
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-mono text-sm text-white"
              value={receiptCid}
              onChange={(e) => setReceiptCid(e.target.value)}
              placeholder="Qm… or bafy…"
            />
          </div>
          <button
            type="button"
            disabled={busy || uploading || !receiptHash || !receiptCid.trim()}
            onClick={requestDisbursement}
            className="rounded-lg bg-holo-gradient px-4 py-2 text-sm font-semibold text-ink-950 disabled:opacity-40"
          >
            {busy ? "Submitting…" : "Request disbursement"}
          </button>
        </div>
      )}

      <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm font-medium text-white">2. Safe signatures & execute</p>
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label className="mb-1 block text-xs text-white/50">Request ID</label>
            <input
              type="number"
              min={1}
              className="w-28 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
              value={requestId ?? ""}
              onChange={(e) => {
                const n = Number(e.target.value);
                setRequestId(Number.isFinite(n) && n >= 1 ? n : null);
                setSafeTx(null);
                setSafeTxHash(null);
              }}
              placeholder="e.g. 1"
            />
          </div>
          {requestId != null && (
            <button
              type="button"
              className="rounded-lg border border-white/20 px-3 py-2 text-xs text-white/80 hover:bg-white/5"
              onClick={() => loadSigs(requestId)}
            >
              Refresh sigs
            </button>
          )}
          {requestId != null && publicClient && (
            <button
              type="button"
              className="rounded-lg border border-white/20 px-3 py-2 text-xs text-white/80 hover:bg-white/5"
              disabled={busy}
              onClick={() => prepareSafeTx(requestId).catch((e) => setErrorMsg(String(e.message || e)))}
            >
              Load Safe tx hash
            </button>
          )}
        </div>

        {safeTxHash && (
          <p className="break-all font-mono text-[11px] text-holo-mint/80">
            Safe tx hash: {safeTxHash}
          </p>
        )}

        <p className="text-xs text-white/50">
          Signatures: {sigs.length} / {SAFE_THRESHOLD} required
          {owners.length > 0 && (
            <>
              {" "}
              · Safe owners:{" "}
              {owners.map((o, i) => (
                <span key={o}>
                  {i > 0 && ", "}
                  <AddressLink address={o} />
                </span>
              ))}
            </>
          )}
        </p>

        {sigs.length > 0 && (
          <ul className="space-y-1 text-xs text-white/60">
            {sigs.map((s) => (
              <li key={`${s.signer}-${s.safeTxHash}`}>
                <AddressLink address={s.signer} /> signed
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2">
          {isSafeOwner && requestId != null && (
            <button
              type="button"
              disabled={busy}
              onClick={signAsOwner}
              className="rounded-lg border border-holo-mint/40 bg-holo-mint/10 px-4 py-2 text-sm font-medium text-holo-mint disabled:opacity-40"
            >
              Sign as Safe owner
            </button>
          )}
          {requestId != null && sigs.length >= SAFE_THRESHOLD && (
            <button
              type="button"
              disabled={busy || !address}
              onClick={executeWithSigs}
              className="rounded-lg bg-holo-gradient px-4 py-2 text-sm font-semibold text-ink-950 disabled:opacity-40"
            >
              Execute (≥{SAFE_THRESHOLD} sigs)
            </button>
          )}
        </div>
      </div>

      {txHash && (
        <p className="text-xs">
          Tx: <TxLink hash={txHash} />
          {confirming && <span className="ml-2 text-white/50">confirming…</span>}
        </p>
      )}
      {statusMsg && <p className="text-sm text-emerald-400">{statusMsg}</p>}
      {errorMsg && <p className="text-sm text-rose-400">{errorMsg}</p>}
    </GlassPanel>
  );
}
