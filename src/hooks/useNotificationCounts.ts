"use client";

import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import { useCallback } from "react";

interface NotificationCounts {
  pendingTransaksi: number;
  pendingPencairan: number;
  confirmedTransaksi: number;
  approvedPencairan: number;
}

function getLastSeen(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("notification_last_seen") || "{}");
  } catch {
    return {};
  }
}

function setLastSeen(menu: string, count: number) {
  const lastSeen = getLastSeen();
  lastSeen[menu] = count;
  localStorage.setItem("notification_last_seen", JSON.stringify(lastSeen));
}

export function useNotificationCounts() {
  const { data, isLoading, mutate } = useSWR<NotificationCounts>(
    "/api/counts",
    fetcher,
    { refreshInterval: 15000 }
  );

  const lastSeen = getLastSeen();

  const pendingTransaksi = data?.pendingTransaksi ?? 0;
  const pendingPencairan = data?.pendingPencairan ?? 0;
  const confirmedTransaksi = data?.confirmedTransaksi ?? 0;
  const approvedPencairan = data?.approvedPencairan ?? 0;

  const hasNewTransaksi = pendingTransaksi > (lastSeen["transaksi"] ?? 0);
  const hasNewPencairanAdmin = pendingPencairan > (lastSeen["pencairan_admin"] ?? 0);
  const hasNewHistori = confirmedTransaksi > (lastSeen["histori"] ?? 0);
  const hasNewPencairanAnggota = approvedPencairan > (lastSeen["pencairan_anggota"] ?? 0);

  const markAsRead = useCallback((menu: string) => {
    const current = menu.includes("transaksi")
      ? pendingTransaksi
      : menu.includes("pencairan_admin")
      ? pendingPencairan
      : menu.includes("histori")
      ? confirmedTransaksi
      : approvedPencairan;
    setLastSeen(menu, current);
    mutate();
  }, [pendingTransaksi, pendingPencairan, confirmedTransaksi, approvedPencairan, mutate]);

  return {
    hasNewTransaksi,
    hasNewPencairanAdmin,
    hasNewHistori,
    hasNewPencairanAnggota,
    isLoading,
    markAsRead,
  };
}
