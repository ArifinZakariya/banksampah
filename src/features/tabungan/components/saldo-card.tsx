"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SaldoCardProps {
  saldo: number;
  loading?: boolean;
}

export function SaldoCard({ saldo, loading }: SaldoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">Saldo Tabungan</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">
          {loading ? "..." : `Rp ${saldo.toLocaleString("id-ID")}`}
        </p>
      </CardContent>
    </Card>
  );
}
