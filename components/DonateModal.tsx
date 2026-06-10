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
        title: "Bạn đã nhận NFT Donor Badge",
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
    });
  };

  const handleDonate = () => {
    if (!amount || isNaN(Number(amount))) return;
    addToast({ type: "pending", title: "Donation pending...", message: "Confirm in MetaMask" });
    if (isUSDC) {
      donateUSDC(campaignId, parsedAmount);
    } else {
      donate(campaignId, amount);
    }
  };

  const busy =
    ethPending || ethConfirming || usdcDonatePending || usdcDonateConfirming || approvePending;

  if (ethSuccess || usdcDonateSuccess) {
    const tier = successTier ?? 0;
    const txHash = ethHash ?? usdcHash;
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center space-y-3">
        <Image src={tierImagePath(tier)} alt={tierLabel(tier)} width={96} height={96} className="mx-auto rounded-lg" />
        <p className="text-emerald-700 dark:text-emerald-400 font-medium">
          Bạn đã nhận NFT Donor Badge — {tierLabel(tier)}
        </p>
        <TxLink hash={txHash} label="View on SepoliaScan" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 dark:bg-zinc-900/90 border border-gold-200/30 rounded-xl p-5 shadow-sm"
    >
      <h3 className="font-semibold mb-3 flex items-center gap-2 text-ink-900 dark:text-cream-100">
        <HandCoins size={20} weight="duotone" className="text-emerald-600" />
        Make a Donation
      </h3>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50">
          <Lock size={10} weight="duotone" /> Escrowed on-chain
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200/50">
          <ShieldCheck size={10} weight="duotone" /> DAO-governed release
        </span>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        Token: {isUSDC ? "USDC (Sepolia)" : "ETH"} · Unlike traditional charity, your funds stay in the vault until milestones pass a donor vote.
      </p>
      <div className="flex flex-col gap-2">
        <input
          type="number"
          placeholder={isUSDC ? "Amount in USDC" : "Amount in ETH"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800"
          min="0"
          step={isUSDC ? "1" : "0.001"}
        />
        {isUSDC && needsApprove && (
          <button
            onClick={handleApprove}
            disabled={!isConnected || busy}
            className="w-full py-2 bg-gold-500 text-ink-950 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {approvePending ? "Approving..." : "1. Approve USDC"}
          </button>
        )}
        <button
          onClick={handleDonate}
          disabled={!isConnected || busy || (isUSDC && needsApprove)}
          className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-emerald-700"
        >
          {busy ? "Confirm in wallet..." : isUSDC && needsApprove ? "2. Donate (after approve)" : "Donate"}
        </button>
      </div>
      {!isConnected && <p className="text-xs text-amber-600 mt-2">Connect wallet to donate</p>}
      {(ethError || usdcDonateError) && (
        <p className="text-xs text-red-500 mt-2">{(ethError || usdcDonateError)?.message}</p>
      )}
    </motion.div>
  );
}
