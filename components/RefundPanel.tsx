"use client";
import { useAccount } from "wagmi";
import { formatEther, formatUnits } from "viem";
import { useCanRefund, useClaimRefund } from "@/hooks/useDonationVault";
import { addToast } from "@/components/Toast";
import { useEffect } from "react";
import { ArrowsCounterClockwise } from "@phosphor-icons/react";

export function RefundPanel({
  campaignId,
  paymentToken = 0,
}: {
  campaignId: bigint;
  paymentToken?: number;
}) {
  const { address, isConnected } = useAccount();
  const { data: refundInfo, refetch } = useCanRefund(campaignId, address);
  const { claimRefund, isPending, isConfirming, isSuccess, error } = useClaimRefund();

  const eligible = refundInfo?.[0] ?? false;
  const amount = refundInfo?.[1] ?? 0n;

  useEffect(() => {
    if (isSuccess) {
      addToast({ type: "success", title: "Refund claimed", message: "Funds returned to your wallet" });
      refetch();
    }
  }, [isSuccess, refetch]);

  if (!isConnected) return null;

  const formatted =
    paymentToken === 1
      ? `${formatUnits(amount, 6)} USDC`
      : `${formatEther(amount)} ETH`;

  return (
    <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-5">
      <h3 className="font-semibold text-amber-900 flex items-center gap-2 mb-2">
        <ArrowsCounterClockwise size={18} weight="duotone" />
        Refund
      </h3>
      {eligible && amount > 0n ? (
        <>
          <p className="text-sm text-amber-800 mb-3">
            You can reclaim <span className="font-mono font-medium">{formatted}</span> from escrow.
          </p>
          <button
            onClick={() => {
              addToast({ type: "pending", title: "Claiming refund...", message: "Confirm in MetaMask" });
              claimRefund(campaignId);
            }}
            disabled={isPending || isConfirming}
            className="w-full py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50"
          >
            {isPending || isConfirming ? "Processing..." : "Claim refund"}
          </button>
        </>
      ) : (
        <p className="text-sm text-amber-700/80">Not eligible yet (campaign active and before deadline).</p>
      )}
      {error && <p className="text-xs text-red-600 mt-2">{error.message}</p>}
    </div>
  );
}
