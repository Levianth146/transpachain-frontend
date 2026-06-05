"use client";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  variant?: "subtle" | "vivid";
}

export function AnimatedGradientBackground({
  children,
  className = "",
  variant = "subtle",
}: Props) {
  const vivid = variant === "vivid";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 -z-10">
        <motion.div
          className={`absolute -inset-[40%] rounded-full blur-3xl ${
            vivid ? "opacity-40" : "opacity-25"
          }`}
          style={{
            background:
              "conic-gradient(from 0deg, #10b981, #06b6d4, #8b5cf6, #10b981)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className={`absolute top-1/4 -right-1/4 w-[500px] h-[500px] rounded-full blur-3xl ${
            vivid ? "bg-emerald-400/30" : "bg-emerald-400/15"
          }`}
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute bottom-0 -left-1/4 w-[400px] h-[400px] rounded-full blur-3xl ${
            vivid ? "bg-teal-400/25" : "bg-teal-400/10"
          }`}
          animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-cream-50/80 dark:bg-ink-950/85 backdrop-blur-[1px]" />
      </div>
      {children}
    </div>
  );
}
