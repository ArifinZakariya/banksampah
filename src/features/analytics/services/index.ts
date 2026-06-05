import { apiRequest } from "@/services/api";
import type { Analytics } from "../types";

export const analyticsService = {
  async get(): Promise<Analytics> {
    return apiRequest<Analytics>("/api/analytics");
  },
};
