import { CampaignList } from "@/components/CampaignList";
import { Web3HeroAnimated } from "@/components/Web3HeroAnimated";
import { HeroSection } from "@/components/HeroSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <Web3HeroAnimated />
      <section id="campaigns" className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-2">Active Campaigns</h2>
        <p className="text-gray-500 mb-8">Transparent charity powered by Ethereum</p>
        <CampaignList />
      </section>
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <HeroSection />
      </section>
    </main>
  );
}
