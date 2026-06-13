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
      className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-lg shadow-black/20 ${className}`}
    >
      {children}
    </motion.div>
  );
}
