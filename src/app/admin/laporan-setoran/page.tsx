import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Camera, FileText, Filter, Download } from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Suspense } from "react";
import { DateFilter, MemberFilter } from "@/components/filters";

interface SearchParams {
  start?: string;
  end?: string;
  userId?: string;
}

function buildWhereClause(params: SearchParams) {
  const where: Record<string, unknown> = { status: "DIKONFIRMASI" };

  const AND: Record<string, unknown>[] = [];
  if (params.start) AND.push({ createdAt: { gte: new Date(params.start) } });
  if (params.end) {
    const endDate = new Date(params.end);
    endDate.setHours(23, 59, 59, 999);
    AND.push({ createdAt: { lte: endDate } });
  }
  if (params.userId) AND.push({ userId: params.userId });
  if (AND.length > 0) where.AND = AND;

  return where;
}

export default async function LaporanSetoranPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const where = buildWhereClause(params);

  const [setoranList, members] = await Promise.all([
    prisma.transaksi.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { nama: true, email: true } },
        sampah: { select: { nama: true, hargaPerKg: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: "ANGGOTA" },
      select: { id: true, nama: true },
      orderBy: { nama: "asc" },
    }),
  ]);

  const totalBerat = setoranList.reduce((acc, s) => acc + s.beratKg, 0);
  const totalHarga = setoranList.reduce((acc, s) => acc + s.totalHarga, 0);
  const totalFoto = setoranList.filter((s) => s.foto).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Laporan Setoran</h1>
          <p className="text-muted-foreground mt-1">
            Semua data setoran anggota yang sudah disetujui
          </p>
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Setoran</p>
                <p className="text-2xl font-bold">{setoranList.length}</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Berat</p>
                <p className="text-2xl font-bold">{totalBerat} kg</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50">
                <Download className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Dengan Foto</p>
                <p className="text-2xl font-bold">{totalFoto}</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50">
                <Camera className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {setoranList.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Camera className="w-12 h-12 mb-3 text-muted-foreground/30" />
              <p className="text-lg font-medium">Belum ada data setoran</p>
              <p className="text-sm">Data setoran anggota akan muncul di sini</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {setoranList.map((setoran) => (
            <Card key={setoran.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
              <div className="relative aspect-video bg-muted">
                {setoran.foto ? (
                  <Image
                    src={setoran.foto}
                    alt={`Setoran ${setoran.sampah.nama} oleh ${setoran.user.nama}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <Camera className="w-10 h-10 text-muted-foreground/30" />
                    <span className="text-xs text-muted-foreground/50">Tidak ada foto</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm leading-tight">{setoran.user.nama}</p>
                    <p className="text-xs text-muted-foreground">{setoran.user.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(setoran.createdAt)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-muted/50 rounded-lg px-3 py-2">
                    <p className="text-xs text-muted-foreground">Jenis Sampah</p>
                    <p className="font-medium">{setoran.sampah.nama}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg px-3 py-2">
                    <p className="text-xs text-muted-foreground">Berat</p>
                    <p className="font-medium">{setoran.beratKg} kg</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg px-3 py-2">
                    <p className="text-xs text-muted-foreground">Harga/kg</p>
                    <p className="font-medium">
                      Rp {setoran.sampah.hargaPerKg.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="bg-primary-light/50 rounded-lg px-3 py-2">
                    <p className="text-xs text-primary font-medium">Total Harga</p>
                    <p className="font-bold text-primary">
                      Rp {setoran.totalHarga.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                {setoran.catatan && (
                  <div className="bg-muted/30 rounded-lg px-3 py-2 border-l-2 border-primary/30">
                    <p className="text-xs text-muted-foreground mb-0.5">Catatan</p>
                    <p className="text-sm italic text-muted-foreground">
                      &ldquo;{setoran.catatan}&rdquo;
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
