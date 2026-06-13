import { CampaignList } from "@/components/CampaignList";
import { AnimatedGradientBackground } from "@/components/ui/AnimatedGradientBackground";
import Link from "next/link";

export default function CampaignsPage() {
  return (
    <AnimatedGradientBackground variant="dark" className="min-h-screen">
      <main className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Browse Campaigns
            </h1>
            <p className="max-w-2xl text-white/70">
              Transparent giving on Ethereum — every donation escrowed on-chain until donors approve milestone releases.
            </p>
          </div>
          <Link
            href="/campaigns/create"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 sm:self-auto"
          >
            Create Campaign
          </Link>
        </div>
        <CampaignList />
      </main>
    </AnimatedGradientBackground>
  );
}
