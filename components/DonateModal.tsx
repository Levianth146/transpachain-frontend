"use client";
import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { useDonate } from "@/hooks/useDonationVault";
import { addToast } from "@/components/Toast";

export function DonateModal({ campaignId }: { campaignId: bigint }) {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const { donate, isPending, isConfirming, isSuccess, error } = useDonate();
  const prevPending = useRef(false);
  const prevConfirming = useRef(false);

  useEffect(() => {
    if (isPending && !prevPending.current) {
      addToast({ type: "pending", title: "Confirm in MetaMask...", message: "Waiting for signature" });
    }
    prevPending.current = isPending;
  }, [isPending]);

  useEffect(() => {
    if (isConfirming && !prevConfirming.current) {
      addToast({ type: "info", title: "Transaction submitted", message: "Waiting for confirmation..." });
    }
    prevConfirming.current = isConfirming;
  }, [isConfirming]);

  useEffect(() => {
    if (isSuccess) {
      addToast({ type: "success", title: "Donation confirmed!", message: "Impact NFT minted 🎉" });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      addToast({ type: "error", title: "Transaction failed", message: error.message.slice(0, 80) });
    }
  }, [error]);

  const handleDonate = () => {
    if (!amount || isNaN(Number(amount))) return;
    donate(campaignId, amount);
  };

  return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold mb-3">Make a Donation</h3>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Amount in ETH"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          min="0"
          step="0.001"
        />
        <button
          onClick={handleDonate}
          disabled={!isConnected || isPending || isConfirming}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700"
        >
          {isPending ? "Confirm..." : isConfirming ? "Mining..." : "Donate"}
        </button>
      </div>
      {!isConnected && <p className="text-xs text-amber-600 mt-2">Connect wallet to donate</p>}
    </div>
  );
}
