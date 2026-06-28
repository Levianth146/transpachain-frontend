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
    "rounded-2xl border border-slate-300 bg-white text-slate-800 shadow-md dark:border-white/10 dark:bg-slate-900/95 dark:text-slate-100 dark:shadow-black/20";
  const holo =
    "relative overflow-hidden dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:rounded-2xl dark:before:p-px dark:before:bg-holo-gradient dark:before:opacity-0 dark:before:transition-opacity dark:hover:before:opacity-40 dark:after:pointer-events-none dark:after:absolute dark:after:inset-0 dark:after:rounded-2xl dark:after:bg-holo-gradient-subtle dark:after:opacity-0 dark:after:transition-opacity dark:hover:after:opacity-100";

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
