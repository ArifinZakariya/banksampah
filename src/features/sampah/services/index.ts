import { apiRequest } from "@/services/api";
import type { Sampah } from "@/types";
import type { CreateSampahSchema } from "../schemas";

export const sampahService = {
  async getAll(): Promise<Sampah[]> {
    return apiRequest<Sampah[]>("/api/sampah");
  },

  async create(data: CreateSampahSchema): Promise<Sampah> {
    return apiRequest<Sampah>("/api/sampah", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<CreateSampahSchema>): Promise<Sampah> {
    return apiRequest<Sampah>(`/api/sampah/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest<void>(`/api/sampah/${id}`, { method: "DELETE" });
  },
};
