"use client";
import { motion } from "framer-motion";
import { PageBackground } from "@/components/ui/PageBackground";

interface Props {
  children: React.ReactNode;
  className?: string;
  variant?: "subtle" | "vivid" | "dark";
  backgroundImage?: string;
  backgroundOverlay?: "dark" | "light" | "hero";
}

export function AnimatedGradientBackground({
  children,
  className = "",
  variant = "subtle",
  backgroundImage,
  backgroundOverlay = "dark",
}: Props) {
  const vivid = variant === "vivid";
  const hasBackgroundImage = Boolean(backgroundImage);

  return (
    <div
      className={`relative min-h-screen overflow-hidden text-slate-900 dark:text-white ${className}`}
    >
      <div className="absolute inset-0 z-0">
        {backgroundImage && (
          <PageBackground image={backgroundImage} overlay={backgroundOverlay} />
        )}

        <motion.div
          className={`absolute -inset-[40%] rounded-full blur-3xl ${
            hasBackgroundImage ? "opacity-0 dark:opacity-10" : vivid ? "opacity-20 dark:opacity-30" : "opacity-10 dark:opacity-20"
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
            hasBackgroundImage
              ? "opacity-0 dark:opacity-100 dark:bg-holo-mint/10"
              : vivid
                ? "bg-teal-400/20 dark:bg-holo-mint/25"
                : "bg-teal-400/15 dark:bg-holo-mint/15"
          }`}
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute bottom-0 -left-1/4 h-[400px] w-[400px] rounded-full blur-3xl ${
            hasBackgroundImage
              ? "opacity-0 dark:opacity-100 dark:bg-holo-lavender/8"
              : vivid
                ? "bg-violet-400/15 dark:bg-holo-lavender/20"
                : "bg-violet-400/10 dark:bg-holo-lavender/10"
          }`}
          animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute top-0 left-1/3 h-[300px] w-[300px] rounded-full blur-3xl ${
            hasBackgroundImage
              ? "opacity-0 dark:opacity-100 dark:bg-holo-pink/6"
              : vivid
                ? "bg-pink-400/12 dark:bg-holo-pink/15"
                : "bg-pink-400/8 dark:bg-holo-pink/8"
          }`}
          animate={{ x: [0, 15, 0], y: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {!hasBackgroundImage && (
          <>
            <div className="absolute inset-0 mesh-bg opacity-90 dark:opacity-100" />
            <div className="absolute inset-0 bg-slate-50/80 dark:bg-black/92 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-panel-glow opacity-40 dark:opacity-60" />
          </>
        )}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
