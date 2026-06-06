"use client";

import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, EmptyState } from "@/components/shared";
import { Users, Eye, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { userService } from "@/features/users/services";

interface Anggota {
  id: string;
  nama: string;
  email: string;
  createdAt: string;
  tabungan: { saldo: number } | null;
  _count: { transaksi: number };
}

export default function AdminAnggotaPage() {
  const { data: anggota, isLoading, mutate } = useSWR<Anggota[]>("/api/users", fetcher);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus anggota "${nama}"? Semua data terkait akan dihapus dan tidak bisa dikembalikan.`)) return;
    setDeletingId(id);
    setFeedback(null);
    try {
      await userService.delete(id);
      setFeedback({ type: "success", message: `"${nama}" berhasil dihapus` });
      mutate();
    } catch {
      setFeedback({ type: "error", message: "Gagal menghapus anggota" });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Anggota</h1>
        <p className="text-muted-foreground mt-1">Daftar semua anggota Bank Sampah</p>
      </div>

      {feedback && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
          feedback.type === "success"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-red-50 text-red-600 border border-red-200"
        }`}>
          {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {feedback.message}
        </div>
      )}

      {!anggota?.length ? (
        <EmptyState message="Belum ada anggota" icon="👥" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              Daftar Anggota
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Nama</th>
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Email</th>
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Saldo</th>
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Total Setoran</th>
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Bergabung</th>
                    <th className="px-6 py-3.5 text-right font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {anggota.map((a) => (
                    <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{a.nama}</td>
                      <td className="px-6 py-4 text-muted-foreground">{a.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant="success">Rp {(a.tabungan?.saldo ?? 0).toLocaleString("id-ID")}</Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{a._count.transaksi}x</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(a.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Link href={`/admin/anggota/${a.id}`}>
                            <Button size="sm" variant="outline" className="gap-1.5">
                              <Eye className="w-3.5 h-3.5" />
                              Detail
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(a.id, a.nama)}
                            disabled={deletingId === a.id}
                            className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            {deletingId === a.id ? (
                              <span className="w-3.5 h-3.5 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
