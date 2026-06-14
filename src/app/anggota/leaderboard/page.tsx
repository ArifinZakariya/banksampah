import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Recycle } from "lucide-react";

export const dynamic = "force-dynamic";

const RANK_STYLES = [
  { badge: "bg-amber-100 text-amber-700", bar: "bg-amber-500", ring: "ring-amber-200" },
  { badge: "bg-slate-100 text-slate-600", bar: "bg-slate-400", ring: "ring-slate-200" },
  { badge: "bg-orange-100 text-orange-700", bar: "bg-orange-500", ring: "ring-orange-200" },
];

export default async function AnggotaLeaderboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Rank members by total value of confirmed setoran
  const ranking = await prisma.transaksi.groupBy({
    by: ["userId"],
    where: { status: "DIKONFIRMASI" },
    _sum: { totalHarga: true, beratKg: true },
    _count: { _all: true },
    orderBy: { _sum: { totalHarga: "desc" } },
    take: 10,
  });

  const users =
    ranking.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: ranking.map((r) => r.userId) } },
          select: { id: true, nama: true },
        })
      : [];

  const rows = ranking.map((r) => ({
    userId: r.userId,
    nama: users.find((u) => u.id === r.userId)?.nama ?? "Anggota",
    total: r._sum.totalHarga ?? 0,
    berat: r._sum.beratKg ?? 0,
    count: r._count._all,
    isMe: r.userId === session.userId,
  }));

  const maxTotal = rows[0]?.total ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Peringkat Anggota</h1>
        <p className="text-muted-foreground mt-1">
          Anggota dengan total setoran terbanyak
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Papan Peringkat Setoran
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Belum ada setoran</p>
          ) : (
            <div className="space-y-3">
              {rows.map((row, i) => {
                const rankStyle = RANK_STYLES[i];
                const pct = maxTotal > 0 ? (row.total / maxTotal) * 100 : 0;
                return (
                  <div
                    key={row.userId}
                    className={`rounded-xl border border-border p-4 transition-shadow hover:shadow-sm ${
                      row.isMe ? "bg-emerald-50/60 ring-1 ring-emerald-200" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-9 h-9 shrink-0 rounded-full font-bold text-sm ${
                          rankStyle ? rankStyle.badge : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {i < 3 ? <Medal className="w-5 h-5" /> : i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold truncate">
                            {row.nama}
                            {row.isMe && (
                              <span className="ml-2 text-xs font-medium text-emerald-600">
                                (Anda)
                              </span>
                            )}
                          </p>
                          <p className="font-bold text-primary shrink-0">
                            Rp {row.total.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1">
                            <Recycle className="w-3 h-3" />
                            {row.count}x setoran
                          </span>
                          <span>{row.berat} kg</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-3">
                      <div
                        className={`h-full rounded-full transition-all ${
                          rankStyle ? rankStyle.bar : "bg-emerald-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
