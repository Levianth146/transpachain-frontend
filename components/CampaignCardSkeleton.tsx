"use client";
import { motion } from "framer-motion";

function Shimmer({ className }: { className: string }) {
  return (
    <motion.div
      className={`rounded bg-white/10 ${className}`}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export function CampaignCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <Shimmer className="h-48 w-full" />
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <Shimmer className="h-5 w-3/4" />
          <Shimmer className="h-5 w-16 shrink-0 rounded-full" />
        </div>
        <Shimmer className="h-3 w-1/3" />
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-4/5" />
        <Shimmer className="mt-2 h-2 w-full rounded-full" />
        <div className="flex justify-between">
          <Shimmer className="h-4 w-1/3" />
          <Shimmer className="h-4 w-1/4" />
        </div>
        <div className="flex justify-between pt-1">
          <Shimmer className="h-3 w-1/4" />
          <Shimmer className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function CampaignListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CampaignCardSkeleton key={i} />
      ))}
    </div>
  );
}
