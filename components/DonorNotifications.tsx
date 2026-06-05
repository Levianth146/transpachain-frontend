"use client";
import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCircle, XCircle } from "@phosphor-icons/react";
import { useSocketEvents } from "@/hooks/useSocket";
import { addToast } from "@/components/Toast";
import { api } from "@/lib/api";
import Link from "next/link";

type Notification = {
  id: string;
  type: "executed" | "defeated";
  proposalId: number;
  campaignTitle?: string;
  at: number;
};

const STORAGE_KEY = "tc-notifications";

function loadNotifications(): Notification[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveNotifications(items: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 20)));
}

export function DonorNotifications() {
  const { address } = useAccount();
  const [items, setItems] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    setItems(loadNotifications());
  }, []);

  const pushNotification = useCallback(async (type: "executed" | "defeated", proposalId: number) => {
    let campaignTitle: string | undefined;
    try {
      const { proposals } = await api.getProposals();
      const match = proposals?.find((p: { proposalId: number }) => p.proposalId === proposalId);
      campaignTitle = match?.campaignTitle;
    } catch { /* ignore */ }

    const note: Notification = {
      id: `${type}-${proposalId}-${Date.now()}`,
      type,
      proposalId,
      campaignTitle,
      at: Date.now(),
    };

    setItems((prev) => {
      const next = [note, ...prev].slice(0, 20);
      saveNotifications(next);
      return next;
    });

    addToast({
      type: type === "executed" ? "success" : "info",
      title: type === "executed" ? "Proposal executed" : "Proposal defeated",
      message: campaignTitle ? `${campaignTitle} · #${proposalId}` : `Proposal #${proposalId}`,
    });
  }, []);

  useSocketEvents({
    proposalExecuted: (data) => {
      if (data?.proposalId) pushNotification("executed", data.proposalId);
    },
    proposalDefeated: (data) => {
      if (data?.proposalId) pushNotification("defeated", data.proposalId);
    },
  });

  if (!address) return null;

  const visible = items.filter((n) => !dismissed.has(n.id));
  if (visible.length === 0) return null;

  return (
    <GlassPanelWrap>
      <div className="flex items-center gap-2 mb-3">
        <Bell size={18} className="text-blue-500" weight="duotone" />
        <h3 className="font-semibold text-sm">Governance updates</h3>
      </div>
      <ul className="space-y-2">
        <AnimatePresence>
          {visible.slice(0, 5).map((n) => (
            <motion.li
              key={n.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`flex items-start gap-2 text-sm rounded-lg px-3 py-2 ${
                n.type === "executed"
                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300"
                  : "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300"
              }`}
            >
              {n.type === "executed" ? (
                <CheckCircle size={16} className="shrink-0 mt-0.5" />
              ) : (
                <XCircle size={16} className="shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium">
                  {n.type === "executed" ? "Funds released" : "Proposal defeated"}
                </p>
                <p className="text-xs opacity-80 truncate">
                  {n.campaignTitle ?? `Proposal #${n.proposalId}`}
                </p>
                <Link href={`/governance/${n.proposalId}`} className="text-xs underline opacity-70">
                  View details
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setDismissed((s) => new Set(s).add(n.id))}
                className="opacity-50 hover:opacity-100"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </GlassPanelWrap>
  );
}

function GlassPanelWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-ink-900/60 backdrop-blur-md shadow-lg p-5 mb-8"
    >
      {children}
    </motion.div>
  );
}
