"use client";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

function getSocket() {
  if (typeof window === "undefined") return null;
  if (!socket) {
    const url =
      window.location.hostname === "localhost"
        ? process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
        : window.location.origin;
    socket = io(url, { path: "/socket.io", transports: ["websocket", "polling"] });
  }
  return socket;
}

export function useSocketEvents(
  handlers: Partial<{
    donationReceived: (data: unknown) => void;
    campaignCreated: (data: unknown) => void;
  }>
) {
  useEffect(() => {
    const s = getSocket();
    if (!s) return;

    if (handlers.donationReceived) s.on("donationReceived", handlers.donationReceived);
    if (handlers.campaignCreated) s.on("campaignCreated", handlers.campaignCreated);

    return () => {
      if (handlers.donationReceived) s.off("donationReceived", handlers.donationReceived);
      if (handlers.campaignCreated) s.off("campaignCreated", handlers.campaignCreated);
    };
  }, [handlers]);
}
