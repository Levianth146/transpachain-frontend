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
      className="bg-white dark:bg-ink-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5"
    >
      <h3 className="font-semibold mb-4 text-gray-900 dark:text-cream-100">Campaign journey</h3>
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
            <p className="text-sm font-medium">
              {status === 0 && `Active — ${daysLeft}d left`}
              {status === 1 && "Goal reached — completed"}
              {status === 2 && "Failed — donors may refund"}
              {status === 3 && "Cancelled"}
            </p>
            <p className="text-xs text-gray-500">
              Milestones released: {completedMilestones} / {totalMilestones}
            </p>
          </div>
        </div>
        <ul className="border-l-2 border-emerald-200 pl-4 space-y-3 ml-2">
          <li className="text-sm">
            <span className="font-medium">1. Donors contribute</span>
            <p className="text-xs text-gray-500">Funds enter escrow (minus 1% platform fee).</p>
          </li>
          <li className="text-sm">
            <span className="font-medium">2. Org submits proof</span>
            <p className="text-xs text-gray-500">Creates a DAO proposal per milestone.</p>
          </li>
          <li className="text-sm">
            <span className="font-medium">3. Donors vote (51% quorum)</span>
            <p className="text-xs text-gray-500">24h timelock after queue, then funds release.</p>
          </li>
          <li className="text-sm">
            <span className="font-medium">4. Refund path</span>
            <p className="text-xs text-gray-500">
              If failed or past deadline — proportional refund from remaining escrow.
            </p>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
