"use client";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  variant?: "subtle" | "vivid" | "dark";
}

export function AnimatedGradientBackground({
  children,
  className = "",
  variant = "dark",
}: Props) {
  const vivid = variant === "vivid";

  return (
    <div className={`relative min-h-screen overflow-hidden bg-black text-white ${className}`}>
      <div className="absolute inset-0 -z-10">
        <motion.div
          className={`absolute -inset-[40%] rounded-full blur-3xl ${
            vivid ? "opacity-30" : "opacity-20"
          }`}
          style={{
            background:
              "conic-gradient(from 0deg, #64CEFB, #8b5cf6, #10b981, #64CEFB)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className={`absolute top-1/4 -right-1/4 h-[500px] w-[500px] rounded-full blur-3xl ${
            vivid ? "bg-accent-shine/25" : "bg-accent-shine/15"
          }`}
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute bottom-0 -left-1/4 h-[400px] w-[400px] rounded-full blur-3xl ${
            vivid ? "bg-purple-500/20" : "bg-purple-500/10"
          }`}
          animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-black/92 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-panel-glow opacity-60" />
      </div>
      {children}
    </div>
  );
}
