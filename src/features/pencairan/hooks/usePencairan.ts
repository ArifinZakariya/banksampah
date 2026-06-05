"use client";

import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import type { Pencairan } from "@/types";
import { pencairanService } from "../services";
import { useState } from "react";
import type { CreatePencairanSchema } from "../schemas";

export function usePencairanList() {
  const { data, error, isLoading, mutate } = useSWR<Pencairan[]>("/api/pencairan", fetcher);
  return { pencairan: data ?? [], error, isLoading, mutate };
}

export function useCreatePencairan() {
  const [loading, setLoading] = useState(false);

  const create = async (data: CreatePencairanSchema) => {
    setLoading(true);
    try {
      return await pencairanService.create(data);
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}
