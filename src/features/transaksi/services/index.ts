import { apiRequest } from "@/services/api";
import type { Transaksi } from "@/types";
import type { CreateTransaksiSchema, UpdateStatusTransaksiSchema } from "../schemas";

export const transaksiService = {
  async getAll(): Promise<Transaksi[]> {
    return apiRequest<Transaksi[]>("/api/transaksi");
  },

  async create(data: CreateTransaksiSchema): Promise<Transaksi> {
    return apiRequest<Transaksi>("/api/transaksi", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateStatus(id: string, data: UpdateStatusTransaksiSchema): Promise<Transaksi> {
    return apiRequest<Transaksi>(`/api/transaksi/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
