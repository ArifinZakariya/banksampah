"use client";

import type { Transaksi } from "@/types";

interface TransaksiTableProps {
  transaksi: Transaksi[];
}

export function TransaksiTable({ transaksi }: TransaksiTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            {transaksi[0]?.user && <th className="pb-3 font-medium">Anggota</th>}
            <th className="pb-3 font-medium">Sampah</th>
            <th className="pb-3 font-medium">Berat</th>
            <th className="pb-3 font-medium">Total</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {transaksi.map((t) => (
            <tr key={t.id} className="border-b last:border-0">
              {t.user && <td className="py-3">{t.user.nama}</td>}
              <td className="py-3">{t.sampah?.nama ?? "-"}</td>
              <td className="py-3">{t.beratKg} kg</td>
              <td className="py-3">Rp {t.totalHarga.toLocaleString("id-ID")}</td>
              <td className="py-3">{t.status}</td>
              <td className="py-3">
                {new Date(t.createdAt).toLocaleDateString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
