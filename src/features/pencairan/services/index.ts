import { apiRequest } from "@/services/api";
import type { Pencairan } from "@/types";
import type { CreatePencairanSchema, UpdateStatusPencairanSchema } from "../schemas";

export const pencairanService = {
  async getAll(): Promise<Pencairan[]> {
    return apiRequest<Pencairan[]>("/api/pencairan");
  },

  async create(data: CreatePencairanSchema): Promise<Pencairan> {
    return apiRequest<Pencairan>("/api/pencairan", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateStatus(id: string, data: UpdateStatusPencairanSchema): Promise<Pencairan> {
    return apiRequest<Pencairan>(`/api/pencairan/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
