"use client";

import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  index?: number;
  hoverScale?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  index = 0,
  hoverScale = false,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: delay + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={hoverScale ? { scale: 1.03 } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
