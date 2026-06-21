"use client";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  variant?: "subtle" | "vivid" | "dark" | "light";
}

export function AnimatedGradientBackground({
  children,
  className = "",
  variant = "light",
}: Props) {
  const isDark = variant === "dark";
  const vivid = variant === "vivid";

  return (
    <div
      className={`relative min-h-screen overflow-hidden ${
        isDark ? "bg-black text-white" : "bg-surface-base text-brand-charcoal"
      } ${className}`}
    >
      <div className="absolute inset-0 -z-10">
        <motion.div
          className={`absolute -inset-[40%] rounded-full blur-3xl ${
            vivid ? "opacity-20" : "opacity-10"
          }`}
          style={{
            background:
              "conic-gradient(from 0deg, #2dd4bf, #c4b5fd, #f9a8d4, #e2e8f0, #2dd4bf)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className={`absolute top-1/4 -right-1/4 h-[500px] w-[500px] rounded-full blur-3xl ${
            isDark
              ? vivid ? "bg-holo-mint/25" : "bg-holo-mint/15"
              : "bg-teal-200/30"
          }`}
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute bottom-0 -left-1/4 h-[400px] w-[400px] rounded-full blur-3xl ${
            isDark
              ? vivid ? "bg-holo-lavender/20" : "bg-holo-lavender/10"
              : "bg-violet-200/25"
          }`}
          animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute top-0 left-1/3 h-[300px] w-[300px] rounded-full blur-3xl ${
            isDark
              ? vivid ? "bg-holo-pink/15" : "bg-holo-pink/8"
              : "bg-pink-200/20"
          }`}
          animate={{ x: [0, 15, 0], y: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-black/92 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-panel-glow opacity-60" />
          </>
        ) : (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
        )}
      </div>
      {children}
    </div>
  );
}
