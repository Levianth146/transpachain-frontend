"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { addToast } from "@/components/Toast";
import { motion } from "framer-motion";

export function AdminOrgProfiles() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getPendingOrgProfiles();
      setProfiles(data.profiles ?? []);
    } catch {
      addToast({ type: "error", title: "Failed to load org profiles" });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const review = async (orgAddress: string, status: "approved" | "rejected") => {
    try {
      await api.reviewOrgProfile(orgAddress, status);
      addToast({
        type: "success",
        title: status === "approved" ? "Profile approved" : "Profile rejected",
        message: "On-chain verifyOrg is still required",
      });
      load();
    } catch {
      addToast({ type: "error", title: "Review failed" });
    }
  };

  if (loading) return <p className="text-sm text-gray-400">Loading applications…</p>;
  if (profiles.length === 0) {
    return <p className="text-sm text-gray-500">No pending organization profiles.</p>;
  }

  return (
    <div className="space-y-3">
      {profiles.map((p) => (
        <motion.div
          key={p.orgAddress}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="border rounded-lg p-4 bg-white dark:bg-ink-900"
        >
          <p className="font-semibold">{p.legalName || "Unnamed org"}</p>
          <p className="text-xs font-mono text-gray-500 mt-1">{p.orgAddress}</p>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.description}</p>
          <p className="text-xs text-gray-400 mt-1">
            {p.country} · {p.website || "no website"}
          </p>
          {p.registrationDocCID && (
            <a
              href={`https://gateway.pinata.cloud/ipfs/${p.registrationDocCID}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              View registration doc ↗
            </a>
          )}
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => review(p.orgAddress, "approved")}
              className="text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-md"
            >
              Approve (off-chain)
            </button>
            <button
              type="button"
              onClick={() => review(p.orgAddress, "rejected")}
              className="text-xs px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-md"
            >
              Reject
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
