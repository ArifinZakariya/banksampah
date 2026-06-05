import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Wallet,
  Recycle,
  Weight,
  Camera,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

export default async function AnggotaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const anggota = await prisma.user.findUnique({
    where: { id },
    include: {
      tabungan: true,
      transaksi: {
        include: { sampah: { select: { nama: true, hargaPerKg: true } } },
        orderBy: { createdAt: "desc" },
      },
      pencairan: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!anggota || anggota.role !== "ANGGOTA") notFound();

  const totalBerat = anggota.transaksi.reduce((acc, t) => acc + t.beratKg, 0);
  const totalTransaksi = anggota.transaksi.length;
  const totalSetoranDikonfirmasi = anggota.transaksi.filter(
    (t) => t.status === "DIKONFIRMASI"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/anggota"
          className="flex items-center justify-center w-10 h-10 rounded-xl border border-border hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Detail Anggota</h1>
          <p className="text-muted-foreground mt-1">Informasi lengkap tentang anggota</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-light text-primary text-3xl font-bold shrink-0">
              {anggota.nama.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-xl font-bold">{anggota.nama}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{anggota.email}</span>
                </div>
                {anggota.noTelpon && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{anggota.noTelpon}</span>
                  </div>
                )}
                {anggota.alamat && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{anggota.alamat}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Bergabung {formatDate(anggota.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Saldo Tabungan</p>
                <p className="text-2xl font-bold text-emerald-600">
                  Rp {(anggota.tabungan?.saldo ?? 0).toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50">
                <Wallet className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Setoran</p>
                <p className="text-2xl font-bold">{totalTransaksi}x</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
                <Recycle className="w-5 h-5 text-blue-600" />
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
                <Weight className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Recycle className="w-5 h-5 text-muted-foreground" />
            Riwayat Setoran
            <Badge variant="secondary" className="ml-2">{totalSetoranDikonfirmasi} disetujui</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {anggota.transaksi.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Belum ada setoran</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {anggota.transaksi.map((t) => (
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
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant={
                          t.status === "DIKONFIRMASI"
                            ? "success"
                            : t.status === "DITOLAK"
                            ? "destructive"
                            : "warning"
                        }
                      >
                        {t.status === "DIKONFIRMASI"
                          ? "Dikonfirmasi"
                          : t.status === "DITOLAK"
                          ? "Ditolak"
                          : "Menunggu"}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{t.sampah.nama}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(t.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Berat</span>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="w-5 h-5 text-muted-foreground" />
            Riwayat Pencairan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {anggota.pencairan.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Belum ada pencairan</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Jumlah</th>
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Tanggal</th>
                    <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {anggota.pencairan.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium">
                        Rp {p.jumlah.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            p.status === "DISETUJUI"
                              ? "success"
                              : p.status === "DITOLAK"
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {p.status === "DISETUJUI"
                            ? "Disetujui"
                            : p.status === "DITOLAK"
                            ? "Ditolak"
                            : "Menunggu"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">
                        {p.catatan || "-"}
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
