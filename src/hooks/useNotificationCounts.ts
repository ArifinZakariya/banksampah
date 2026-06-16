"use client";

import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import { useCallback } from "react";

interface NotificationCounts {
  pendingTransaksi: number;
  pendingPencairan: number;
  totalTransaksi: number;
  totalPencairan: number;
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
    { refreshInterval: 10000 }
  );

  const lastSeen = getLastSeen();

  const pendingTransaksi = data?.pendingTransaksi ?? 0;
  const pendingPencairan = data?.pendingPencairan ?? 0;
  const totalTransaksi = data?.totalTransaksi ?? 0;
  const totalPencairan = data?.totalPencairan ?? 0;
  const confirmedTransaksi = data?.confirmedTransaksi ?? 0;
  const approvedPencairan = data?.approvedPencairan ?? 0;

  const hasNewTransaksi = pendingTransaksi > 0 && totalTransaksi !== (lastSeen["transaksi"] ?? -1);
  const hasNewPencairanAdmin = pendingPencairan > 0 && totalPencairan !== (lastSeen["pencairan_admin"] ?? -1);
  const hasNewHistori = confirmedTransaksi > (lastSeen["histori"] ?? 0);
  const hasNewPencairanAnggota = approvedPencairan > (lastSeen["pencairan_anggota"] ?? 0);

  const markAsRead = useCallback((menu: string) => {
    if (menu === "transaksi") {
      setLastSeen(menu, totalTransaksi);
    } else if (menu === "pencairan_admin") {
      setLastSeen(menu, totalPencairan);
    } else if (menu === "histori") {
      setLastSeen(menu, confirmedTransaksi);
    } else if (menu === "pencairan_anggota") {
      setLastSeen(menu, approvedPencairan);
    }
    mutate();
  }, [totalTransaksi, totalPencairan, confirmedTransaksi, approvedPencairan, mutate]);

  return {
    hasNewTransaksi,
    hasNewPencairanAdmin,
    hasNewHistori,
    hasNewPencairanAnggota,
    isLoading,
    markAsRead,
  };
}
