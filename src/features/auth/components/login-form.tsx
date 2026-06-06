"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginForm({ className, logoSrc }: { className?: string; logoSrc?: string }) {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <Card className={cn("w-full border-0", className)}>
      <CardHeader className="text-center pt-10 pb-1">
        {logoSrc && (
          <Image
            src={logoSrc}
            alt="Bank Sampah"
            width={88}
            height={88}
            className="w-24 h-24 mx-auto mb-4 object-contain brightness-0 invert"
            priority
          />
        )}
        <CardTitle className="text-2xl font-bold text-white tracking-tight">Masuk</CardTitle>
        <CardDescription className="text-white/50 text-sm mt-1">
          Masuk ke akun Bank Sampah Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-5 px-8 pb-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-400/30 text-red-200 text-sm text-center">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-white/70 text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 bg-white/90 border-white/20 text-gray-900 text-sm placeholder:text-gray-400 focus:border-emerald-400 focus:ring-emerald-400 rounded-lg"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white/70 text-sm font-medium">Password</Label>
              <Link href="/forgot-password" className="text-xs text-white/50 hover:text-white/70 transition-colors">
                Lupa password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 bg-white/90 border-white/20 text-gray-900 text-sm placeholder:text-gray-400 focus:border-emerald-400 focus:ring-emerald-400 rounded-lg"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memuat...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Masuk
              </span>
            )}
          </Button>
        </form>
        <p className="text-center text-sm text-white/50">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-emerald-300 hover:text-emerald-200 underline underline-offset-4">
            Daftar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
