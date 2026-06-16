"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { fetcher } from "@/services/fetcher";
import useSWR from "swr";
import { Trash2, Send, Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import type { Sampah } from "@/types";

export default function SetorSampahPage() {
  const router = useRouter();
  const { data: sampahList } = useSWR<Sampah[]>("/api/sampah", fetcher);
  const [sampahId, setSampahId] = useState("");
  const [beratKg, setBeratKg] = useState("");
  const [catatan, setCatatan] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let fotoUrl = "";
      if (foto) {
        const formData = new FormData();
        formData.append("file", foto);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        fotoUrl = uploadData.url;
      }

      const res = await fetch("/api/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sampahId,
          beratKg: parseFloat(beratKg),
          catatan,
          foto: fotoUrl || undefined,
        }),
      });

      if (!res.ok) throw new Error("Gagal menyetor sampah");

      router.push("/anggota/histori?pending=1");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Setor Sampah</h1>
        <p className="text-muted-foreground mt-1">Setorkan sampah Anda dan dapatkan saldo</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-muted-foreground" />
            Form Setor Sampah
          </CardTitle>
          <CardDescription>Pilih jenis sampah dan masukkan beratnya</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="sampah">Jenis Sampah</Label>
              <select
                id="sampah"
                className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-all duration-200"
                value={sampahId}
                onChange={(e) => setSampahId(e.target.value)}
                required
              >
                <option value="">Pilih jenis sampah</option>
                {(sampahList ?? []).map((s: Sampah) => (
                  <option key={s.id} value={s.id}>
                    {s.nama} &mdash; Rp {s.hargaPerKg.toLocaleString("id-ID")}/kg
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="berat">Berat (kg)</Label>
              <Input
                id="berat"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="0.5"
                value={beratKg}
                onChange={(e) => setBeratKg(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foto">Foto Sampah (opsional)</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white text-sm cursor-pointer hover:bg-muted/50 transition-colors">
                  <Camera className="w-4 h-4" />
                  {foto ? "Ganti Foto" : "Pilih Foto"}
                  <input
                    id="foto"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFotoChange}
                  />
                </label>
                {foto && (
                  <button
                    type="button"
                    onClick={() => { setFoto(null); setFotoPreview(null); }}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                )}
              </div>
              {fotoPreview && (
                <div className="relative mt-2 w-32 h-32 rounded-lg overflow-hidden border border-border">
                  <Image
                    src={fotoPreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan (opsional)</Label>
              <Input
                id="catatan"
                placeholder="Contoh: sampah rumah tangga"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={loading} size="lg">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Setor Sampah
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
