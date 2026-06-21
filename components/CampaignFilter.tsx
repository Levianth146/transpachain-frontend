"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlass } from "@phosphor-icons/react";

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
        <MagnifyingGlass
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          type="text"
          placeholder="Search campaigns..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="input-glass pl-10"
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
                    ? "bg-brand-teal text-white shadow-sm"
                    : "border border-slate-200 bg-white/80 text-slate-600 hover:border-brand-teal/30 hover:text-brand-navy"
                }`}
              >
                {cat}
              </motion.button>
            );
          })}
        </div>

        <div className="hidden h-5 w-px bg-slate-200 sm:block" />

        <select
          value={filters.status}
          onChange={(e) => update("status", e.target.value)}
          className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-500">{total} campaigns</span>
          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={reset}
              className="text-xs text-slate-500 underline transition-colors hover:text-brand-teal"
            >
              Clear filters
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
