"use client";

import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import type { Analytics } from "../types";

export function useAnalytics() {
  const { data, error, isLoading } = useSWR<Analytics>("/api/analytics", fetcher);
  return { analytics: data ?? null, error, isLoading };
}
