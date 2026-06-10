"use client";

const SEPOLIA_SCAN = "https://sepolia.etherscan.io/tx";

export function txExplorerUrl(hash: string) {
  return `${SEPOLIA_SCAN}/${hash}`;
}

export function TxLink({
  hash,
  label = "View on SepoliaScan",
  className = "",
}: {
  hash?: string | null;
  label?: string;
  className?: string;
}) {
  if (!hash) return null;
  const short = `${hash.slice(0, 8)}…${hash.slice(-6)}`;
  return (
    <a
      href={txExplorerUrl(hash)}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-emerald-600 dark:text-emerald-400 hover:underline text-xs font-mono ${className}`}
      title={hash}
    >
      {label === "View on SepoliaScan" ? short : label}
    </a>
  );
}
