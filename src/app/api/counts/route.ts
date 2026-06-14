import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role === "ADMIN") {
    const [pendingTransaksi, pendingPencairan] = await Promise.all([
      prisma.transaksi.count({ where: { status: "PENDING" } }),
      prisma.pencairan.count({ where: { status: "MENUNGGU" } }),
    ]);

    return NextResponse.json({
      pendingTransaksi,
      pendingPencairan,
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
    confirmedTransaksi,
    approvedPencairan,
  });
}
