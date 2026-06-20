"use client";
import { formatCampaignAmountLabel } from "@/lib/format";
import { useCampaignEscrow, useCanRefund } from "@/hooks/useDonationVault";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { Bank, ArrowCounterClockwise, Lock } from "@phosphor-icons/react";
import { ContractLink } from "@/components/TxLink";
import { ADDRESSES } from "@/lib/contracts";

export function EscrowTransparencyCard({
  campaignId,
  paymentToken = 0,
  indexedRaised,
}: {
  campaignId: bigint;
  paymentToken?: number;
  indexedRaised?: number;
}) {
  const { address } = useAccount();
  const { data: escrow } = useCampaignEscrow(campaignId);
  const { data: refundInfo } = useCanRefund(campaignId, address);

  const escrowBal = escrow as bigint | undefined;
  const refund = refundInfo as [boolean, bigint, bigint] | undefined;
  const unit = paymentToken === 1 ? "USDC" : "ETH";
  const fractionDigits = paymentToken === 1 ? 2 : 4;
  const formatAmount = (value: bigint) =>
    formatCampaignAmountLabel(value, paymentToken, fractionDigits);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-holo-mint/20 bg-gradient-to-br from-ink-900/90 to-ink-950/90 p-5 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <Bank size={20} className="text-holo-mint" weight="duotone" />
        <h3 className="font-semibold text-holo-mint">Escrow Vault</h3>
      </div>
      <p className="text-xs text-white/60 mb-4">
        Net donations locked in{" "}
        <ContractLink address={ADDRESSES.donationVault} name="DonationVault" /> until donors approve
        milestones via DAO vote, or refunds apply if the campaign fails.
      </p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-white/5 p-3 border border-white/10">
          <p className="text-xs text-white/50 flex items-center gap-1">
            <Lock size={12} /> In escrow (on-chain)
          </p>
          <p className="text-lg font-bold mt-1 text-white">
            {escrowBal !== undefined ? formatAmount(escrowBal) : "—"}
          </p>
          <p className="text-[10px] text-white/40 mt-1">Live vault balance · net after 1% fee</p>
        </div>
        {indexedRaised !== undefined && (
          <div className="rounded-lg bg-white/5 p-3 border border-white/10">
            <p className="text-xs text-white/50">Indexed raised</p>
            <p className="text-lg font-bold mt-1 text-white/80">
              {indexedRaised.toFixed(fractionDigits)} {unit}
            </p>
            <p className="text-[10px] text-white/40 mt-1">MongoDB · may lag if RPC paused</p>
          </div>
        )}
        {address && (
          <div className="rounded-lg bg-white/5 p-3 border border-white/10">
            <p className="text-xs text-white/50 flex items-center gap-1">
              <ArrowCounterClockwise size={12} /> Your refund
            </p>
            <p className="text-lg font-bold mt-1">
              {refund?.[0] ? formatAmount(refund[1]) : "Not eligible"}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
