import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <img src="/logo.svg" alt="" width={32} height={32} className="shrink-0" />
      <span className="font-display text-xl tracking-wide text-gold-500 group-hover:text-gold-400 transition-colors">
        TranspaChain
      </span>
    </Link>
  );
}
