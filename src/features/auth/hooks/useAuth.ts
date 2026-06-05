"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "../services";
import type { LoginInput, RegisterInput } from "../types";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginInput) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(data);
      if (res.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/anggota");
      }
    } catch (err: any) {
      setError(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.register(data);
      router.push("/anggota");
    } catch (err: any) {
      setError(err.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore logout errors
    }
    router.push("/login");
  };

  return { login, register, logout, loading, error };
}
