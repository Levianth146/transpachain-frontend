"use client";
import { motion } from "framer-motion";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  holoBorder?: boolean;
  index?: number;
}

export function GlassPanel({
  children,
  className = "",
  delay = 0,
  hover = true,
  holoBorder = false,
  index = 0,
}: GlassPanelProps) {
  const base =
    "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-lg shadow-black/20";
  const holo =
    "relative overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:p-px before:bg-holo-gradient before:opacity-0 before:transition-opacity hover:before:opacity-40 after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:bg-holo-gradient-subtle after:opacity-0 after:transition-opacity hover:after:opacity-100";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: delay + index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={hover ? { scale: 1.02, transition: { duration: 0.2 } } : undefined}
      className={`${base} ${holoBorder ? holo : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
