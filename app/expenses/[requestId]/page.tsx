"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TxLink, AddressLink } from "@/components/TxLink";
import { VerifyReceiptFile } from "@/components/VerifyReceiptFile";
import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";
import { api } from "@/lib/api";
import { getProofIpfsUrl } from "@/lib/ipfs";
import { EXPLORER_NAME } from "@/lib/chain";

interface Props {
  params: Promise<{ requestId: string }>;
}

type Expense = {
  requestId: number;
  campaignId: number;
  milestoneIdx?: number;
  proposalId?: number;
  token?: string;
  recipient?: string;
  amount?: string;
  receiptHash?: string;
  receiptCid?: string;
  requestHash?: string;
  status?: string;
  validUntil?: number;
  requestedTxHash?: string;
  executedTxHash?: string;
  cancelledTxHash?: string;
};

type Sig = {
  signer: string;
  signature: string;
  safeTxHash: string;
  createdAt?: string;
};

export default function ExpenseDetailPage({ params }: Props) {
  const { requestId: requestIdRaw } = React.use(params);
  const requestId = Number(requestIdRaw);

  const [expense, setExpense] = useState<Expense | null>(null);
  const [signatures, setSignatures] = useState<Sig[]>([]);
  const [disclaimer, setDisclaimer] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(requestId) || requestId < 1) {
      setError("Invalid request id");
      setLoading(false);
      return;
    }
    let cancelled = false;
    api
      .getExpense(requestId)
      .then((data) => {
        if (cancelled) return;
        setExpense((data.expense as Expense) || null);
        setSignatures((data.signatures as Sig[]) || []);
        setDisclaimer(
          typeof data.disclaimer === "string"
            ? data.disclaimer
            : "Receipt SHA-256 proves file integrity only — it is not proof of goods/services delivery."
        );
        setError(null);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Expense not found");
          setExpense(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [requestId]);

  if (loading) {
    return (
      <PageShell eyebrow="Expense" title={`Request #${requestIdRaw}`} maxWidth="3xl">
        <p className="text-sm text-white/50">Loading…</p>
      </PageShell>
    );
  }

  if (error || !expense) {
    return (
      <AnimatedGradientBackground variant="subtle" className="min-h-screen">
        <div className="p-8 text-center text-white/70">{error || "Expense not found"}</div>
      </AnimatedGradientBackground>
    );
  }

  const ipfs = getProofIpfsUrl(expense.receiptCid);
  const safeTxHash = signatures[0]?.safeTxHash;

  return (
    <PageShell
      eyebrow="Public expense"
      title={`Request #${expense.requestId}`}
      description={
        <>
          Campaign{" "}
          <Link href={`/campaigns/${expense.campaignId}`} className="text-holo-mint hover:underline">
            #{expense.campaignId}
          </Link>
          {" · "}
          Milestone {(expense.milestoneIdx ?? 0) + 1}
          {" · "}
          <span className="capitalize">{expense.status}</span>
        </>
      }
      maxWidth="3xl"
    >
      <div className="space-y-4">
        <GlassPanel holoBorder className="space-y-3 p-5">
          <Row label="Amount (raw units)" value={expense.amount ?? "—"} mono />
          <Row
            label="Recipient"
            value={
              expense.recipient ? <AddressLink address={expense.recipient} /> : "—"
            }
          />
          <Row
            label="Token"
            value={
              expense.token ? <AddressLink address={expense.token} /> : "native / unset"
            }
          />
          <Row
            label="DAO proposal"
            value={
              expense.proposalId != null && expense.proposalId > 0 ? (
                <Link
                  href={`/governance/${expense.proposalId}`}
                  className="text-holo-mint hover:underline"
                >
                  Proposal #{expense.proposalId}
                </Link>
              ) : (
                "—"
              )
            }
          />
          <Row
            label={`Safe / exec tx (${EXPLORER_NAME})`}
            value={
              expense.executedTxHash ? (
                <TxLink hash={expense.executedTxHash} />
              ) : (
                <span className="text-white/40">Not executed yet</span>
              )
            }
          />
          {expense.requestedTxHash && (
            <Row
              label="Request tx"
              value={<TxLink hash={expense.requestedTxHash} />}
            />
          )}
          {safeTxHash && (
            <Row label="Safe tx hash" value={safeTxHash} mono />
          )}
        </GlassPanel>

        <GlassPanel className="space-y-3 p-5">
          <h2 className="font-semibold text-white">Signers</h2>
          {signatures.length === 0 ? (
            <p className="text-sm text-white/50">No Safe signatures stored yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {signatures.map((s) => (
                <li key={`${s.signer}-${s.safeTxHash}`} className="text-white/70">
                  <AddressLink address={s.signer} />
                  <span className="ml-2 font-mono text-[10px] text-white/40">
                    {s.safeTxHash.slice(0, 10)}…
                  </span>
                </li>
              ))}
            </ul>
          )}
        </GlassPanel>

        <GlassPanel className="space-y-3 p-5">
          <h2 className="font-semibold text-white">Receipt</h2>
          <Row label="CID" value={expense.receiptCid || "—"} mono />
          {ipfs && (
            <a
              href={ipfs}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-accent-shine hover:underline"
            >
              Open on IPFS ↗
            </a>
          )}
          <Row label="SHA-256 (bytes32)" value={expense.receiptHash || "—"} mono />
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100">
            {disclaimer}
          </p>
          <VerifyReceiptFile expectedHash={expense.receiptHash} />
        </GlassPanel>
      </div>
    </PageShell>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="text-xs text-white/50">{label}</span>
      <span
        className={`text-sm text-white ${mono ? "break-all font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
