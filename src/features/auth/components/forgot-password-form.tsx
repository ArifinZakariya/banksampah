"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { KeyRound, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/services/api";

interface ForgotPasswordResponse {
  message: string;
  password: string;
}

export function ForgotPasswordForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRevealedPassword(null);

    try {
      const res = await apiRequest<ForgotPasswordResponse>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setRevealedPassword(res.password);
    } catch (err: any) {
      setError(err.message || "Gagal mencari password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn("w-full max-w-md border-0 shadow-2xl", className)}>
      <CardHeader className="text-center pt-8 pb-2">
        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm">
          <KeyRound className="w-7 h-7 text-sky-300" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Lupa Password</CardTitle>
        <CardDescription className="text-white/60">
          Masukkan email yang digunakan saat mendaftar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4 px-7 pb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-400/30 text-red-200 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-white/80 text-xs font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 bg-white/90 border-white/20 text-gray-900 text-sm placeholder:text-gray-400 focus:border-sky-400 focus:ring-sky-400"
            />
          </div>
          <Button type="submit" className="w-full h-11 gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm mt-2" disabled={loading} size="lg">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mencari...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Cari Password
              </span>
            )}
          </Button>
        </form>

        {revealedPassword && (
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-400/30">
              <p className="text-emerald-200 text-sm mb-2">Password Anda:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-white font-mono text-lg tracking-wider">
                  {showPassword ? revealedPassword : "•".repeat(revealedPassword.length)}
                </code>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <p className="text-white/50 text-xs text-center">
              Gunakan password ini untuk masuk ke akun Anda
            </p>
          </div>
        )}

        <p className="text-center text-sm text-white/60">
          <Link href="/login" className="inline-flex items-center gap-1.5 font-medium text-sky-300 hover:text-sky-200 underline underline-offset-4">
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
