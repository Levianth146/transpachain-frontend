import { CampaignList } from "@/components/CampaignList";
import { Web3HeroAnimated } from "@/components/Web3HeroAnimated";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <Web3HeroAnimated />
      <section
        id="campaigns"
        className="relative bg-gradient-to-b from-black via-ink-950 to-ink-950 max-w-6xl mx-auto px-4 py-16"
      >
        <h2 className="text-3xl font-display font-bold mb-2 text-cream-100">Active Campaigns</h2>
        <p className="text-gray-400 mb-8">Transparent charity powered by Ethereum — donate in ETH or USDC</p>
        <CampaignList />
      </section>
    </main>
  );
}
