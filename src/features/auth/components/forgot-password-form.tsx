"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/services/api";

export function ForgotPasswordForm({ className }: { className?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email, newPassword }),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Gagal mereset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className={cn("w-full max-w-md border-0 shadow-2xl", className)}>
        <CardHeader className="text-center pt-8 pb-2">
          <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-500/20 backdrop-blur-sm">
            <CheckCircle2 className="w-7 h-7 text-emerald-300" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Berhasil!</CardTitle>
          <CardDescription className="text-white/60">
            Password Anda telah berhasil direset
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 px-7 pb-8">
          <Button
            onClick={() => router.push("/login")}
            className="w-full h-11 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm"
          >
            Masuk Sekarang
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full max-w-md border-0 shadow-2xl", className)}>
      <CardHeader className="text-center pt-8 pb-2">
        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm">
          <KeyRound className="w-7 h-7 text-sky-300" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
        <CardDescription className="text-white/60">
          Masukkan email dan password baru Anda
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
          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-white/80 text-xs font-medium">Password Baru</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Min. 6 karakter"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="h-11 bg-white/90 border-white/20 text-gray-900 text-sm placeholder:text-gray-400 focus:border-sky-400 focus:ring-sky-400"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-white/80 text-xs font-medium">Konfirmasi Password Baru</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="h-11 bg-white/90 border-white/20 text-gray-900 text-sm placeholder:text-gray-400 focus:border-sky-400 focus:ring-sky-400"
            />
          </div>
          <Button type="submit" className="w-full h-11 gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm mt-2" disabled={loading} size="lg">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mereset...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Reset Password
              </span>
            )}
          </Button>
        </form>
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
