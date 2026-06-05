"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreatePencairan } from "../hooks/usePencairan";
import { Wallet } from "lucide-react";

interface AjukanPencairanFormProps {
  saldo: number;
  onSuccess?: () => void;
}

export function AjukanPencairanForm({ saldo, onSuccess }: AjukanPencairanFormProps) {
  const { create, loading } = useCreatePencairan();
  const [jumlah, setJumlah] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await create({ jumlah: parseFloat(jumlah) });
      setJumlah("");
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="jumlah">Jumlah Pencairan</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
            Rp
          </span>
          <Input
            id="jumlah"
            type="number"
            min="10000"
            max={saldo}
            placeholder="100000"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            className="pl-10"
            required
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Min. Rp 10.000</span>
          <span>Saldo: Rp {saldo.toLocaleString("id-ID")}</span>
        </div>
      </div>
      <Button type="submit" className="w-full gap-2" disabled={loading || !jumlah || parseFloat(jumlah) > saldo} size="lg">
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Memproses...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Ajukan Pencairan
          </span>
        )}
      </Button>
    </form>
  );
}
