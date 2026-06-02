import { createConfig, fallback, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

/** NEXT_PUBLIC_* must be set at `next build` time; runtime env in Docker is too late for client bundles. */
function sepoliaTransport() {
  const key = process.env.NEXT_PUBLIC_ALCHEMY_KEY?.trim();
  const hasAlchemy =
    !!key && key !== "YOUR_ALCHEMY_KEY" && key !== "undefined";

  if (hasAlchemy) {
    return fallback([
      http(`https://eth-sepolia.g.alchemy.com/v2/${key}`),
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ]);
  }

  return fallback([
    http("https://ethereum-sepolia-rpc.publicnode.com"),
    http("https://rpc.sepolia.org"),
  ]);
}

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [metaMask(), injected()],
  transports: {
    [sepolia.id]: sepoliaTransport(),
  },
});
