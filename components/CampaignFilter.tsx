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
      {/* Search bar */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
        <input
          type="text"
          placeholder="Search campaigns..."
          value={filters.search}
          onChange={e => update("search", e.target.value)}
          className="w-full pl-8 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        />
      </div>

      {/* Category + Status filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const val = cat === "All" ? "" : cat.toLowerCase();
            const active = filters.category === val;
            return (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => update("category", val)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  active
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white border text-gray-600 hover:border-emerald-400 hover:text-emerald-600"
                }`}
              >
                {cat}
              </motion.button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 hidden sm:block" />

        {/* Status select */}
        <select
          value={filters.status}
          onChange={e => update("status", e.target.value)}
          className="px-3 py-1 rounded-full text-xs font-medium border bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Results count + reset */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-gray-400">{total} campaigns</span>
          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={reset}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Clear filters
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}