"use client";

import { motion } from "framer-motion";
import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";

interface PageShellProps {
  children: React.ReactNode;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "7xl";
  className?: string;
  backgroundImage?: string;
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
  backgroundImage,
}: PageShellProps) {
  return (
    <AnimatedGradientBackground
      variant="subtle"
      className="min-h-screen bg-slate-50 dark:bg-black"
      backgroundImage={backgroundImage}
      backgroundOverlay="light"
    >
      <div className="relative z-10">
        {!backgroundImage && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(13,148,136,0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(94,234,212,0.1),transparent_70%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_60%_40%_at_80%_0%,rgba(124,58,237,0.06),transparent_70%)] dark:bg-[radial-gradient(ellipse_60%_40%_at_80%_0%,rgba(168,85,247,0.08),transparent_70%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[size:48px_48px] bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"
            />
          </>
        )}

        <main
          className={`relative mx-auto ${MAX_WIDTH[maxWidth]} px-4 py-12 sm:px-6 lg:px-8 lg:py-14 ${className}`}
        >
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            {eyebrow && (
              <p className="mb-3 text-[10px] font-display font-semibold uppercase tracking-[0.25em] text-teal-700 sm:text-xs dark:text-holo-mint">
                {eyebrow}
              </p>
            )}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                  {title}
                </h1>
                {description && (
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-lg">
                    {description}
                  </p>
                )}
              </div>
              {actions && <div className="shrink-0">{actions}</div>}
            </div>
          </motion.header>

          {children}
        </main>
      </div>
    </AnimatedGradientBackground>
  );
}
