"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect }    = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-mono text-gray-600">
        {address.slice(0, 6)}…{address.slice(-4)}
      </span>
      <button
        onClick={() => disconnect()}
        className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
      >
        Disconnect
      </button>
    </div>
  );

  return (
    <button
      onClick={() => connect({ connector: metaMask() })}
      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
    >
      Connect MetaMask
    </button>
  );
}
