"use client";

import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import type { Log } from "@/types";

export function useLogs() {
  const { data, error, isLoading, mutate } = useSWR<Log[]>("/api/logs", fetcher);
  return { logs: data ?? [], error, isLoading, mutate };
}
