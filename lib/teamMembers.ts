export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  roleSummary: string;
  photo: string;
  gradient: string;
  nationality: string;
  lives: string;
  bio: string[];
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    slug: "bao-nguyen",
    name: "Bao Nguyen",
    role: "CEO",
    roleSummary: "Project vision and executive leadership",
    photo: "/team/bao-nguyen.png",
    gradient: "from-holo-mint/40 via-teal-500/20 to-holo-lavender/30",
    nationality: "Vietnam",
    lives: "Ho Chi Minh City",
    bio: [
      "Bao Nguyen sets TranspaChain's strategic direction: a charity Web3 platform where every donation is held in transparent milestone escrow on Ethereum Sepolia until verified organizations deliver proof and donors approve release.",
      "He aligns the executive team on verified org onboarding, DonationVault escrow policy, and GovernanceDAO participation so donors can trace funds, inspect IPFS evidence, and claim refunds when campaigns fail.",
      "Bao's mandate is practical accountability — making quadratic donor voting, Impact NFT recognition tiers, and on-chain audit trails credible enough for real-world philanthropy, not just a demo narrative.",
    ],
  },
  {
    slug: "cuong-nguyen",
    name: "Cuong Nguyen",
    role: "CTO",
    roleSummary: "Blockchain technology and smart contract architecture",
    photo: "/team/cuong-nguyen.png",
    gradient: "from-teal-400/30 via-cyan-500/20 to-holo-mint/25",
    nationality: "Vietnam",
    lives: "Ho Chi Minh City",
    bio: [
      "Cuong Nguyen architects TranspaChain's on-chain core: DonationVault escrow for ETH and USDC, GovernanceDAO proposals with quadratic vote weighting, and Impact NFT tiers that upgrade as donors contribute further to a campaign.",
      "He owns Sepolia deployment, contract upgrade paths, and the event pipeline that connects milestone submissions, admin evidence review, and timelocked fund release after donor quorum is met.",
      "Cuong treats security and transparency as one requirement — escrow stays locked until proof is verified, suspicious proposals can be closed, and every state transition is observable on-chain and through the platform indexer.",
    ],
  },
  {
    slug: "huy-luu",
    name: "Huy Luu",
    role: "COO",
    roleSummary: "Operations management and delivery timelines",
    photo: "/team/huy-luu.png",
    gradient: "from-holo-lavender/30 via-purple-500/15 to-holo-pink/25",
    nationality: "Vietnam",
    lives: "Ho Chi Minh City",
    bio: [
      "Huy Luu runs day-to-day operations across the full campaign lifecycle — verified organization onboarding, milestone evidence uploads, admin review queues, and donor voting windows on GovernanceDAO proposals.",
      "He keeps delivery aligned with on-chain rules: extension caps, 24-hour governance timelocks before release, and clear refund paths when campaigns are cancelled or fail to meet milestones.",
      "Huy coordinates engineering, admin, and org partners so donors always know where funds sit — locked in DonationVault until evidence on IPFS passes review and the community reaches quorum.",
    ],
  },
  {
    slug: "tran-linh",
    name: "Tran Linh",
    role: "CFO",
    roleSummary: "Financial management and tokenomics",
    photo: "/team/tran-linh.png",
    gradient: "from-amber-400/25 via-holo-pink/20 to-holo-lavender/30",
    nationality: "Vietnam",
    lives: "Ho Chi Minh City",
    bio: [
      "Tran Linh oversees financial modeling for dual-token donations held in smart-contract escrow until governance-approved release. She ensures dashboard totals, vault balances, and donor-facing fund status reflect verifiable Sepolia state.",
      "Her work connects tokenomics to giving mechanics — ETH and USDC flow into DonationVault, releases require verified milestones plus weighted donor votes, and failed campaigns preserve refund eligibility.",
      "Tran bridges treasury discipline with Web3 transparency, aligning Impact NFT tier thresholds with contribution levels and communicating how quadratic voting weight affects escrow outcomes.",
    ],
  },
  {
    slug: "mai-phuong-nguyen",
    name: "Mai Phuong Nguyen",
    role: "CMO",
    roleSummary: "Marketing and community engagement",
    photo: "/team/mai-phuong-nguyen.png",
    gradient: "from-holo-pink/30 via-rose-400/15 to-holo-mint/25",
    nationality: "Vietnam",
    lives: "Ho Chi Minh City",
    bio: [
      "Mai Phuong Nguyen leads marketing and community growth for TranspaChain's transparent giving story — translating DonationVault escrow, milestone proof, and GovernanceDAO participation into language donors and partner orgs can trust.",
      "She builds educational content around IPFS evidence review, quadratic vote weight, retro Impact NFT upgrades, and refund eligibility so contributors understand why funds stay locked until milestones are verified.",
      "Mai Phuong cultivates partnerships with verified organizations and treats every on-chain release as a public trust signal — proof that charity can be accountable by design on Ethereum Sepolia.",
    ],
  },
  {
    slug: "nguyen-huong",
    name: "Nguyen Huong",
    role: "CPO",
    roleSummary: "Product development and donor experience",
    photo: "/team/nguyen-huong.png",
    gradient: "from-cyan-400/25 via-holo-mint/30 to-teal-500/20",
    nationality: "Vietnam",
    lives: "Ho Chi Minh City",
    bio: [
      "Nguyen Huong owns product strategy and the end-to-end donor experience — campaign discovery, wallet connection, donations in ETH or USDC, evidence inspection, governance voting, and Impact NFT collection.",
      "She designs flows where complex escrow logic reads clearly: donors see vault status, milestone progress, admin-reviewed proof, and the steps required before GovernanceDAO release executes.",
      "Nguyen Huong balances visual polish with functional clarity so Sepolia users can participate in releases, understand √donation vote weight, and trace refunds on failed campaigns without needing a smart-contract background.",
    ],
  },
  {
    slug: "quynh-huong-pham",
    name: "Quynh Huong Pham",
    role: "CSO",
    roleSummary: "Security assurance and platform safety",
    photo: "/team/quynh-huong-pham.png",
    gradient: "from-emerald-400/25 via-holo-mint/20 to-cyan-500/25",
    nationality: "Vietnam",
    lives: "Ho Chi Minh City",
    bio: [
      "Quynh Huong Pham safeguards TranspaChain's security posture — DonationVault custody integrity, ORG_ROLE verification, admin evidence review standards, and anti-abuse controls across contracts and supporting infrastructure.",
      "She defines requirements for authentic milestone proof, emergency proposal shutdown via closeProposal, and hardened indexing pipelines so suspicious governance activity is detected before funds move.",
      "Quynh Huong partners with engineering to ensure escrow stays locked until proof and donor quorum are satisfied — modeling how charitable Web3 platforms should protect contributors by default on Sepolia.",
    ],
  },
  {
    slug: "anh-quan-le",
    name: "Anh Quan Le",
    role: "CLO",
    roleSummary: "Legal affairs and regulatory compliance",
    photo: "/team/anh-quan-le.png",
    gradient: "from-indigo-400/25 via-holo-lavender/25 to-holo-silver/20",
    nationality: "Vietnam",
    lives: "Ho Chi Minh City",
    bio: [
      "Anh Quan Le handles legal and compliance frameworks for verified organization campaigns and donor governance on TranspaChain — advising how milestone evidence, DonationVault escrow, and refund paths meet transparency obligations.",
      "He guides ORG_ROLE granting policy, admin review standards, and clear communication that Sepolia operations are a testnet demonstration, not financial or legal advice for production deployment.",
      "Anh Quan ensures extension limits, automatic refund eligibility, and governance timelocks align with donor protection principles — keeping TranspaChain's Web3 charity model grounded in accountable, lawful execution.",
    ],
  },
];

export function getTeamMember(slug: string): TeamMember | undefined {
  return TEAM_MEMBERS.find((member) => member.slug === slug);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
