import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const users = await prisma.user.findMany({
    where: { role: "ANGGOTA" },
    select: {
      id: true,
      nama: true,
      email: true,
      createdAt: true,
      tabungan: { select: { saldo: true } },
      _count: { select: { transaksi: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}
