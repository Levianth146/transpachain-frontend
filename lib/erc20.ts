import { NETWORK } from "./chain";
export const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

/** Circle test USDC on the active network (Fuji by default) */
export const USDC_ADDRESS =
  (process.env.NEXT_PUBLIC_USDC_ADDRESS || NETWORK.defaultUsdc) as `0x${string}`;

export const USDC_DECIMALS = 6;
