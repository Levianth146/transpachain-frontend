"use client";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

export function LearnMoreLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/about"
      className={`inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors ${className}`}
    >
      Learn how TranspaChain works
      <ArrowRight size={14} weight="bold" />
    </Link>
  );
}
