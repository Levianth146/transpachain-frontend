/** Spec §4.3 — show on every yield figure (Fuji mock vault only). */
export function MockYieldBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200 ${className}`}
    >
      Fuji Testnet · Mock Yield
    </span>
  );
}
