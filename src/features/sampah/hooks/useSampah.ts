"use client";

import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import { useState } from "react";
import { sampahService } from "../services";
import type { Sampah } from "@/types";

export function useSampahList() {
  const { data, error, isLoading, mutate } = useSWR<Sampah[]>("/api/sampah", fetcher);
  return { sampah: data ?? [], error, isLoading, mutate };
}

export function useCreateSampah() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      return await sampahService.create(data);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateSampah() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      return await sampahService.update(id, data);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}
