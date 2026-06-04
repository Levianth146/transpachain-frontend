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

type SocketHandlers = Partial<{
  donationReceived: (data: { campaignId?: number }) => void;
  campaignCreated: (data: unknown) => void;
  campaignUpdated: (data: { campaignId?: number }) => void;
  deadlineExtended: (data: { campaignId?: number }) => void;
  proposalCreated: (data: { campaignId?: number }) => void;
  campaignFinalized: (data: { campaignId?: number }) => void;
}>;

export function useSocketEvents(handlers: SocketHandlers) {
  useEffect(() => {
    const s = getSocket();
    if (!s) return;

    const pairs: [keyof SocketHandlers, string][] = [
      ["donationReceived", "donationReceived"],
      ["campaignCreated", "campaignCreated"],
      ["campaignUpdated", "campaignUpdated"],
      ["deadlineExtended", "deadlineExtended"],
      ["proposalCreated", "proposalCreated"],
      ["campaignFinalized", "campaignFinalized"],
    ];

    for (const [key, event] of pairs) {
      const fn = handlers[key];
      if (fn) s.on(event, fn as (...args: unknown[]) => void);
    }

    return () => {
      for (const [key, event] of pairs) {
        const fn = handlers[key];
        if (fn) s.off(event, fn as (...args: unknown[]) => void);
      }
    };
  }, [handlers]);
}
