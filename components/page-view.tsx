"use client";
import { useEffect } from "react";

export function PageView({ username }: { username: string }) {
  useEffect(() => { void fetch(`/api/view/${encodeURIComponent(username)}`, { method: "POST", keepalive: true }); }, [username]);
  return null;
}
