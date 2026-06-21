export type TeamStat = {
  value: string;
  label: string;
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  roleSummary: string;
  gradient: string;
  stats: TeamStat[];
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
    gradient: "from-holo-mint/40 via-teal-500/20 to-holo-lavender/30",
    stats: [
      { value: "100%", label: "Transparency mandate across every campaign" },
      { value: "8", label: "Executive pillars aligned on trust-first giving" },
      { value: "1", label: "Mission: accountable charity on Ethereum" },
    ],
    nationality: "Việt Nam",
    lives: "Thành phố Hồ Chí Minh",
    bio: [
      "Bao Nguyen leads TranspaChain's mission to restore confidence in charitable giving through transparent, milestone-based escrow on Ethereum Sepolia. He sets the strategic direction for donor governance, verified organization onboarding, and the platform's commitment to on-chain accountability.",
      "Under his leadership, TranspaChain combines DonationVault escrow, quadratic donor voting, and retro Impact NFT tiers into a single transparent giving stack. Every release requires proof, admin review, and majority donor participation — accountability is built into the protocol, not bolted on afterward.",
      "Bao champions a culture where donors can trace every contribution, organizations earn trust through verifiable milestones, and failed campaigns trigger automatic refund eligibility. His focus is making Web3 philanthropy practical, auditable, and worthy of public confidence.",
    ],
  },
  {
    slug: "cuong-nguyen",
    name: "Cuong Nguyen",
    role: "CTO",
    roleSummary: "Blockchain technology and smart contract architecture",
    gradient: "from-teal-400/30 via-cyan-500/20 to-holo-mint/25",
    stats: [
      { value: "4", label: "Core smart contracts powering the platform" },
      { value: "100%", label: "Donations held in on-chain escrow vaults" },
      { value: "√", label: "Quadratic vote weighting at the DAO layer" },
    ],
    nationality: "Việt Nam",
    lives: "Thành phố Hồ Chí Minh",
    bio: [
      "Cuong Nguyen architects TranspaChain's smart contract stack — DonationVault escrow in ETH and USDC, DAO governance with quadratic weighting, and tiered Impact NFTs for donor recognition. He owns protocol design from milestone submission through timelocked fund release.",
      "He leads Sepolia deployment, contract upgrade patterns, and the integration between on-chain events and the platform indexer. Milestone proofs pass through admin approval before donors inspect evidence and cast weighted votes.",
      "Cuong ensures governance proposals require off-chain admin gating, 51% donor quorum, and a mandatory 24-hour timelock before execution. His engineering philosophy treats transparency and safety as inseparable requirements for charitable Web3 infrastructure.",
    ],
  },
  {
    slug: "huy-luu",
    name: "Huy Luu",
    role: "COO",
    roleSummary: "Operations management and delivery timelines",
    gradient: "from-holo-lavender/30 via-purple-500/15 to-holo-pink/25",
    stats: [
      { value: "6", label: "Milestone lifecycle stages tracked end-to-end" },
      { value: "24h", label: "Governance timelock before fund release" },
      { value: "30d", label: "Maximum per-extension deadline cap on-chain" },
    ],
    nationality: "Việt Nam",
    lives: "Thành phố Hồ Chí Minh",
    bio: [
      "Huy Luu manages day-to-day operations across the full campaign lifecycle — from verified organization onboarding to milestone evidence submission and donor voting windows. He keeps delivery timelines aligned with platform policy and donor expectations.",
      "He coordinates admin evidence review workflows, ensuring organizations upload authentic proof before governance proposals go live. Operational rigor means donors always know where funds sit: locked in escrow until milestones are verified and approved.",
      "Huy drives cross-functional execution so campaign extensions respect on-chain limits, suspicious proposals can be closed, and refund paths remain clear when campaigns fail or are cancelled. His focus is reliable delivery at the speed trust demands.",
    ],
  },
  {
    slug: "tran-linh",
    name: "Tran Linh",
    role: "CFO",
    roleSummary: "Financial management and tokenomics",
    gradient: "from-amber-400/25 via-holo-pink/20 to-holo-lavender/30",
    stats: [
      { value: "2", label: "Accepted donation tokens — ETH and USDC" },
      { value: "51%", label: "Donor quorum required for escrow release" },
      { value: "3", label: "Impact NFT tiers — Bronze, Silver, Gold" },
    ],
    nationality: "Việt Nam",
    lives: "Thành phố Hồ Chí Minh",
    bio: [
      "Tran Linh oversees financial modeling for dual-token donations held in smart-contract escrow until governance-approved release. She shapes how TranspaChain communicates treasury transparency and donor-facing fund status on Sepolia.",
      "Her work aligns tokenomics awareness with practical giving mechanics — donors choose ETH or USDC, funds remain locked in DonationVault, and releases require verified milestones plus weighted community votes.",
      "Tran ensures refund eligibility for failed or cancelled campaigns is understood by both organizations and donors. She bridges financial discipline with Web3 transparency so every number on the dashboard reflects verifiable on-chain state.",
    ],
  },
  {
    slug: "mai-phuong-nguyen",
    name: "Mai Phuong Nguyen",
    role: "CMO",
    roleSummary: "Marketing and community engagement",
    gradient: "from-holo-pink/30 via-rose-400/15 to-holo-mint/25",
    stats: [
      { value: "100%", label: "Donor-visible campaign and release trails" },
      { value: "3", label: "Impact NFT badge tiers for donor recognition" },
      { value: "∞", label: "Community loops tying proof to public trust" },
    ],
    nationality: "Việt Nam",
    lives: "Thành phố Hồ Chí Minh",
    bio: [
      "Mai Phuong Nguyen leads marketing and community growth for TranspaChain's transparent giving narrative across Web3 and traditional philanthropy audiences. She translates escrow mechanics and governance participation into stories donors can trust and share.",
      "She builds educational content around milestone proof, quadratic voting weight, and retro Impact NFT upgrades — helping contributors understand why funds stay locked until organizations deliver verifiable results.",
      "Mai Phuong cultivates partnerships with verified organizations and amplifies on-chain evidence as a public trust signal. Her community strategy treats every campaign milestone as a chance to prove that charity can be transparent by design.",
    ],
  },
  {
    slug: "nguyen-huong",
    name: "Nguyen Huong",
    role: "CPO",
    roleSummary: "Product development and donor experience",
    gradient: "from-cyan-400/25 via-holo-mint/30 to-teal-500/20",
    stats: [
      { value: "6", label: "Core donor journey steps mapped and shipped" },
      { value: "100%", label: "Evidence review surfaced before voting" },
      { value: "1", label: "Unified dashboard for campaigns and governance" },
    ],
    nationality: "Việt Nam",
    lives: "Thành phố Hồ Chí Minh",
    bio: [
      "Nguyen Huong owns product strategy and the end-to-end donor experience — from campaign discovery and wallet connection to governance participation and Impact NFT collection. She ensures complex escrow logic reads clearly in the holo dark-theme interface.",
      "She designs intuitive flows for donations in ETH or USDC, milestone evidence inspection, and tier upgrades when donors contribute further to the same campaign. Every screen is built to answer one question: where are my funds, and what happens next?",
      "Nguyen Huong balances visual polish with functional clarity so Sepolia demo users can verify escrow status, understand √donation vote weight, and participate in releases without needing a smart-contract background.",
    ],
  },
  {
    slug: "quynh-huong-pham",
    name: "Quynh Huong Pham",
    role: "CSO",
    roleSummary: "Security assurance and platform safety",
    gradient: "from-emerald-400/25 via-holo-mint/20 to-cyan-500/25",
    stats: [
      { value: "9", label: "Anti-abuse safeguards across the platform" },
      { value: "100%", label: "Escrow held until proof and donor vote" },
      { value: "2", label: "Verification gates — admin review and ORG_ROLE" },
    ],
    nationality: "Việt Nam",
    lives: "Thành phố Hồ Chí Minh",
    bio: [
      "Quynh Huong Pham safeguards TranspaChain's security posture — escrow integrity, admin verification workflows, and anti-abuse controls both on-chain and in supporting infrastructure. She treats donor funds as a custody problem, not a marketing promise.",
      "She defines standards for organization wallet verification, evidence authenticity review, and emergency proposal shutdown via closeProposal when governance surfaces suspicious activity.",
      "Quynh Huong partners with engineering to harden DonationVault, DAO voting, and event indexing pipelines against misuse. Her goal is a Sepolia demo that models how charitable Web3 platforms should protect contributors by default.",
    ],
  },
  {
    slug: "anh-quan-le",
    name: "Anh Quan Le",
    role: "CLO",
    roleSummary: "Legal affairs and regulatory compliance",
    gradient: "from-indigo-400/25 via-holo-lavender/25 to-holo-silver/20",
    stats: [
      { value: "100%", label: "ORG_ROLE required before campaign creation" },
      { value: "51%", label: "Quorum aligned with governance compliance" },
      { value: "24h", label: "Mandatory timelock on approved releases" },
    ],
    nationality: "Việt Nam",
    lives: "Thành phố Hồ Chí Minh",
    bio: [
      "Anh Quan Le handles legal and compliance frameworks for verified organization campaigns and donor governance participation on TranspaChain. He advises on how milestone evidence, escrow mechanics, and refund paths align with transparency obligations.",
      "He guides ORG_ROLE granting policy, admin review standards, and the regulatory considerations surrounding Sepolia demo operations — ensuring the platform communicates clearly that it is a testnet demonstration, not financial advice.",
      "Anh Quan ensures extension limits, automatic refund eligibility, and admin oversight meet both compliance goals and donor protection principles. His work keeps TranspaChain's ambitious Web3 model grounded in accountable, lawful execution.",
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
