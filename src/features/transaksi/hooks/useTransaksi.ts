"use client";

import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import type { Transaksi } from "@/types";
import { transaksiService } from "../services";
import { useState } from "react";
import type { CreateTransaksiSchema } from "../schemas";

export function useTransaksiList() {
  const { data, error, isLoading, mutate } = useSWR<Transaksi[]>("/api/transaksi", fetcher);
  return { transaksi: data ?? [], error, isLoading, mutate };
}

export function useCreateTransaksi() {
  const [loading, setLoading] = useState(false);

  const create = async (data: CreateTransaksiSchema) => {
    setLoading(true);
    try {
      return await transaksiService.create(data);
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}
