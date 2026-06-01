"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useDonate } from "@/hooks/useDonationVault";
import { addToast, removeToast, updateToast } from "@/components/Toast";

export function DonateModal({ campaignId }: { campaignId: bigint }) {
  const { isConnected } = useAccount();
  const [amount, setAmount]   = useState("");
  const [open, setOpen]       = useState(false);
  const { donate, isPending, isConfirming, isSuccess, error } = useDonate();

  const handleDonate = () => {
    if (!amount || isNaN(Number(amount))) return;
    const toastId = addToast({ type: "pending", title: "Transaction pending...", message: "Confirm in MetaMask" });
    donate(campaignId, amount);
  };

  if (isSuccess) return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
      <p className="text-emerald-700 font-medium">✓ Donation confirmed! Impact NFT minted.</p>
    </div>
  );

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
      {error && <p className="text-xs text-red-500 mt-2">{error.message}</p>}
    </div>
  );
}
