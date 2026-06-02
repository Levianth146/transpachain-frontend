import Link from "next/link";

export const metadata = {
  title: "Legal & Disclaimer — TranspaChain",
};

export default function LegalPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 prose prose-slate dark:prose-invert">
      <h1>Legal & Disclaimer</h1>
      <p>
        TranspaChain is a <strong>demonstration project on Ethereum Sepolia testnet</strong>.
        It is not a registered charity, money transmitter, or investment platform.
      </p>

      <h2>Testnet only</h2>
      <ul>
        <li>Do not send mainnet ETH or real assets expecting utility or returns.</li>
        <li>Sepolia tokens have no monetary value.</li>
      </ul>

      <h2>Not financial advice</h2>
      <p>
        Nothing on this site constitutes financial, legal, or tax advice. Donations are
        experimental smart-contract interactions.
      </p>

      <h2>Impact NFTs</h2>
      <p>
        Impact NFTs are transferable ERC-721 badges on testnet. They are souvenirs of
        participation, not securities or guarantees of future value. Any secondary market
        activity is outside TranspaChain&apos;s control.
      </p>

      <h2>Smart contracts</h2>
      <p>
        Contracts are provided as-is without warranty. A self-assessment (Slither) is
        documented in the project repository; no paid third-party audit is claimed for testnet
        deployments.
      </p>

      <h2>Transparency</h2>
      <p>
        Verify transactions on{" "}
        <a href="https://sepolia.etherscan.io" target="_blank" rel="noopener noreferrer">
          Sepolia Etherscan
        </a>
        . CharityCore:{" "}
        <code>0x6fEEF9276B2215F0d41a0c7515Ea6718099552d4</code>
      </p>

      <p>
        <Link href="/" className="text-emerald-600 hover:underline">
          Back to home
        </Link>
      </p>
    </main>
  );
}
