"use client";

import { motion } from "framer-motion";

interface BrowserWindowCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  bodyClassName?: string;
  delay?: number;
  chrome?: boolean;
  animate?: boolean;
}

export function BrowserWindowCard({
  children,
  title = "TranspaChain",
  className = "",
  bodyClassName = "",
  delay = 0,
  chrome = true,
  animate = true,
}: BrowserWindowCardProps) {
  const card = (
    <div className={`browser-window overflow-hidden ${className}`}>
      {chrome && (
        <div className="browser-chrome">
          <div className="browser-dots" aria-hidden>
            <span className="browser-dot browser-dot-red" />
            <span className="browser-dot browser-dot-yellow" />
            <span className="browser-dot browser-dot-green" />
          </div>
          <span className="browser-title">{title}</span>
          <div className="browser-dots browser-dots-ghost" aria-hidden>
            <span className="browser-dot browser-dot-ghost" />
            <span className="browser-dot browser-dot-ghost" />
            <span className="browser-dot browser-dot-ghost" />
          </div>
        </div>
      )}
      <div className={`relative ${bodyClassName}`}>{children}</div>
    </div>
  );

  if (!animate) return card;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {card}
    </motion.div>
  );
}
