import { apiRequest } from "@/services/api";
import type { AuthResponse, LoginInput, RegisterInput } from "../types";

export const authService = {
  async login(data: LoginInput): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async register(data: RegisterInput): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<void> {
    await apiRequest("/api/auth/logout", { method: "POST" });
  },
};
