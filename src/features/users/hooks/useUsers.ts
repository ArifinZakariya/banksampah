"use client";

import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import type { User } from "@/types";

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>("/api/users", fetcher);
  return { users: data ?? [], error, isLoading, mutate };
}
