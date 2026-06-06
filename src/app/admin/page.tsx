import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Recycle, Users, Weight, Wallet, Camera, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { DateFilter } from "@/components/filters";

interface SearchParams {
  start?: string;
  end?: string;
}

function buildDateFilter(start?: string, end?: string) {
  const AND: Record<string, unknown>[] = [];
  if (start) AND.push({ createdAt: { gte: new Date(start) } });
  if (end) {
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    AND.push({ createdAt: { lte: endDate } });
  }
  return AND.length > 0 ? { AND } : {};
}

async function getStats(filters: Record<string, unknown>) {
  const where = filters.AND ? filters : {};
  const [totalUsers, totalTransaksi, totalSampah, totalTabungan] =
    await Promise.all([
      prisma.user.count({ where: { role: "ANGGOTA" } }),
      prisma.transaksi.count({ where: filters.AND ? filters : undefined }),
      prisma.transaksi.aggregate({ _sum: { beratKg: true }, where: filters.AND ? filters : undefined }),
      prisma.tabungan.aggregate({ _sum: { saldo: true } }),
    ]);
  return {
    totalUsers,
    totalTransaksi,
    totalBeratSampah: totalSampah._sum.beratKg || 0,
    totalSaldo: totalTabungan._sum.saldo || 0,
  };
}

async function getLatestSetoran(filters: Record<string, unknown>) {
  return prisma.transaksi.findMany({
    where: { status: "DIKONFIRMASI", ...(filters.AND ? filters : {}) },
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { nama: true } },
      sampah: { select: { nama: true } },
    },
  });
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const dateFilter = buildDateFilter(params.start, params.end);
  const [stats, latestSetoran] = await Promise.all([getStats(dateFilter), getLatestSetoran(dateFilter)]);

  const cards = [
    {
      title: "Total Anggota",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600 bg-blue-50",
      gradient: "gradient-card-blue",
    },
    {
      title: "Total Transaksi",
      value: stats.totalTransaksi,
      icon: Recycle,
      color: "text-emerald-600 bg-emerald-50",
      gradient: "gradient-card-emerald",
    },
    {
      title: "Total Sampah",
      value: `${stats.totalBeratSampah} kg`,
      icon: Weight,
      color: "text-amber-600 bg-amber-50",
      gradient: "gradient-card-amber",
    },
    {
      title: "Total Saldo",
      value: `Rp ${stats.totalSaldo.toLocaleString("id-ID")}`,
      icon: Wallet,
      color: "text-violet-600 bg-violet-50",
      gradient: "gradient-card-violet",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Selamat datang di panel admin Bank Sampah</p>
        </div>
        <Suspense>
          <DateFilter />
        </Suspense>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className={`${card.gradient} hover:shadow-md transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                    <p className="text-2xl lg:text-3xl font-bold tracking-tight">{card.value}</p>
                  </div>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Camera className="w-5 h-5 text-muted-foreground" />
            Setoran Terakhir
          </CardTitle>
          <Link
            href="/admin/laporan-setoran"
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover font-medium transition-colors"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {latestSetoran.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Belum ada setoran</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestSetoran.map((t) => (
                <div
                  key={t.id}
                  className="border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="relative aspect-video bg-muted">
                    {t.foto ? (
                      <Image
                        src={t.foto}
                        alt={`Setoran ${t.sampah.nama}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Camera className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{t.user.nama}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(t.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t.sampah.nama}</span>
                      <span className="font-medium">{t.beratKg} kg</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-semibold text-primary">
                        Rp {t.totalHarga.toLocaleString("id-ID")}
                      </span>
                    </div>
                    {t.catatan && (
                      <p className="text-xs text-muted-foreground italic border-t border-border pt-2 mt-2">
                        &ldquo;{t.catatan}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
