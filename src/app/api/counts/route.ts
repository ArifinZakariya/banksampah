import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role === "ADMIN") {
    const [pendingTransaksi, pendingPencairan, totalTransaksi, totalPencairan] = await Promise.all([
      prisma.transaksi.count({ where: { status: "PENDING" } }),
      prisma.pencairan.count({ where: { status: "MENUNGGU" } }),
      prisma.transaksi.count(),
      prisma.pencairan.count(),
    ]);

    return NextResponse.json({
      pendingTransaksi,
      pendingPencairan,
      totalTransaksi,
      totalPencairan,
      confirmedTransaksi: 0,
      approvedPencairan: 0,
    });
  }

  const [confirmedTransaksi, approvedPencairan] = await Promise.all([
    prisma.transaksi.count({
      where: { userId: session.userId, status: "DIKONFIRMASI" },
    }),
    prisma.pencairan.count({
      where: { userId: session.userId, status: "DISETUJUI" },
    }),
  ]);

  return NextResponse.json({
    pendingTransaksi: 0,
    pendingPencairan: 0,
    totalTransaksi: 0,
    totalPencairan: 0,
    confirmedTransaksi,
    approvedPencairan,
  });
}
