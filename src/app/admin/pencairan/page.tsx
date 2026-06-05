"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner, EmptyState } from "@/components/shared";
import type { Pencairan } from "@/types";
import { Wallet, CheckCircle2, XCircle, Trash2, AlertCircle, Calendar, Users } from "lucide-react";

const statusBadge: Record<string, "warning" | "success" | "destructive"> = {
  MENUNGGU: "warning",
  DISETUJUI: "success",
  DITOLAK: "destructive",
};

const statusLabel: Record<string, string> = {
  MENUNGGU: "Menunggu",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak",
};

export default function AdminPencairanPage() {
  const { data: pencairan, isLoading, mutate } = useSWR<Pencairan[]>("/api/pencairan", fetcher);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  const members = useMemo(() => {
    if (!pencairan) return [];
    const map = new Map<string, string>();
    pencairan.forEach((p) => {
      if (p.user?.nama) map.set(p.userId, p.user.nama);
    });
    return Array.from(map.entries()).map(([id, nama]) => ({ id, nama }));
  }, [pencairan]);

  const filteredPencairan = useMemo(() => {
    if (!pencairan) return [];
    return pencairan.filter((p) => {
      if (selectedUserId && p.userId !== selectedUserId) return false;
      const pDate = new Date(p.createdAt);
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (pDate < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (pDate > end) return false;
      }
      return true;
    });
  }, [pencairan, startDate, endDate, selectedUserId]);

  const handleStatus = async (id: string, status: "DISETUJUI" | "DITOLAK") => {
    setProcessingId(id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/pencairan/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Gagal memproses pencairan" }));
        throw new Error(err.error || "Gagal memproses pencairan");
      }
      setFeedback({
        type: "success",
        message: status === "DISETUJUI" ? "Pencairan berhasil disetujui" : "Pencairan berhasil ditolak",
      });
      mutate();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data pencairan ini?")) return;
    setProcessingId(id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/pencairan/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus pencairan");
      setFeedback({ type: "success", message: "Pencairan berhasil dihapus" });
      mutate();
    } catch {
      setFeedback({ type: "error", message: "Gagal menghapus pencairan" });
    } finally {
      setProcessingId(null);
    }
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedUserId("");
  };

  const hasFilter = startDate || endDate || selectedUserId;

  if (isLoading) return <LoadingSpinner />;

  const pendingCount = filteredPencairan.filter((p) => p.status === "MENUNGGU").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Pencairan</h1>
          <p className="text-muted-foreground mt-1">Kelola permintaan pencairan saldo anggota</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-9 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <span className="text-muted-foreground text-sm">s/d</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-9 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
          </div>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="h-9 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Semua Anggota</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.nama}</option>
            ))}
          </select>
          {hasFilter && (
            <button
              onClick={clearFilters}
              className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Reset
            </button>
          )}
        </div>
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

      {!pencairan?.length ? (
        <EmptyState message="Belum ada pengajuan pencairan" icon="💰" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-muted-foreground" />
              Daftar Pencairan
              {pendingCount > 0 && (
                <Badge variant="warning" className="ml-auto">{pendingCount} menunggu</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Anggota</th>
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Jumlah</th>
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Tanggal</th>
                    <th className="px-6 py-3.5 text-right font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPencairan.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        Tidak ada data yang cocok dengan filter
                      </td>
                    </tr>
                  ) : (
                    filteredPencairan.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium">{p.user?.nama}</td>
                        <td className="px-6 py-4 font-medium">Rp {p.jumlah.toLocaleString("id-ID")}</td>
                        <td className="px-6 py-4">
                          <Badge variant={statusBadge[p.status]}>{statusLabel[p.status]}</Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(p.createdAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            {p.status === "MENUNGGU" ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatus(p.id, "DISETUJUI")}
                                  disabled={processingId === p.id}
                                  className="gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                >
                                  {processingId === p.id ? (
                                    <span className="w-3.5 h-3.5 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
                                  ) : <CheckCircle2 className="w-3.5 h-3.5" />}
                                  Setujui
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatus(p.id, "DITOLAK")}
                                  disabled={processingId === p.id}
                                  className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  {processingId === p.id ? (
                                    <span className="w-3.5 h-3.5 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                                  ) : <XCircle className="w-3.5 h-3.5" />}
                                  Tolak
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(p.id)}
                                disabled={processingId === p.id}
                                className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Hapus
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
