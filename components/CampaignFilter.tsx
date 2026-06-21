"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export interface FilterState {
  category: string;
  status: string;
  search: string;
}

const CATEGORIES = ["All", "Education", "Healthcare", "Disaster", "Environment", "Community"];
const STATUSES = [
  { label: "All", value: "" },
  { label: "Active", value: "0" },
  { label: "Completed", value: "1" },
  { label: "Failed", value: "2" },
  { label: "Cancelled", value: "3" },
];

interface Props {
  onFilter: (filters: FilterState) => void;
  total: number;
}

export function CampaignFilter({ onFilter, total }: Props) {
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    status: "",
    search: "",
  });

  const update = (key: keyof FilterState, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilter(next);
  };

  const hasFilters = filters.category || filters.status || filters.search;

  const reset = () => {
    const empty = { category: "", status: "", search: "" };
    setFilters(empty);
    onFilter(empty);
  };

  return (
    <div className="mb-6 space-y-3">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/40">🔍</span>
        <input
          type="text"
          placeholder="Search campaigns..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-white/5 py-2 pl-8 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-shine/50"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const val = cat === "All" ? "" : cat.toLowerCase();
            const active = filters.category === val;
            return (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => update("category", val)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  active
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "border border-gray-700 text-white/70 hover:border-gray-600 hover:text-white"
                }`}
              >
                {cat}
              </motion.button>
            );
          })}
        </div>

        <div className="hidden h-5 w-px bg-gray-700 sm:block" />

        <select
          value={filters.status}
          onChange={(e) => update("status", e.target.value)}
          className="rounded-full border border-gray-700 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 focus:outline-none focus:ring-2 focus:ring-accent-shine/50"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value} className="bg-black">
              {s.label}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-white/40">{total} campaigns</span>
          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={reset}
              className="text-xs text-white/40 underline transition-colors hover:text-white/70"
            >
              Clear filters
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
