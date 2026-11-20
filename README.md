# TranspaChain — Frontend

Next.js app for transparent charity on **Avalanche Fuji**: campaigns, donations, governance, Safe disbursement UX, public transparency, and mock yield.

**Product docs (start here):** [../README.md](../README.md)

| | |
|---|---|
| **Live** | [https://www.transpachain.site](https://www.transpachain.site) |
| **Stack** | Next.js 16 · wagmi v2 · viem · Tailwind · Framer Motion |
| **Chain** | Fuji `43113` (see `lib/chain.ts`, `lib/contracts.ts`) |

## Local development

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_BACKEND_URL (e.g. http://localhost:3001)
# Addresses default to Fuji V2; override with NEXT_PUBLIC_* if needed
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Connect MetaMask on **Avalanche Fuji**.

## Useful routes

| Route | Purpose |
|---|---|
| `/campaigns` | Browse & open campaigns |
| `/transparency` | Public ledger (no wallet) |
| `/yield` | Mock USDC yield controls |
| `/governance` | Proposals & voting |
| `/dashboard` | Donor / org home |
| `/admin` | Role-gated admin |

## Deploy

Hosted on Vercel. Env vars and domain: [../docs/hosting.md](../docs/hosting.md).

```bash
npm run build
```
