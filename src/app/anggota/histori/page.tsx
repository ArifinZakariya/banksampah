import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ScrollText } from "lucide-react";

export default async function HistoriPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const transaksi = await prisma.transaksi.findMany({
    where: { userId: session.userId },
    include: { sampah: { select: { nama: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Histori Transaksi</h1>
        <p className="text-muted-foreground mt-1">Riwayat setoran sampah Anda</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-muted-foreground" />
            Riwayat Setoran
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Sampah</th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Berat</th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Total</th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {transaksi.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{t.sampah.nama}</td>
                    <td className="px-6 py-4">{t.beratKg} kg</td>
                    <td className="px-6 py-4 font-medium">Rp {t.totalHarga.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={t.status === "DIKONFIRMASI" ? "success" : t.status === "DITOLAK" ? "destructive" : "warning"}
                      >
                        {t.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(t.createdAt).toLocaleDateString("id-ID", {
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
        </CardContent>
      </Card>
    </div>
  );
}
