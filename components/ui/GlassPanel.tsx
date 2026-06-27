"use client";
import { motion } from "framer-motion";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  holoBorder?: boolean;
}

export function GlassPanel({
  children,
  className = "",
  delay = 0,
  hover = true,
  holoBorder = false,
}: GlassPanelProps) {
  const base =
    "rounded-2xl border border-slate-200/80 bg-white/75 text-slate-900 backdrop-blur-md shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:shadow-black/20";
  const holo =
    "relative overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:p-px before:bg-holo-gradient before:opacity-0 before:transition-opacity hover:before:opacity-40 after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:bg-holo-gradient-subtle after:opacity-0 after:transition-opacity hover:after:opacity-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`${base} ${holoBorder ? holo : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
