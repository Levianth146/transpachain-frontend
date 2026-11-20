import { avalancheFuji, sepolia } from "wagmi/chains";
import type { Chain } from "viem";

/**
 * Single source of truth for the target network.
 * Default: Avalanche Fuji C-Chain (43113). Set NEXT_PUBLIC_CHAIN_ID=11155111 to run the legacy Sepolia deployment.
 */
type NetworkConfig = {
  chain: Chain;
  name: string;
  nativeSymbol: string;
  explorerUrl: string;
  explorerName: string;
  rpcUrls: string[];
  faucetUrl: string;
  defaultUsdc: `0x${string}`;
};

const NETWORKS: Record<number, NetworkConfig> = {
  [avalancheFuji.id]: {
    chain: avalancheFuji,
    name: "Avalanche Fuji",
    nativeSymbol: "AVAX",
    explorerUrl: "https://testnet.snowtrace.io",
    explorerName: "Snowtrace",
    rpcUrls: [
      process.env.NEXT_PUBLIC_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc",
      "https://avalanche-fuji-c-chain-rpc.publicnode.com",
    ],
    faucetUrl: "https://team1vn.xyz/faucet.html",
    defaultUsdc: "0x5425890298aed601595a70AB815c96711a31Bc65", // Circle USDC (Fuji)
  },
  [sepolia.id]: {
    chain: sepolia,
    name: "Ethereum Sepolia",
    nativeSymbol: "ETH",
    explorerUrl: "https://sepolia.etherscan.io",
    explorerName: "Etherscan",
    rpcUrls: [
      process.env.NEXT_PUBLIC_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
    ],
    faucetUrl: "https://cloud.google.com/application/web3/faucet/ethereum/sepolia",
    defaultUsdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Circle USDC (Sepolia)
  },
};

const requested = Number(process.env.NEXT_PUBLIC_CHAIN_ID || avalancheFuji.id);
export const NETWORK: NetworkConfig = NETWORKS[requested] ?? NETWORKS[avalancheFuji.id];

export const ACTIVE_CHAIN = NETWORK.chain;
export const NETWORK_NAME = NETWORK.name;
export const NATIVE_SYMBOL = NETWORK.nativeSymbol;
export const EXPLORER_URL = NETWORK.explorerUrl;
export const EXPLORER_NAME = NETWORK.explorerName;
