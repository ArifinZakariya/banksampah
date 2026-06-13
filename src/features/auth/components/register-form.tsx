"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UserPlus, Mail, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/services/api";

type Step = "form" | "verify";

export function RegisterForm({ className }: { className?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify({ email, purpose: "register" }),
      });
      setStep("verify");
    } catch (err: any) {
      setError(err.message || "Gagal mengirim kode verifikasi");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await apiRequest("/api/auth/verify/code", {
        method: "POST",
        body: JSON.stringify({ email, code: otp, purpose: "register" }),
      });

      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ nama, email, password }),
      });

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Verifikasi gagal");
    } finally {
      setLoading(false);
    }
  };

  if (step === "verify") {
    return (
      <Card className={cn("w-full max-w-md border-0 shadow-2xl", className)}>
        <CardHeader className="text-center pt-8 pb-2">
          <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm">
            <Mail className="w-7 h-7 text-sky-300" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Verifikasi Email</CardTitle>
          <CardDescription className="text-white/60">
            Masukkan kode 6 digit yang dikirim ke
          </CardDescription>
          <p className="text-sky-300 text-sm font-medium mt-1">{email}</p>
          <p className="text-amber-300 text-xs mt-1">Jika tidak menerima email, cek folder spam pada email</p>
        </CardHeader>
        <CardContent className="space-y-6 pt-4 px-7 pb-8">
          <form onSubmit={handleVerifyAndRegister} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-400/30 text-red-200 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="otp" className="text-white/80 text-xs font-medium">Kode Verifikasi</Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                maxLength={6}
                className="h-11 bg-white/90 border-white/20 text-gray-900 text-sm text-center text-2xl tracking-[0.5em] placeholder:text-gray-400 placeholder:tracking-normal placeholder:text-sm focus:border-sky-400 focus:ring-sky-400"
              />
            </div>
            <Button type="submit" className="w-full h-11 gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm mt-2" disabled={loading || otp.length !== 6} size="lg">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memverifikasi...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Verifikasi & Daftar
                </span>
              )}
            </Button>
          </form>
          <p className="text-center text-sm text-white/60">
            <button
              type="button"
              onClick={() => { setStep("form"); setOtp(""); setError(null); }}
              className="font-medium text-sky-300 hover:text-sky-200 underline underline-offset-4"
            >
              Kembali ke form daftar
            </button>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full max-w-md border-0 shadow-2xl", className)}>
      <CardHeader className="text-center pt-8 pb-2">
        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm">
          <UserPlus className="w-7 h-7 text-sky-300" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Daftar</CardTitle>
        <CardDescription className="text-white/60">Buat akun Bank Sampah baru</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4 px-7 pb-8">
        <form onSubmit={handleSendOTP} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-400/30 text-red-200 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="nama" className="text-white/80 text-xs font-medium">Nama Lengkap</Label>
            <Input
              id="nama"
              placeholder="Nama Anda"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="h-11 bg-white/90 border-white/20 text-gray-900 text-sm placeholder:text-gray-400 focus:border-sky-400 focus:ring-sky-400"
            />
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-white/80 text-xs font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11 bg-white/90 border-white/20 text-gray-900 text-sm placeholder:text-gray-400 focus:border-sky-400 focus:ring-sky-400"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-white/80 text-xs font-medium">Konfirmasi</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="h-11 bg-white/90 border-white/20 text-gray-900 text-sm placeholder:text-gray-400 focus:border-sky-400 focus:ring-sky-400"
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm mt-2" disabled={loading} size="lg">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mengirim kode...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Kirim Kode Verifikasi
              </span>
            )}
          </Button>
        </form>
        <p className="text-center text-sm text-white/60">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-sky-300 hover:text-sky-200 underline underline-offset-4">
            Masuk
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
