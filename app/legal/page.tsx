import Link from "next/link";
import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";
import { GlassPanel } from "@/components/ui/GlassPanel";

export const metadata = {
  title: "Legal & Disclaimer — OpenHeart",
};

export default function LegalPage() {
  return (
    <AnimatedGradientBackground variant="dark" className="min-h-screen">
      <main className="mx-auto max-w-3xl px-4 py-12">
        <GlassPanel className="p-8 space-y-6 text-white/80">
          <h1 className="text-3xl font-bold text-white">Legal & Disclaimer</h1>
          <p>
            OpenHeart is a <strong className="text-white">demonstration project on Ethereum Sepolia testnet</strong>.
            It is not a registered charity, money transmitter, or investment platform.
          </p>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Testnet only</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Do not send mainnet ETH or real assets expecting utility or returns.</li>
              <li>Sepolia tokens have no monetary value.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Not financial advice</h2>
            <p>
              Nothing on this site constitutes financial, legal, or tax advice. Donations are
              experimental smart-contract interactions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Impact NFTs</h2>
            <p>
              Impact NFTs are transferable ERC-721 badges on testnet. They are souvenirs of
              participation, not securities or guarantees of future value. Any secondary market
              activity is outside OpenHeart&apos;s control.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Smart contracts</h2>
            <p>
              Contracts are provided as-is without warranty. A self-assessment (Slither) is
              documented in the project repository; no paid third-party audit is claimed for testnet
              deployments.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Transparency</h2>
            <p>
              Verify transactions on{" "}
              <a
                href="https://sepolia.etherscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-shine hover:text-white transition-colors"
              >
                Sepolia Etherscan
              </a>
              . CharityCore:{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-white/90">
                0x6fEEF9276B2215F0d41a0c7515Ea6718099552d4
              </code>
            </p>
          </section>

          <p>
            <Link href="/" className="text-accent-shine transition-colors hover:text-white">
              Back to home
            </Link>
          </p>
        </GlassPanel>
      </main>
    </AnimatedGradientBackground>
  );
}
