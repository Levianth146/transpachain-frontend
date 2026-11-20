import { createConfig, fallback, http } from "wagmi";
import { injected, metaMask } from "wagmi/connectors";
import { ACTIVE_CHAIN, NETWORK } from "./chain";

/** NEXT_PUBLIC_* must be set at `next build` time; runtime env in Docker is too late for client bundles. */
export const wagmiConfig = createConfig({
  chains: [ACTIVE_CHAIN],
  // injected() + EIP-6963 discovery also picks up Core wallet (Avalanche) and other browser wallets.
  connectors: [metaMask(), injected()],
  transports: {
    [ACTIVE_CHAIN.id]: fallback(NETWORK.rpcUrls.map((url) => http(url))),
  },
});
