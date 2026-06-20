"use client";

import { motion } from "framer-motion";
import { ElementType, ReactNode } from "react";

interface StatGradientCardProps {
  value: ReactNode;
  label: string;
  icon?: ElementType;
  iconClassName?: string;
  valueClassName?: string;
  delay?: number;
  className?: string;
}

export function StatGradientCard({
  value,
  label,
  icon: Icon,
  iconClassName = "text-brand-teal",
  valueClassName = "text-brand-navy",
  delay = 0,
  className = "",
}: StatGradientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03 }}
      className={`stat-gradient-card group ${className}`}
    >
      <div className={`relative font-display text-2xl font-bold sm:text-3xl ${valueClassName}`}>
        {value}
      </div>
      <div className="relative mt-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-500">
        {Icon && <Icon size={13} className="opacity-60" />}
        {label}
      </div>
    </motion.div>
  );
}
