"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { useMounted } from "@/hooks/useMounted";
import { Wallet } from "lucide-react";

export function ConnectWallet() {
  const mounted = useMounted();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (!mounted) {
    return (
      <button className="btn-wallet opacity-0">
        Connect Wallet
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden font-mono text-xs text-text-primary/40 sm:inline">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
        <button onClick={() => disconnect()} className="btn-disconnect">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: metaMask() })}
      className="btn-wallet"
    >
      <Wallet size={16} />
      Connect Wallet
    </button>
  );
}
