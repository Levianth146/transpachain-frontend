"use client";
import { motion } from "framer-motion";

function Shimmer({ className }: { className: string }) {
  return (
    <motion.div
      className={`bg-gray-200 rounded ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export function CampaignCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      {/* Image skeleton */}
      <Shimmer className="w-full h-48" />
      <div className="p-5 space-y-3">
        {/* Title + badge */}
        <div className="flex justify-between items-start gap-2">
          <Shimmer className="h-5 w-3/4" />
          <Shimmer className="h-5 w-16 rounded-full shrink-0" />
        </div>
        {/* Org name */}
        <Shimmer className="h-3 w-1/3" />
        {/* Description */}
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-4/5" />
        {/* Progress bar */}
        <Shimmer className="h-2 w-full rounded-full mt-2" />
        {/* Stats row */}
        <div className="flex justify-between">
          <Shimmer className="h-4 w-1/3" />
          <Shimmer className="h-4 w-1/4" />
        </div>
        {/* Footer */}
        <div className="flex justify-between pt-1">
          <Shimmer className="h-3 w-1/4" />
          <Shimmer className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function CampaignListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <CampaignCardSkeleton key={i} />
      ))}
    </div>
  );
}