"use client";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

export function LearnMoreLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/about"
      className={`inline-flex items-center gap-1.5 text-sm text-accent-shine transition-colors hover:text-white ${className}`}
    >
      Learn how TranspaChain works
      <ArrowRight size={14} weight="bold" />
    </Link>
  );
}
