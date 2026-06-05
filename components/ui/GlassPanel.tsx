"use client";
import { motion } from "framer-motion";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function GlassPanel({
  children,
  className = "",
  delay = 0,
  hover = true,
}: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-ink-900/60 backdrop-blur-md shadow-lg shadow-emerald-900/5 ${className}`}
    >
      {children}
    </motion.div>
  );
}
