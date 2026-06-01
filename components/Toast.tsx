"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "pending" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

const ICONS: Record<ToastType, string> = {
  success: "✅",
  error:   "❌",
  pending: "⏳",
  info:    "ℹ️",
};

const COLORS: Record<ToastType, string> = {
  success: "border-emerald-500 bg-emerald-50 text-emerald-900",
  error:   "border-red-500 bg-red-50 text-red-900",
  pending: "border-amber-500 bg-amber-50 text-amber-900",
  info:    "border-blue-500 bg-blue-50 text-blue-900",
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    if (toast.type === "pending") return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [toast.type, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-start gap-3 w-80 border-l-4 rounded-lg shadow-lg p-4 pr-3 ${COLORS[toast.type]}`}
    >
      <span className="text-lg shrink-0">{ICONS[toast.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{toast.title}</p>
        {toast.message && (
          <p className="text-xs opacity-75 mt-0.5 truncate">{toast.message}</p>
        )}
      </div>
      <button onClick={onClose} className="shrink-0 opacity-40 hover:opacity-70 text-lg leading-none">×</button>
    </motion.div>
  );
}

let _setToasts: React.Dispatch<React.SetStateAction<Toast[]>> | null = null;

export function addToast(toast: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  _setToasts?.((prev) => [...prev, { ...toast, id }]);
  return id;
}

export function removeToast(id: string) {
  _setToasts?.((prev) => prev.filter((t) => t.id !== id));
}

export function updateToast(id: string, toast: Partial<Omit<Toast, "id">>) {
  _setToasts?.((prev) => prev.map((t) => (t.id === id ? { ...t, ...toast } : t)));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  _setToasts = setToasts;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem
              toast={toast}
              onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}