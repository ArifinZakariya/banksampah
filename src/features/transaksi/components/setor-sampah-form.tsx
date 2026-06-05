"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTransaksi } from "../hooks/useTransaksi";
import type { Sampah } from "@/types";

interface SetorSampahFormProps {
  sampahList: Sampah[];
  onSuccess?: () => void;
}

export function SetorSampahForm({ sampahList, onSuccess }: SetorSampahFormProps) {
  const { create, loading } = useCreateTransaksi();
  const [sampahId, setSampahId] = useState("");
  const [beratKg, setBeratKg] = useState("");
  const [catatan, setCatatan] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create({ sampahId, beratKg: parseFloat(beratKg), catatan });
      setBeratKg("");
      setCatatan("");
      onSuccess?.();
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sampah">Jenis Sampah</Label>
        <select
          id="sampah"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={sampahId}
          onChange={(e) => setSampahId(e.target.value)}
          required
        >
          <option value="">Pilih sampah</option>
          {sampahList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nama} - Rp {s.hargaPerKg.toLocaleString("id-ID")}/kg
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
          value={beratKg}
          onChange={(e) => setBeratKg(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="catatan">Catatan</Label>
        <Input id="catatan" value={catatan} onChange={(e) => setCatatan(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Menyimpan..." : "Setor Sampah"}
      </Button>
    </form>
  );
}
