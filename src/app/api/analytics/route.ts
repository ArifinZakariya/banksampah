import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const totalUsers = await prisma.user.count({ where: { role: "ANGGOTA" } });
  const totalTransaksi = await prisma.transaksi.count();
  const totalSampah = await prisma.transaksi.aggregate({ _sum: { beratKg: true } });
  const totalSaldo = await prisma.tabungan.aggregate({ _sum: { saldo: true } });
  return NextResponse.json({
    totalUsers,
    totalTransaksi,
    totalBeratSampah: totalSampah._sum.beratKg || 0,
    totalSaldo: totalSaldo._sum.saldo || 0,
  });
}
