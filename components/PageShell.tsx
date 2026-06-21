"use client";

import { motion } from "framer-motion";
import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";
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
    <AnimatedGradientBackground variant="dark" className="min-h-screen bg-black pb-24">
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(111,56,218,0.15),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_60%_40%_at_80%_0%,rgba(140,103,255,0.1),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)]"
        />

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
                <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {typeof title === "string" ? (
                    <>
                      <GradientText>{title}</GradientText>
                    </>
                  ) : (
                    title
                  )}
                </h1>
                {description && (
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
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
            className="browser-window overflow-hidden"
          >
            <div className="browser-chrome">
              <div className="browser-dots" aria-hidden>
                <span className="browser-dot browser-dot-red" />
                <span className="browser-dot browser-dot-yellow" />
                <span className="browser-dot browser-dot-green" />
              </div>
              <span className="browser-title">{resolvedBrowserTitle}</span>
              <div className="browser-dots browser-dots-ghost" aria-hidden>
                <span className="browser-dot browser-dot-ghost" />
                <span className="browser-dot browser-dot-ghost" />
                <span className="browser-dot browser-dot-ghost" />
              </div>
            </div>
            <div className="p-5 sm:p-6 lg:p-8">{children}</div>
          </motion.div>
        </main>
      </div>
    </AnimatedGradientBackground>
  );
}
