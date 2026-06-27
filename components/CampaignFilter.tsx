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
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-white/40">🔍</span>
        <input
          type="text"
          placeholder="Search campaigns..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="w-full rounded-lg border border-slate-300/80 bg-white/70 py-2 pl-8 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:ring-accent-shine/50"
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
                    : "border border-slate-300/80 text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-white/70 dark:hover:border-slate-600 dark:hover:text-white"
                }`}
              >
                {cat}
              </motion.button>
            );
          })}
        </div>

        <div className="hidden h-5 w-px bg-slate-300 dark:bg-slate-700 sm:block" />

        <select
          value={filters.status}
          onChange={(e) => update("status", e.target.value)}
          className="rounded-full border border-slate-300/80 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/40 dark:border-slate-700 dark:bg-white/5 dark:text-white/70 dark:focus:ring-accent-shine/50"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value} className="bg-white text-slate-900 dark:bg-black dark:text-white">
              {s.label}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-white/40">{total} campaigns</span>
          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={reset}
              className="text-xs text-slate-500 underline transition-colors hover:text-slate-700 dark:text-white/40 dark:hover:text-white/70"
            >
              Clear filters
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
