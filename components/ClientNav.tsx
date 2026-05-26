"use client";
import Link from "next/link";
import { ConnectWallet } from "./ConnectWallet";
import { useMounted } from "@/hooks/useMounted";

export function ClientNav() {
  const mounted = useMounted();
  if (!mounted) return null;
  return (
    <div className="flex items-center gap-6">
      <div className="flex gap-4 text-sm">
        <Link href="/" className="text-gray-600 hover:text-emerald-600">Campaigns</Link>
        <Link href="/campaigns/create" className="text-gray-600 hover:text-emerald-600">Create</Link>
        <Link href="/dashboard" className="text-gray-600 hover:text-emerald-600">Dashboard</Link>
      </div>
      <ConnectWallet />
    </div>
  );
}
