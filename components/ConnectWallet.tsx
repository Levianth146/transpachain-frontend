"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { useMounted } from "@/hooks/useMounted";

export function ConnectWallet() {
  const mounted = useMounted();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (!mounted) {
    return (
      <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white opacity-0">
        Connect Wallet
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden font-mono text-xs text-white/60 sm:inline">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="rounded-full border border-gray-700 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-gray-600 hover:text-white"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: metaMask() })}
      className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
    >
      Connect Wallet
    </button>
  );
}
