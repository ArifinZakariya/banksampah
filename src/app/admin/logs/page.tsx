import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { ScrollText } from "lucide-react";

export default async function AdminLogsPage() {
  const logs = await prisma.log.findMany({
    include: { user: { select: { nama: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Log Aktivitas</h1>
        <p className="text-muted-foreground mt-1">Riwayat aktivitas pengguna</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-muted-foreground" />
            Log Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">User</th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Aksi</th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Detail</th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{l.user.nama}</td>
                    <td className="px-6 py-4">
                      <Badge variant={l.aksi.includes("KONFIRMASI") ? "success" : "default"}>
                        {l.aksi}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{l.detail ?? "-"}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(l.createdAt).toLocaleString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
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
