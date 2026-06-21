"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { useMounted } from "@/hooks/useMounted";
import { Wallet } from "lucide-react";

interface ConnectWalletProps {
  variant?: "default" | "hero";
}

export function ConnectWallet({ variant = "default" }: ConnectWalletProps) {
  const mounted = useMounted();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const connectClass =
    variant === "hero"
      ? "btn-wallet"
      : "rounded-full border border-brand-purple/30 bg-brand-purple/10 px-4 py-2 text-sm font-semibold text-brand-purple-light transition-all hover:border-brand-purple/50 hover:bg-brand-purple/15";

  const disconnectClass =
    variant === "hero"
      ? "rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
      : "rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white";

  if (!mounted) {
    return (
      <button className={`${connectClass} opacity-0`}>
        Connect Wallet
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden font-mono text-xs text-white/50 sm:inline">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
        <button onClick={() => disconnect()} className={disconnectClass}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: metaMask() })}
      className={connectClass}
    >
      {variant === "hero" && <Wallet size={16} />}
      Connect Wallet
    </button>
  );
}
