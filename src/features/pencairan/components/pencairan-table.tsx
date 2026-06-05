"use client";

import type { Pencairan } from "@/types";

interface PencairanTableProps {
  pencairan: Pencairan[];
}

export function PencairanTable({ pencairan }: PencairanTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            {pencairan[0]?.user && <th className="pb-3 font-medium">Anggota</th>}
            <th className="pb-3 font-medium">Jumlah</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {pencairan.map((p) => (
            <tr key={p.id} className="border-b last:border-0">
              {p.user && <td className="py-3">{p.user.nama}</td>}
              <td className="py-3">Rp {p.jumlah.toLocaleString("id-ID")}</td>
              <td className="py-3">{p.status}</td>
              <td className="py-3">
                {new Date(p.createdAt).toLocaleDateString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
