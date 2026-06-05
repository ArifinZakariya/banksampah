"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { UserPlus, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function RegisterForm({ className }: { className?: string }) {
  const { register, loading, error } = useAuth();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    register({ nama, email, password });
  };

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
        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="h-11 bg-white/90 border-white/20 text-gray-900 text-sm placeholder:text-gray-400 focus:border-sky-400 focus:ring-sky-400"
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm mt-2" disabled={loading} size="lg">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memuat...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Daftar
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
