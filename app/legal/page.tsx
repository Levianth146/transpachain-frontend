import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ADDRESSES } from "@/lib/contracts";
import { USDC_ADDRESS } from "@/lib/erc20";

export const metadata = {
  title: "Legal & Disclaimer — TranspaChain",
};

import { EXPLORER_NAME, EXPLORER_URL, NETWORK_NAME } from "@/lib/chain";

const EXPLORER = EXPLORER_URL;

const CONTRACTS = [
  { name: "CharityCore", address: ADDRESSES.charityCore, role: "Campaign registry, org verification, and lifecycle management" },
  { name: "DonationVault", address: ADDRESSES.donationVault, role: "AVAX/USDC escrow, milestone proofs, and donor refunds" },
  { name: "GovernanceDAO", address: ADDRESSES.governanceDAO, role: "Quadratic voting, quorum checks, and timelocked fund releases" },
  { name: "ImpactNFT", address: ADDRESSES.impactNFT, role: "Tiered donor badges (Bronze, Silver, Gold) minted on donation" },
] as const;

function ExplorerLink({ address, label }: { address: string; label?: string }) {
  return (
    <a
      href={`${EXPLORER}/address/${address}`}
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
      description="Important information about using transpachain.site on Avalanche Fuji testnet."
      maxWidth="3xl"
      tone="dark"
    >
      <GlassPanel holoBorder className="space-y-6 bg-slate-900/95 p-8 text-slate-300">
        <p>
          TranspaChain is a <strong className="text-white">demonstration project on Avalanche Fuji testnet</strong>.
          It is not a registered charity, money transmitter, or investment platform.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Testnet only</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Do not send mainnet AVAX or real assets expecting utility or returns.</li>
            <li>Fuji testnet tokens have no monetary value.</li>
            <li>All campaigns, donations, governance votes, and Impact NFTs operate on Avalanche Fuji for demonstration purposes.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Platform mechanics</h2>
          <p>
            TranspaChain escrowes donations in AVAX or USDC via the DonationVault contract. Organizations submit
            milestone evidence to IPFS; an admin reviews submissions before proposals become visible to donors.
            Fund releases require quadratic-weighted donor votes (√donation weight), a 51% quorum, and a 24-hour
            timelock. Failed or cancelled campaigns enable on-chain refund claims. Donors receive Impact NFT tiers
            (Bronze, Silver, or Gold) as transferable testnet badges.
          </p>
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
            Impact NFTs are transferable ERC-721 badges on Avalanche Fuji testnet. They are souvenirs of
            participation, not securities or guarantees of future value. Tier assignment (Bronze, Silver, Gold)
            reflects donation thresholds per campaign and may be upgraded on further contributions. Any secondary
            market activity is outside TranspaChain&apos;s control.
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

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Transparency &amp; contract addresses</h2>
          <p>
            Verify all transactions on{" "}
            <a
              href={EXPLORER}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 transition-colors hover:text-teal-900 dark:text-holo-mint dark:hover:text-white"
            >
              {EXPLORER_NAME} ({NETWORK_NAME})
            </a>
            . Deployed contract addresses (from environment configuration):
          </p>
          <ul className="space-y-3">
            {CONTRACTS.map((c) => (
              <li key={c.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="font-semibold text-white">{c.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-white/60">{c.role}</p>
                <p className="mt-2">
                  <ExplorerLink address={c.address} />
                </p>
              </li>
            ))}
          </ul>
          <p className="text-sm">
            USDC (Fuji test token) used for USDC-denominated campaigns:{" "}
            <ExplorerLink address={USDC_ADDRESS} label={`${USDC_ADDRESS.slice(0, 10)}…${USDC_ADDRESS.slice(-8)}`} />
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
