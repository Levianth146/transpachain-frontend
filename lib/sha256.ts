/** Client-side SHA-256 over exact file bytes → `0x` + 64 hex (bytes32). */

export async function sha256File(file: File | Blob): Promise<`0x${string}`> {
  const buffer = await file.arrayBuffer();
  return sha256Bytes(new Uint8Array(buffer));
}

export async function sha256Bytes(bytes: Uint8Array): Promise<`0x${string}`> {
  // Copy into a fresh ArrayBuffer so TS accepts BufferSource (avoids SharedArrayBuffer union).
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const digest = await crypto.subtle.digest("SHA-256", copy.buffer);
  return bytesToHex(new Uint8Array(digest));
}

export function bytesToHex(bytes: Uint8Array): `0x${string}` {
  let hex = "0x";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i]!.toString(16).padStart(2, "0");
  }
  return hex as `0x${string}`;
}

export function normalizeHex32(value: string | undefined | null): string {
  if (!value) return "";
  const v = value.trim().toLowerCase();
  if (v.startsWith("0x")) return v;
  return `0x${v}`;
}

export function hashesMatch(a: string | undefined | null, b: string | undefined | null): boolean {
  const na = normalizeHex32(a);
  const nb = normalizeHex32(b);
  return Boolean(na && nb && na === nb);
}
