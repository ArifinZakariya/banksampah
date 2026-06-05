import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { Users, Eye } from "lucide-react";
import Link from "next/link";

export default async function AdminAnggotaPage() {
  const anggota = await prisma.user.findMany({
    where: { role: "ANGGOTA" },
    select: {
      id: true,
      nama: true,
      email: true,
      createdAt: true,
      tabungan: { select: { saldo: true } },
      _count: { select: { transaksi: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Anggota</h1>
        <p className="text-muted-foreground mt-1">Daftar semua anggota Bank Sampah</p>
      </div>
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
                      <Link
                        href={`/admin/anggota/${a.id}`}
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover font-medium transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
