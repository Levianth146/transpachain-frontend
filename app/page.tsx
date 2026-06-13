import { CampaignList } from "@/components/CampaignList";
import { Web3HeroAnimated } from "@/components/Web3HeroAnimated";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <Web3HeroAnimated />
      <section
        id="campaigns"
        className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mb-8 border-t border-gray-800 pt-12">
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">
            Active Campaigns
          </h2>
          <p className="text-white/60">
            Transparent charity powered by Ethereum — donate in ETH or USDC
          </p>
        </div>
        <CampaignList />
      </section>
    </main>
  );
}
