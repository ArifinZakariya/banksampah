import { apiRequest } from "@/services/api";
import type { User } from "@/types";
import type { UpdateProfileSchema } from "../schemas";

export const userService = {
  async getAll(): Promise<User[]> {
    return apiRequest<User[]>("/api/users");
  },

  async updateProfile(data: UpdateProfileSchema): Promise<User> {
    return apiRequest<User>("/api/users/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest<void>(`/api/users/${id}`, { method: "DELETE" });
  },
};
