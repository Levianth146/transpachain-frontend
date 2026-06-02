import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-2.5 select-none ${className}`}
      aria-label="TranspaChain home"
    >
      <img
        src="/logo.svg"
        alt=""
        width={34}
        height={34}
        className="shrink-0 drop-shadow-sm"
      />
      <span className="flex flex-col justify-center leading-none">
        <span className="font-display text-[1.375rem] font-normal tracking-tight">
          <span className="text-ink-900 transition-colors duration-200 dark:text-cream-50">
            Transpa
          </span>
          <span className="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent transition-all duration-200 group-hover:from-gold-300 group-hover:via-gold-400 group-hover:to-gold-500">
            Chain
          </span>
        </span>
      </span>
    </Link>
  );
}
