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
    "0x1c7D4B196CbEBB0b5044c23B72C5E7C6E7e6e7e") as `0x${string}`;

export const USDC_DECIMALS = 6;
