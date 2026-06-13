"use client";
import { motion } from "framer-motion";
import { CheckCircle, Circle, XCircle, Clock } from "@phosphor-icons/react";

export function CampaignStatusTimeline({
  status,
  completedMilestones,
  totalMilestones,
  deadline,
}: {
  status: number;
  completedMilestones: number;
  totalMilestones: number;
  deadline: number;
}) {
  const now = Math.floor(Date.now() / 1000);
  const daysLeft = Math.max(0, Math.ceil((deadline - now) / 86400));

  const isFailed = status === 2 || status === 3;
  const isSuccess = status === 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
    >
      <h3 className="mb-4 font-semibold text-white">Campaign journey</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {status === 0 ? (
            <Clock className="text-emerald-500" size={22} weight="duotone" />
          ) : isSuccess ? (
            <CheckCircle className="text-emerald-500" size={22} weight="fill" />
          ) : (
            <XCircle className="text-red-500" size={22} weight="fill" />
          )}
          <div>
            <p className="text-sm font-medium text-white">
              {status === 0 && `Active — ${daysLeft}d left`}
              {status === 1 && "Goal reached — completed"}
              {status === 2 && "Failed — donors may refund"}
              {status === 3 && "Cancelled"}
            </p>
            <p className="text-xs text-white/50">
              Milestones released: {completedMilestones} / {totalMilestones}
            </p>
          </div>
        </div>
        <ul className="ml-2 space-y-3 border-l-2 border-emerald-500/30 pl-4">
          <li className="text-sm">
            <span className="font-medium text-white">1. Donors contribute</span>
            <p className="text-xs text-white/50">Funds enter escrow (minus 1% platform fee).</p>
          </li>
          <li className="text-sm">
            <span className="font-medium text-white">2. Org submits proof</span>
            <p className="text-xs text-white/50">Creates a DAO proposal per milestone.</p>
          </li>
          <li className="text-sm">
            <span className="font-medium text-white">3. Donors vote (51% quorum)</span>
            <p className="text-xs text-white/50">24h timelock after queue, then funds release.</p>
          </li>
          <li className="text-sm">
            <span className="font-medium text-white">4. Refund path</span>
            <p className="text-xs text-white/50">
              If failed or past deadline — proportional refund from remaining escrow.
            </p>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
