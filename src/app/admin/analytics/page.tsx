import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trash2, ArrowLeftRight, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Suspense } from "react";
import { DateFilter, MemberFilter } from "@/components/filters";

export const dynamic = "force-dynamic";

interface SearchParams {
  start?: string;
  end?: string;
  userId?: string;
}

function buildWhereClause(params: SearchParams) {
  const AND: Record<string, unknown>[] = [];
  if (params.start) AND.push({ createdAt: { gte: new Date(params.start) } });
  if (params.end) {
    const endDate = new Date(params.end);
    endDate.setHours(23, 59, 59, 999);
    AND.push({ createdAt: { lte: endDate } });
  }
  if (params.userId) AND.push({ userId: params.userId });
  return AND.length > 0 ? { AND } : {};
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const where = buildWhereClause(params);

  const [totalAnggota, totalSampah, totalTransaksi, totalPencairan, totalSaldo, transaksiBulanIni, sampahTerbanyak, members] =
    await Promise.all([
      prisma.user.count({ where: { role: "ANGGOTA" } }),
      prisma.sampah.count(),
      prisma.transaksi.count({ where: where.AND ? where : undefined }),
      prisma.pencairan.count({ where: where.AND ? where : undefined }),
      prisma.tabungan.aggregate({ _sum: { saldo: true } }),
      prisma.transaksi.count({
        where: {
          createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
          ...(params.userId ? { userId: params.userId } : {}),
        },
      }),
      prisma.transaksi.groupBy({
        by: ["sampahId"],
        _sum: { beratKg: true },
        orderBy: { _sum: { beratKg: "desc" } },
        take: 5,
        where: where.AND ? where : undefined,
      }),
      prisma.user.findMany({
        where: { role: "ANGGOTA" },
        select: { id: true, nama: true },
        orderBy: { nama: "asc" },
      }),
    ]);

  const sampahNama = sampahTerbanyak.length > 0
    ? await prisma.sampah.findMany({
        where: { id: { in: sampahTerbanyak.map((s) => s.sampahId) } },
      })
    : [];

  const totalPemasukan = await prisma.transaksi.aggregate({
    _sum: { totalHarga: true },
    where: { status: "DIKONFIRMASI", ...(where.AND ? where : {}) },
  });

  const totalPengeluaran = await prisma.pencairan.aggregate({
    _sum: { jumlah: true },
    where: { status: "DISETUJUI", ...(where.AND ? where : {}) },
  });

  const stats = [
    { label: "Total Anggota", value: totalAnggota, icon: Users, color: "text-blue-600 bg-blue-100" },
    { label: "Jenis Sampah", value: totalSampah, icon: Trash2, color: "text-emerald-600 bg-emerald-100" },
    { label: "Total Transaksi", value: totalTransaksi, icon: ArrowLeftRight, color: "text-purple-600 bg-purple-100" },
    { label: "Total Pencairan", value: totalPencairan, icon: Wallet, color: "text-orange-600 bg-orange-100" },
    { label: "Total Saldo Anggota", value: `Rp ${(totalSaldo._sum.saldo ?? 0).toLocaleString("id-ID")}`, icon: Wallet, color: "text-teal-600 bg-teal-100" },
    { label: "Transaksi Bulan Ini", value: transaksiBulanIni, icon: TrendingUp, color: "text-indigo-600 bg-indigo-100" },
    { label: "Total Pemasukan", value: `Rp ${(totalPemasukan._sum.totalHarga ?? 0).toLocaleString("id-ID")}`, icon: TrendingUp, color: "text-green-600 bg-green-100" },
    { label: "Total Pengeluaran", value: `Rp ${(totalPengeluaran._sum.jumlah ?? 0).toLocaleString("id-ID")}`, icon: TrendingDown, color: "text-red-600 bg-red-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Ringkasan data dan statistik Bank Sampah</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Suspense>
            <DateFilter />
          </Suspense>
          <Suspense>
            <MemberFilter members={members} />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold">{s.value}</p>
                  </div>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${s.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sampahTerbanyak.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-muted-foreground" />
              Sampah Paling Banyak Disetor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sampahTerbanyak.map((s, i) => {
                const nama = sampahNama.find((n) => n.id === s.sampahId)?.nama ?? "Unknown";
                const maxKg = sampahTerbanyak[0]._sum.beratKg ?? 0;
                const kg = s._sum.beratKg ?? 0;
                const pct = maxKg > 0 ? (kg / maxKg) * 100 : 0;
                return (
                  <div key={s.sampahId}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{nama}</span>
                      <span className="text-muted-foreground">{kg} kg</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
