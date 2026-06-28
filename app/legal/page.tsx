import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ADDRESSES } from "@/lib/contracts";
import { USDC_ADDRESS } from "@/lib/erc20";

export const metadata = {
  title: "Legal & Disclaimer — TranspaChain",
};

const SEPOLIA_ETHERSCAN = "https://sepolia.etherscan.io";

const CONTRACTS = [
  { name: "CharityCore", address: ADDRESSES.charityCore, role: "Campaign registry, org verification, and lifecycle management" },
  { name: "DonationVault", address: ADDRESSES.donationVault, role: "ETH/USDC escrow, milestone proofs, and donor refunds" },
  { name: "GovernanceDAO", address: ADDRESSES.governanceDAO, role: "Quadratic voting, quorum checks, and timelocked fund releases" },
  { name: "ImpactNFT", address: ADDRESSES.impactNFT, role: "Tiered donor badges (Bronze, Silver, Gold) minted on donation" },
] as const;

function EtherscanLink({ address, label }: { address: string; label?: string }) {
  return (
    <a
      href={`${SEPOLIA_ETHERSCAN}/address/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-sm text-teal-700 transition-colors hover:text-teal-900 dark:text-holo-mint dark:hover:text-white"
    >
      {label ?? address}
    </a>
  );
}

export default function LegalPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Legal & Disclaimer"
      description="Important information about using transpachain.site on Ethereum Sepolia testnet."
      maxWidth="3xl"
    >
      <GlassPanel holoBorder className="space-y-6 bg-white p-8 text-slate-700 dark:bg-slate-900/95 dark:text-slate-300">
        <p>
          TranspaChain is a <strong className="text-slate-900 dark:text-white">demonstration project on Ethereum Sepolia testnet</strong>.
          It is not a registered charity, money transmitter, or investment platform.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Testnet only</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Do not send mainnet ETH or real assets expecting utility or returns.</li>
            <li>Sepolia tokens have no monetary value.</li>
            <li>All campaigns, donations, governance votes, and Impact NFTs operate on Sepolia for demonstration purposes.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Platform mechanics</h2>
          <p>
            TranspaChain escrowes donations in ETH or USDC via the DonationVault contract. Organizations submit
            milestone evidence to IPFS; an admin reviews submissions before proposals become visible to donors.
            Fund releases require quadratic-weighted donor votes (√donation weight), a 51% quorum, and a 24-hour
            timelock. Failed or cancelled campaigns enable on-chain refund claims. Donors receive Impact NFT tiers
            (Bronze, Silver, or Gold) as transferable testnet badges.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Not financial advice</h2>
          <p>
            Nothing on this site constitutes financial, legal, or tax advice. Donations are
            experimental smart-contract interactions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Impact NFTs</h2>
          <p>
            Impact NFTs are transferable ERC-721 badges on Sepolia testnet. They are souvenirs of
            participation, not securities or guarantees of future value. Tier assignment (Bronze, Silver, Gold)
            reflects donation thresholds per campaign and may be upgraded on further contributions. Any secondary
            market activity is outside TranspaChain&apos;s control.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Smart contracts</h2>
          <p>
            Contracts are provided as-is without warranty. A self-assessment (Slither) is
            documented in the project repository; no paid third-party audit is claimed for testnet
            deployments.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Transparency &amp; contract addresses</h2>
          <p>
            Verify all transactions on{" "}
            <a
              href={SEPOLIA_ETHERSCAN}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 transition-colors hover:text-teal-900 dark:text-holo-mint dark:hover:text-white"
            >
              Sepolia Etherscan
            </a>
            . Deployed contract addresses (from environment configuration):
          </p>
          <ul className="space-y-3">
            {CONTRACTS.map((c) => (
              <li key={c.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="font-semibold text-slate-900 dark:text-white">{c.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-white/60">{c.role}</p>
                <p className="mt-2">
                  <EtherscanLink address={c.address} />
                </p>
              </li>
            ))}
          </ul>
          <p className="text-sm">
            USDC (Sepolia test token) used for USDC-denominated campaigns:{" "}
            <EtherscanLink address={USDC_ADDRESS} label={`${USDC_ADDRESS.slice(0, 10)}…${USDC_ADDRESS.slice(-8)}`} />
          </p>
        </section>

        <p>
          <Link href="/" className="text-teal-700 transition-colors hover:text-teal-900 dark:text-holo-mint dark:hover:text-white">
            Back to home
          </Link>
        </p>
      </GlassPanel>
    </PageShell>
  );
}
