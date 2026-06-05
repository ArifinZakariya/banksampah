import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Wallet, Recycle, Weight, Camera, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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

async function getAnggotaData(userId: string, dateFilter: Record<string, unknown>) {
  const dateWhere = dateFilter.AND ? dateFilter : {};
  const [tabungan, transaksiCount, totalBerat, allApprovedSetoran] = await Promise.all([
    prisma.tabungan.findUnique({ where: { userId } }),
    prisma.transaksi.count({ where: { userId, ...(dateFilter.AND ? dateFilter : {}) } }),
    prisma.transaksi.aggregate({ _sum: { beratKg: true }, where: { userId, ...(dateFilter.AND ? dateFilter : {}) } }),
    prisma.transaksi.findMany({
      where: { status: "DIKONFIRMASI", ...(dateFilter.AND ? dateFilter : {}) },
      include: {
        user: { select: { nama: true } },
        sampah: { select: { nama: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
  ]);
  return {
    tabungan,
    transaksiCount,
    totalBeratSampah: totalBerat._sum.beratKg || 0,
    allApprovedSetoran,
  };
}

export default async function AnggotaDashboard({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const params = await searchParams;
  const dateFilter = buildDateFilter(params.start, params.end);
  const data = await getAnggotaData(session.userId, dateFilter);

  const cards = [
    {
      title: "Saldo Tabungan",
      value: `Rp ${(data.tabungan?.saldo ?? 0).toLocaleString("id-ID")}`,
      icon: Wallet,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Total Setoran",
      value: `${data.transaksiCount}x`,
      icon: Recycle,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Total Berat",
      value: `${data.totalBeratSampah} kg`,
      icon: Weight,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Selamat datang di Bank Sampah</p>
        </div>
        <Suspense>
          <DateFilter />
        </Suspense>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:shadow-md transition-shadow">
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
            Setoran Anggota
          </CardTitle>
          <Link
            href="/anggota/histori"
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover font-medium transition-colors"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {data.allApprovedSetoran.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Belum ada setoran</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.allApprovedSetoran.map((t) => (
                <div
                  key={t.id}
                  className="border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white"
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
