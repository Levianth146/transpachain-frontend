import { CampaignList } from "@/components/CampaignList";
import { ClientNav } from "@/components/ClientNav";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-emerald-700">🌿 TranspaChain</h1>
        <ClientNav />
      </nav>
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-2">Active Campaigns</h2>
        <p className="text-gray-500 mb-8">Transparent charity powered by Ethereum</p>
        <CampaignList />
      </section>
    </main>
  );
}
