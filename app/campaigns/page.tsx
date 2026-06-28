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
      backgroundImage="/backgrounds/panels.png"
      actions={
        <Link
          href="/campaigns/create"
          className="btn-primary shrink-0 self-start sm:self-auto"
        >
          Create Campaign
        </Link>
      }
    >
      <CampaignList />
    </PageShell>
  );
}
