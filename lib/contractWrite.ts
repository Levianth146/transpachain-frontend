import type { Abi, Address, PublicClient } from "viem";

const GAS_BUFFER_NUM = 120n;
const GAS_BUFFER_DEN = 100n;

type EstimateParams = {
  address: Address;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
  value?: bigint;
  account?: Address;
};

export async function gasWithBuffer(
  client: PublicClient | undefined,
  params: EstimateParams,
  fallback: bigint
): Promise<bigint> {
  if (!client || !params.account) return fallback;
  try {
    const estimate = await client.estimateContractGas({
      address: params.address,
      abi: params.abi,
      functionName: params.functionName,
      args: params.args,
      value: params.value,
      account: params.account,
    });
    return (estimate * GAS_BUFFER_NUM) / GAS_BUFFER_DEN;
  } catch {
    return fallback;
  }
}
