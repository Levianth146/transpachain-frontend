# TranspaChain UI Improvement Audit

Assessment of ten "WOW" proposals against the current frontend codebase (June 2026).  
**Status:** implemented · partial · missing · **Fit:** implement now / later · **Effort:** S / M / L

---

| # | Proposal | Status | Fit? | Effort | Notes |
|---|----------|--------|------|--------|-------|
| 01 | Live activity feed ticker on hero | **Partial → Implemented** | Now | S | Socket `donationReceived` events carry campaignId, donor, amount, tokenType. `Web3HeroAnimated` now renders a scrolling ticker when live donations occur. No REST endpoint for historical feed; ticker is live-only unless a `/donations/recent` API is added. |
| 02 | Dark hero blockchain ambient bg | **Partial** | Now | S | `PageBackground` + `/backgrounds/landing.png` with theme-aware overlay (lighter light / darker dark). Additional mesh/grid CSS layers in hero. Full animated chain-node canvas would be L effort. |
| 03 | Campaign cards: progress + governance status pills | **Partial → Implemented** | Now | S | Progress bar and on-chain raised amounts existed. Added **Vote open** / **Timelock** pills via `api.getProposals(1|3)` in `CampaignList`, refreshed on governance socket events. |
| 04 | Etherscan latest tx embed on landing | **Missing** | Later | M | No Etherscan widget or contract tx list on landing. Would need iframe/API integration, rate limits, and design fit. Low trust ROI vs on-chain stats already shown. |
| 05 | NFT badge gallery animated (Bronze/Silver/Gold) | **Partial** | Later | M | `NFTGallery` on dashboard has tier styling, scanlines, hover motion. Not on landing; not a public gallery of all donors. Landing mention only in features copy. |
| 06 | 3-step onboarding on first wallet connect | **Missing** | Later | M | `ConnectWallet` connects directly; no first-connect tour or modal. MetaMask onboarding package is a dependency of wagmi, not a product onboarding flow. |
| 07 | Quadratic vote weight visualizer | **Partial** | Later | M | `VotingPanel` shows numeric QV weight and quorum bars on proposal detail. No standalone interactive visualizer on landing or governance hub explaining √donation curve. |
| 08 | Donation confirmation on-chain animation | **Partial** | Later | S–M | `DonateModal` shows tier NFT image + toast on success; no block-confirmation progress animation or vault-fill visual. Could enhance modal with tx receipt steps. |
| 09 | Hero copy rewrite (emotional pain point) | **Implemented** | Now | S | Hero subcopy updated: trust-break framing ("When donations vanish into opaque wallets…") while keeping professional tone. |
| 10 | IPFS proof viewer embedded | **Partial** | Later | M | `EvidencePanel` on campaign detail lists approved evidence with image preview and "Open on IPFS" link. Not embedded on landing; no inline IPFS document renderer (PDF/video). |

---

## Recommendations (priority order)

### Implement now (done or quick wins this pass)
1. **Light mode consistency** — landing sections, panels, workflow text (Parts A–D).
2. **#03 Governance pills** — high signal for active donors browsing campaigns.
3. **#09 Hero copy** — zero engineering risk, improves first impression.
4. **#01 Live ticker** — leverages existing Socket.IO infrastructure; no backend change required.

### Implement next sprint
- **#08 Donation animation** — extend success state in `DonateModal` with step indicator (submitted → confirmed → NFT minted).
- **#07 QV visualizer** — small explainer component on `/governance` or `/about` with sample √ curve chart.
- **#02 Hero ambient bg polish** — optional subtle CSS chain animation without heavy canvas.

### Defer
- **#04 Etherscan embed** — external dependency, maintenance burden, marginal UX vs native stats.
- **#05 Public NFT gallery** — privacy and indexing concerns; dashboard gallery suffices for MVP.
- **#06 Wallet onboarding tour** — valuable after core flows stabilize; needs copy + persistence (localStorage).
- **#10 Full IPFS viewer** — evidence panel adequate; deep viewer needs gateway fallbacks and MIME handling.

---

## Architecture notes

| Data | Source |
|------|--------|
| Campaign metadata | Mongo/API |
| Raised amounts | On-chain (`useCampaignProgressBatch`) |
| Governance state | Mongo proposals + on-chain `useProposal` |
| Live donations | Socket.IO `donationReceived` |
| Platform stats | `/campaigns/stats` + `useOnChainPlatformStats` |

No global "recent donations" REST endpoint exists; ticker and future activity widgets should prefer Socket.IO or a new indexed `/donations/recent?limit=N` route if historical scrollback is required.
