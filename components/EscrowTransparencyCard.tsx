"use client";
import { formatEther } from "viem";
import { useCampaignEscrow, useCanRefund } from "@/hooks/useDonationVault";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { Bank, ArrowCounterClockwise, Lock } from "@phosphor-icons/react";

export function EscrowTransparencyCard({
  campaignId,
  paymentToken = 0,
}: {
  campaignId: bigint;
  paymentToken?: number;
}) {
  const { address } = useAccount();
  const { data: escrow } = useCampaignEscrow(campaignId);
  const { data: refundInfo } = useCanRefund(campaignId, address);

  const escrowBal = escrow as bigint | undefined;
  const refund = refundInfo as [boolean, bigint, bigint] | undefined;
  const unit = paymentToken === 1 ? "USDC" : "ETH";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-ink-900 to-ink-950 text-cream-100 rounded-xl p-5 border border-gold-200/20"
    >
      <div className="flex items-center gap-2 mb-3">
        <Bank size={20} className="text-gold-400" weight="duotone" />
        <h3 className="font-semibold text-gold-400">Escrow Vault</h3>
      </div>
      <p className="text-xs text-cream-100/70 mb-4">
        Donations stay locked in DonationVault until donors approve milestones via DAO vote, or
        refunds apply if the campaign fails or is cancelled.
      </p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-white/5 p-3 border border-white/10">
          <p className="text-xs text-cream-100/60 flex items-center gap-1">
            <Lock size={12} /> In escrow
          </p>
          <p className="text-lg font-bold mt-1">
            {escrowBal !== undefined
              ? `${Number(formatEther(escrowBal)).toFixed(4)} ${unit}`
              : "—"}
          </p>
        </div>
        {address && (
          <div className="rounded-lg bg-white/5 p-3 border border-white/10">
            <p className="text-xs text-cream-100/60 flex items-center gap-1">
              <ArrowCounterClockwise size={12} /> Your refund
            </p>
            <p className="text-lg font-bold mt-1">
              {refund?.[0]
                ? `${Number(formatEther(refund[1])).toFixed(4)} ${unit}`
                : "Not eligible"}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
