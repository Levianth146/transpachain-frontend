import {
  encodeFunctionData,
  type Address,
  type Hex,
  type PublicClient,
  type WalletClient,
} from "viem";
import {
  ADDRESSES,
  DISBURSEMENT_CONTROLLER_ABI,
  SAFE_ABI,
  isContractConfigured,
} from "./contracts";

const ZERO = "0x0000000000000000000000000000000000000000" as const;

export type SafeTxParams = {
  to: Address;
  value: bigint;
  data: Hex;
  operation: number;
  safeTxGas: bigint;
  baseGas: bigint;
  gasPrice: bigint;
  gasToken: Address;
  refundReceiver: Address;
  nonce: bigint;
};

/** Build Call data for Safe → DisbursementController.executeDisbursement(requestId). */
export function encodeExecuteDisbursement(requestId: bigint): Hex {
  return encodeFunctionData({
    abi: DISBURSEMENT_CONTROLLER_ABI,
    functionName: "executeDisbursement",
    args: [requestId],
  });
}

export async function buildExecuteDisbursementSafeTx(
  publicClient: PublicClient,
  requestId: bigint
): Promise<SafeTxParams> {
  if (!isContractConfigured(ADDRESSES.disbursementController)) {
    throw new Error("DisbursementController not configured (NEXT_PUBLIC_DISBURSEMENT_CONTROLLER_ADDRESS)");
  }
  if (!isContractConfigured(ADDRESSES.disbursementSafe)) {
    throw new Error("Safe not configured (NEXT_PUBLIC_DISBURSEMENT_SAFE)");
  }
  const nonce = (await publicClient.readContract({
    address: ADDRESSES.disbursementSafe,
    abi: SAFE_ABI,
    functionName: "nonce",
  })) as bigint;

  return {
    to: ADDRESSES.disbursementController,
    value: 0n,
    data: encodeExecuteDisbursement(requestId),
    operation: 0,
    safeTxGas: 0n,
    baseGas: 0n,
    gasPrice: 0n,
    gasToken: ZERO,
    refundReceiver: ZERO,
    nonce,
  };
}

/** On-chain Safe.getTransactionHash — preferred over re-implementing EIP-712. */
export async function getSafeTxHash(
  publicClient: PublicClient,
  tx: SafeTxParams
): Promise<`0x${string}`> {
  return (await publicClient.readContract({
    address: ADDRESSES.disbursementSafe,
    abi: SAFE_ABI,
    functionName: "getTransactionHash",
    args: [
      tx.to,
      tx.value,
      tx.data,
      tx.operation,
      tx.safeTxGas,
      tx.baseGas,
      tx.gasPrice,
      tx.gasToken,
      tx.refundReceiver,
      tx.nonce,
    ],
  })) as `0x${string}`;
}

/**
 * Sign the Safe tx hash. Uses personal_sign (eth_sign style) which matches
 * backend recoverSafeTxSigner (ethers.verifyMessage over the 32-byte digest).
 * Safe treats v adjusted by +4 for eth_sign signatures when packing.
 */
export async function signSafeTxHash(
  walletClient: WalletClient,
  account: Address,
  safeTxHash: `0x${string}`
): Promise<`0x${string}`> {
  // personal_sign over the raw 32-byte hash (wallet prefixes with EIP-191)
  const sig = await walletClient.signMessage({
    account,
    message: { raw: safeTxHash },
  });
  return adjustEthSignV(sig);
}

/** Safe eth_sign signatures use v = 31/32 (original v + 4). */
export function adjustEthSignV(signature: `0x${string}`): `0x${string}` {
  const bytes = hexToBytes(signature);
  if (bytes.length !== 65) return signature;
  let v = bytes[64]!;
  if (v === 0 || v === 1) v += 27;
  if (v === 27 || v === 28) {
    bytes[64] = v + 4;
  }
  return bytesToHex(bytes);
}

/** Pack signatures sorted by signer address ascending (Safe requirement). */
export function packSafeSignatures(
  entries: Array<{ signer: string; signature: string }>
): `0x${string}` {
  const sorted = [...entries].sort((a, b) =>
    a.signer.toLowerCase().localeCompare(b.signer.toLowerCase())
  );
  let packed = "0x";
  for (const e of sorted) {
    const sig = e.signature.startsWith("0x") ? e.signature.slice(2) : e.signature;
    packed += sig;
  }
  return packed as `0x${string}`;
}

export async function execSafeTransaction(
  walletClient: WalletClient,
  account: Address,
  tx: SafeTxParams,
  packedSignatures: `0x${string}`
): Promise<`0x${string}`> {
  const hash = await walletClient.writeContract({
    address: ADDRESSES.disbursementSafe,
    abi: SAFE_ABI,
    functionName: "execTransaction",
    args: [
      tx.to,
      tx.value,
      tx.data,
      tx.operation,
      tx.safeTxGas,
      tx.baseGas,
      tx.gasPrice,
      tx.gasToken,
      tx.refundReceiver,
      packedSignatures,
    ],
    account,
    chain: walletClient.chain,
  });
  return hash;
}

function hexToBytes(hex: string): Uint8Array {
  const h = hex.startsWith("0x") ? hex.slice(2) : hex;
  const out = new Uint8Array(h.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function bytesToHex(bytes: Uint8Array): `0x${string}` {
  let hex = "0x";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i]!.toString(16).padStart(2, "0");
  }
  return hex as `0x${string}`;
}
