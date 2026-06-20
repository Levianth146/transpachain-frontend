"use client";
import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, parseUnits } from "viem";
import { useDonate, useDonateUSDC } from "@/hooks/useDonationVault";
import { addToast } from "@/components/Toast";
import { ADDRESSES } from "@/lib/contracts";
import { ERC20_ABI, USDC_ADDRESS, USDC_DECIMALS } from "@/lib/erc20";
import { HandCoins, Lock, ShieldCheck } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { TxLink } from "@/components/TxLink";
import { tierFromEthAmount, tierImagePath, tierLabel } from "@/lib/nft";
import Image from "next/image";

export function DonateModal({
  campaignId,
  paymentToken = 0,
}: {
  campaignId: bigint;
  paymentToken?: number;
}) {
  const isUSDC = paymentToken === 1;
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [successTier, setSuccessTier] = useState<number | null>(null);

  const {
    donate,
    hash: ethHash,
    isPending: ethPending,
    isConfirming: ethConfirming,
    isSuccess: ethSuccess,
    error: ethError,
  } = useDonate();
  const {
    donateUSDC,
    hash: usdcHash,
    isPending: usdcDonatePending,
    isConfirming: usdcDonateConfirming,
    isSuccess: usdcDonateSuccess,
    error: usdcDonateError,
  } = useDonateUSDC();

  const { writeContract: writeApprove, data: approveHash, isPending: approvePending } = useWriteContract();
  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });

  const parsedAmount = isUSDC ? parseUnits(amount || "0", USDC_DECIMALS) : parseEther(amount || "0");

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, ADDRESSES.donationVault] : undefined,
    query: { enabled: isUSDC && !!address },
  });

  const needsApprove =
    isUSDC && parsedAmount > 0n && (allowance === undefined || allowance < parsedAmount);

  useEffect(() => {
    if (approveSuccess) {
      addToast({ type: "success", title: "USDC approved", message: "You can donate now" });
      refetchAllowance();
    }
  }, [approveSuccess, refetchAllowance]);

  useEffect(() => {
    if (ethSuccess || usdcDonateSuccess) {
      const amt = parseFloat(amount || "0");
      const tier = isUSDC ? 0 : tierFromEthAmount(amt);
      setSuccessTier(tier);
      addToast({
        type: "success",
        title: "You received a Donor Badge NFT",
        message: `${tierLabel(tier)} badge minted or upgraded for this campaign`,
      });
      setAmount("");
    }
  }, [ethSuccess, usdcDonateSuccess, amount, isUSDC]);

  const handleApprove = () => {
    if (!parsedAmount) return;
    addToast({ type: "pending", title: "Approving USDC...", message: "Confirm in MetaMask" });
    writeApprove({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [ADDRESSES.donationVault, parsedAmount],
      gas: 100000n,
    });
  };

  const handleDonate = () => {
    if (!amount || isNaN(Number(amount))) return;
    addToast({ type: "pending", title: "Donation pending...", message: "Confirm in MetaMask" });
    if (isUSDC) {
      void donateUSDC(campaignId, parsedAmount);
    } else {
      void donate(campaignId, amount);
    }
  };

  const busy =
    ethPending || ethConfirming || usdcDonatePending || usdcDonateConfirming || approvePending;

  if (ethSuccess || usdcDonateSuccess) {
    const tier = successTier ?? 0;
    const txHash = ethHash ?? usdcHash;
    const openseaUrl = `https://testnets.opensea.io/assets/sepolia/${ADDRESSES.impactNFT}`;
    return (
      <div className="glass-card space-y-4 p-5 text-center">
        <Image
          src={tierImagePath(tier)}
          alt={tierLabel(tier)}
          width={120}
          height={120}
          className="mx-auto rounded-xl border border-white/20 shadow-lg image-rendering-pixelated"
          style={{ imageRendering: "pixelated" }}
        />
        <p className="font-display font-semibold text-holo-mint">
          {tierLabel(tier)} Impact NFT minted!
        </p>
        <p className="text-xs leading-relaxed text-white/50">
          Check MetaMask → NFTs. If you see a placeholder, tap ⋯ → <strong className="text-white/70">Refresh metadata</strong>.
        </p>
        <div className="flex flex-col gap-2 text-xs">
          <TxLink hash={txHash} label="View transaction" />
          <a
            href={openseaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-holo-lavender hover:underline"
          >
            View on OpenSea Sepolia
          </a>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-holo-mint/20 bg-gradient-to-br from-ink-900/90 to-ink-950/90 p-5 backdrop-blur-sm"
    >
      <h3 className="font-semibold mb-3 flex items-center gap-2 text-white">
        <HandCoins size={20} weight="duotone" className="text-holo-mint" />
        Make a Donation
      </h3>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-holo-mint/10 text-holo-mint border border-holo-mint/30">
          <Lock size={10} weight="duotone" /> Escrowed on-chain
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-holo-lavender/10 text-holo-lavender border border-holo-lavender/30">
          <ShieldCheck size={10} weight="duotone" /> DAO-governed release
        </span>
      </div>

      <p className="text-xs text-white/50 mb-2">
        Token: {isUSDC ? "USDC (Sepolia)" : "ETH"} · 1% platform fee · Net amount enters escrow.
      </p>
      <div className="flex flex-col gap-2">
        <input
          type="number"
          placeholder={isUSDC ? "Amount in USDC" : "Amount in ETH"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm bg-black/40 text-white placeholder:text-white/30"
          min="0"
          step={isUSDC ? "1" : "0.001"}
        />
        {isUSDC && needsApprove && (
          <button
            onClick={handleApprove}
            disabled={!isConnected || busy}
            className="w-full py-2 bg-holo-gradient text-ink-950 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {approvePending ? "Approving..." : "1. Approve USDC"}
          </button>
        )}
        <button
          onClick={handleDonate}
          disabled={!isConnected || busy || (isUSDC && needsApprove)}
          className="w-full py-2 bg-holo-mint/90 text-ink-950 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-holo-mint"
        >
          {busy ? "Confirm in wallet..." : isUSDC && needsApprove ? "2. Donate (after approve)" : "Donate"}
        </button>
      </div>
      {!isConnected && <p className="text-xs text-amber-400 mt-2">Connect wallet to donate</p>}
      {(ethError || usdcDonateError) && (
        <p className="text-xs text-red-400 mt-2">{(ethError || usdcDonateError)?.message}</p>
      )}
    </motion.div>
  );
}
