"use client";

const SEPOLIA_BASE = "https://sepolia.etherscan.io";

export function txExplorerUrl(hash: string) {
  return `${SEPOLIA_BASE}/tx/${hash}`;
}

export function addressExplorerUrl(address: string) {
  return `${SEPOLIA_BASE}/address/${address}`;
}

export function tokenExplorerUrl(address: string, tokenId: string | number) {
  return `${SEPOLIA_BASE}/nft/${address}/${tokenId}`;
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
      className={`text-teal-800 hover:text-teal-950 hover:underline text-xs font-mono dark:text-holo-mint dark:hover:text-white ${className}`}
      title={hash}
    >
      {label === "View on SepoliaScan" ? short : label}
    </a>
  );
}

export function AddressLink({
  address,
  label,
  className = "",
}: {
  address?: string | null;
  label?: string;
  className?: string;
}) {
  if (!address) return null;
  const short = label ?? `${address.slice(0, 6)}…${address.slice(-4)}`;
  return (
    <a
      href={addressExplorerUrl(address)}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-teal-800 hover:text-teal-950 hover:underline font-mono text-xs dark:text-holo-mint dark:hover:text-white ${className}`}
      title={address}
    >
      {short}
    </a>
  );
}

export function ContractLink({
  address,
  name,
  className = "",
}: {
  address: string;
  name?: string;
  className?: string;
}) {
  return (
    <AddressLink
      address={address}
      label={name ?? `${address.slice(0, 8)}…${address.slice(-4)}`}
      className={className}
    />
  );
}
