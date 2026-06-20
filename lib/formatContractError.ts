/** Extract a human-readable message from viem/wagmi contract errors. */
export function formatContractError(err: unknown): string {
  if (!err) return "Transaction would revert";
  if (typeof err === "string") return err;
  if (err instanceof Error) {
    const msg = err.message;
    const revertMatch = msg.match(/reverted with the following reason:\s*['"]?([^'"\n]+)/i);
    if (revertMatch?.[1]) return revertMatch[1];
    const shortMatch = msg.match(/(?:CharityCore|Vault|DAO): [^'"\n]+/);
    if (shortMatch?.[0]) return shortMatch[0];
    return msg.split("\n")[0] ?? "Transaction failed";
  }
  return "Transaction failed";
}
