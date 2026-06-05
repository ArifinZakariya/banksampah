"use client";

import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import type { Tabungan } from "@/types";

export function useTabungan() {
  const { data, error, isLoading, mutate } = useSWR<Tabungan>("/api/tabungan", fetcher);
  return { tabungan: data ?? null, error, isLoading, mutate };
}
