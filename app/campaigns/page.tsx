import { CampaignList } from "@/components/CampaignList";
import { PageShell } from "@/components/PageShell";
import Link from "next/link";

export default function CampaignsPage() {
  return (
    <PageShell
      eyebrow="Browse"
      title="Campaigns"
      description="Transparent giving on Ethereum — every donation escrowed on-chain until donors approve milestone releases."
      maxWidth="7xl"
      actions={
        <Link
          href="/campaigns/create"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-holo-gradient px-5 py-2.5 text-sm font-medium text-ink-950 transition-opacity hover:opacity-90 sm:self-auto"
        >
          Create Campaign
        </Link>
      }
    >
      <CampaignList />
    </PageShell>
  );
}
