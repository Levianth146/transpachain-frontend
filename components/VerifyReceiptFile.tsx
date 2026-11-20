"use client";

import { useState } from "react";
import { FileUploadButton } from "@/components/FileUploadButton";
import { hashesMatch, sha256File } from "@/lib/sha256";

type Props = {
  expectedHash?: string | null;
  className?: string;
};

/**
 * Client-side "verify my file" — SHA-256 of local bytes vs stored receiptHash.
 * Disclaimer: hash ≠ delivery proof (spec §4.3).
 */
export function VerifyReceiptFile({ expectedHash, className = "" }: Props) {
  const [result, setResult] = useState<"idle" | "match" | "mismatch" | "error">("idle");
  const [computed, setComputed] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (file: File | null) => {
    setResult("idle");
    setComputed(null);
    if (!file) return;
    setBusy(true);
    try {
      const hash = await sha256File(file);
      setComputed(hash);
      if (!expectedHash) {
        setResult("idle");
        return;
      }
      setResult(hashesMatch(hash, expectedHash) ? "match" : "mismatch");
    } catch {
      setResult("error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-sm font-medium text-white">Verify my file</p>
      <p className="text-xs text-white/50">
        Computes SHA-256 of the exact file bytes in your browser and compares to the on-record
        receipt hash. Matching proves file integrity only — it is not proof of goods or services
        delivery.
      </p>
      <FileUploadButton
        accept="*/*"
        label="Choose receipt file"
        uploading={busy}
        uploadingLabel="Hashing…"
        onChange={onFile}
        variant="compact"
      />
      {computed && (
        <p className="break-all font-mono text-[11px] text-white/60">
          Local SHA-256: {computed}
        </p>
      )}
      {result === "match" && (
        <p className="text-sm text-emerald-400">Hash matches the recorded receipt.</p>
      )}
      {result === "mismatch" && (
        <p className="text-sm text-rose-400">Hash does not match — file may be different or tampered.</p>
      )}
      {result === "error" && (
        <p className="text-sm text-rose-400">Could not hash this file.</p>
      )}
    </div>
  );
}
