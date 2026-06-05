"use client";

import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner, EmptyState } from "@/components/shared";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Plus, Pencil, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { sampahService } from "@/features/sampah/services";
import type { Sampah } from "@/types";

export default function AdminSampahPage() {
  const router = useRouter();
  const { data: sampah, isLoading, mutate } = useSWR<Sampah[]>("/api/sampah", fetcher);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus "${nama}"? Data tidak bisa dikembalikan.`)) return;
    setDeletingId(id);
    setFeedback(null);
    try {
      await sampahService.delete(id);
      setFeedback({ type: "success", message: `"${nama}" berhasil dihapus` });
      mutate();
    } catch {
      setFeedback({ type: "error", message: "Gagal menghapus data" });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Data Sampah</h1>
          <p className="text-muted-foreground mt-1">Kelola jenis sampah dan harga per kg</p>
        </div>
        <Link href="/admin/sampah/tambah">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Sampah
          </Button>
        </Link>
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

      {!sampah?.length ? (
        <EmptyState message="Belum ada data sampah" icon="🗑️" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-muted-foreground" />
              Daftar Sampah
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Nama</th>
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Harga/kg</th>
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Satuan</th>
                    <th className="px-6 py-3.5 text-right font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {sampah.map((s) => (
                    <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{s.nama}</td>
                      <td className="px-6 py-4">
                        <Badge variant="success">Rp {s.hargaPerKg.toLocaleString("id-ID")}</Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{s.satuan}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Link href={`/admin/sampah/edit/${s.id}`}>
                            <Button size="sm" variant="outline" className="gap-1.5">
                              <Pencil className="w-3.5 h-3.5" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(s.id, s.nama)}
                            disabled={deletingId === s.id}
                            className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            {deletingId === s.id ? (
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
