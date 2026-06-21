import Link from "next/link";

interface LogoProps {
  className?: string;
  dark?: boolean;
}

export function Logo({ className = "", dark = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={`group flex select-none items-center gap-2.5 transition-transform duration-200 hover:scale-105 ${className}`}
      aria-label="TranspaChain home"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-indigo-500 to-purple-500">
        <span className="font-display text-base font-bold leading-none text-white">◈</span>
      </span>
      <span
        className={`font-display text-[17px] font-bold tracking-[-0.02em] ${
          dark ? "text-text-primary" : "text-brand-navy"
        }`}
      >
        TranspaChain
      </span>
    </Link>
  );
}
