import { apiRequest } from "@/services/api";
import type { Log } from "@/types";

export const logService = {
  async getAll(): Promise<Log[]> {
    return apiRequest<Log[]>("/api/logs");
  },
};
