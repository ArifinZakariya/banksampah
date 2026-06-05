"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSampah, useUpdateSampah } from "../hooks/useSampah";
import type { Sampah } from "@/types";

interface SampahFormProps {
  onSuccess?: () => void;
  initialData?: Sampah;
}

export function SampahForm({ onSuccess, initialData }: SampahFormProps) {
  const { create, loading: creating, error: createError } = useCreateSampah();
  const { update, loading: updating, error: updateError } = useUpdateSampah();
  const [nama, setNama] = useState(initialData?.nama ?? "");
  const [hargaPerKg, setHargaPerKg] = useState(initialData?.hargaPerKg.toString() ?? "");
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi ?? "");

  const loading = creating || updating;
  const error = createError || updateError;
  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await update(initialData.id, { nama, hargaPerKg: parseFloat(hargaPerKg), satuan: "kg", deskripsi });
      } else {
        await create({ nama, hargaPerKg: parseFloat(hargaPerKg), satuan: "kg", deskripsi });
        setNama("");
        setHargaPerKg("");
        setDeskripsi("");
      }
      onSuccess?.();
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">{error}</div>
      )}
      <div className="space-y-2">
        <Label htmlFor="nama">Nama Sampah</Label>
        <Input id="nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="harga">Harga per Kg (Rp)</Label>
        <Input
          id="harga"
          type="number"
          min="0"
          value={hargaPerKg}
          onChange={(e) => setHargaPerKg(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="deskripsi">Deskripsi</Label>
        <Input id="deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Sampah"}
      </Button>
    </form>
  );
}
