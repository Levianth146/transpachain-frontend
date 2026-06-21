"use client";

import { motion } from "framer-motion";
import { GradientText } from "@/components/ui/GradientText";

interface PageShellProps {
  children: React.ReactNode;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "7xl";
  className?: string;
  browserTitle?: string;
}

const MAX_WIDTH: Record<NonNullable<PageShellProps["maxWidth"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "7xl": "max-w-7xl",
};

export function PageShell({
  children,
  eyebrow,
  title,
  description,
  actions,
  maxWidth = "7xl",
  className = "",
  browserTitle,
}: PageShellProps) {
  const resolvedBrowserTitle =
    browserTitle ?? (typeof title === "string" ? title : "TranspaChain");

  return (
    <div className="relative min-h-screen pb-24 pt-[72px]">
      <main
        className={`relative mx-auto ${MAX_WIDTH[maxWidth]} px-4 py-12 sm:px-6 lg:px-8 lg:py-14 ${className}`}
      >
        <motion.header
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          {eyebrow && <p className="section-eyebrow mb-3">{eyebrow}</p>}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
                {typeof title === "string" ? (
                  <GradientText>{title}</GradientText>
                ) : (
                  title
                )}
              </h1>
              {description && (
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-primary/48 sm:text-lg">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="browser-window-dark overflow-hidden"
        >
          <div className="browser-chrome-dark">
            <div className="flex gap-1.5" aria-hidden>
              <span className="browser-dot-indigo" />
              <span className="browser-dot-purple" />
              <span className="browser-dot-cyan" />
            </div>
            <span className="max-w-[50%] truncate text-center text-[11px] font-medium text-text-primary/35">
              {resolvedBrowserTitle}
            </span>
            <div className="flex gap-1.5 opacity-0" aria-hidden>
              <span className="h-2 w-2 rounded-full" />
              <span className="h-2 w-2 rounded-full" />
              <span className="h-2 w-2 rounded-full" />
            </div>
          </div>
          <div className="p-5 sm:p-6 lg:p-8">{children}</div>
        </motion.div>
      </main>
    </div>
  );
}
