import { apiRequest } from "@/services/api";
import type { Tabungan } from "@/types";

export const tabunganService = {
  async get(): Promise<Tabungan> {
    return apiRequest<Tabungan>("/api/tabungan");
  },
};
