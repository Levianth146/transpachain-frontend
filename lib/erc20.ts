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

/** Circle USDC on Ethereum Sepolia */
export const USDC_ADDRESS =
  (process.env.NEXT_PUBLIC_USDC_ADDRESS ||
    "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238") as `0x${string}`;

export const USDC_DECIMALS = 6;
