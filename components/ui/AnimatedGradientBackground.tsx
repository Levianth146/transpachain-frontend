"use client";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  variant?: "subtle" | "vivid" | "dark";
  hasBackgroundImage?: boolean;
}

export function AnimatedGradientBackground({
  children,
  className = "",
  variant = "dark",
  hasBackgroundImage = false,
}: Props) {
  const vivid = variant === "vivid";
  const overlayOpacity = hasBackgroundImage ? "bg-black/45" : "bg-black/92";

  return (
    <div className={`relative min-h-screen overflow-hidden text-white ${className}`}>
      <div className="absolute inset-0 z-0">
        <motion.div
          className={`absolute -inset-[40%] rounded-full blur-3xl ${
            hasBackgroundImage ? "opacity-15" : vivid ? "opacity-30" : "opacity-20"
          }`}
          style={{
            background:
              "conic-gradient(from 0deg, #5eead4, #c4b5fd, #f9a8d4, #e2e8f0, #5eead4)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className={`absolute top-1/4 -right-1/4 h-[500px] w-[500px] rounded-full blur-3xl ${
            hasBackgroundImage ? "bg-holo-mint/10" : vivid ? "bg-holo-mint/25" : "bg-holo-mint/15"
          }`}
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute bottom-0 -left-1/4 h-[400px] w-[400px] rounded-full blur-3xl ${
            hasBackgroundImage
              ? "bg-holo-lavender/8"
              : vivid
                ? "bg-holo-lavender/20"
                : "bg-holo-lavender/10"
          }`}
          animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute top-0 left-1/3 h-[300px] w-[300px] rounded-full blur-3xl ${
            hasBackgroundImage ? "bg-holo-pink/6" : vivid ? "bg-holo-pink/15" : "bg-holo-pink/8"
          }`}
          animate={{ x: [0, 15, 0], y: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className={`absolute inset-0 ${overlayOpacity} backdrop-blur-[1px]`} />
        {!hasBackgroundImage && <div className="absolute inset-0 bg-panel-glow opacity-60" />}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
