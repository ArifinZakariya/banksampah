import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Wallet } from "lucide-react";
import { PencairanFormWrapper } from "./pencairan-form-wrapper";

export const dynamic = "force-dynamic";

export default async function PencairanPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const tabungan = await prisma.tabungan.findUnique({ where: { userId: session.userId } });
  const pencairan = await prisma.pencairan.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Pencairan Saldo</h1>
        <p className="text-muted-foreground mt-1">Ajukan pencairan saldo tabungan Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-emerald-700">Saldo Tersedia</p>
                <p className="text-3xl font-bold text-emerald-800">
                  Rp {(tabungan?.saldo ?? 0).toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-emerald-600/70 mt-1">
                  Pencairan maksimal setiap 3 bulan sekali
                </p>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-200/50">
                <Wallet className="w-7 h-7 text-emerald-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <PencairanFormWrapper saldo={tabungan?.saldo ?? 0} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pencairan</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {pencairan.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Belum ada pengajuan pencairan
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Jumlah</th>
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {pencairan.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium">Rp {p.jumlah.toLocaleString("id-ID")}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={p.status === "DISETUJUI" ? "success" : p.status === "DITOLAK" ? "destructive" : "warning"}
                        >
                          {p.status === "MENUNGGU" ? "Menunggu" : p.status === "DISETUJUI" ? "Disetujui" : "Ditolak"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
