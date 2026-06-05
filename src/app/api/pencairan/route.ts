import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const where = session.role === "ANGGOTA" ? { userId: session.userId } : {};
  const pencairan = await prisma.pencairan.findMany({
    where,
    include: { user: { select: { nama: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(pencairan);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ANGGOTA") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const tabungan = await prisma.tabungan.findUnique({ where: { userId: session.userId } });
  if (!tabungan || tabungan.saldo < body.jumlah) {
    return NextResponse.json({ error: "Saldo tidak mencukupi" }, { status: 400 });
  }
  const lastPencairan = await prisma.pencairan.findFirst({
    where: { userId: session.userId, status: "DISETUJUI" },
    orderBy: { createdAt: "desc" },
  });
  if (lastPencairan) {
    const monthsDiff =
      (new Date().getTime() - lastPencairan.createdAt.getTime()) /
      (1000 * 60 * 60 * 24 * 30);
    if (monthsDiff < 3) {
      return NextResponse.json(
        { error: "Pencairan hanya bisa dilakukan setiap 3 bulan" },
        { status: 400 }
      );
    }
  }
  const pencairan = await prisma.pencairan.create({
    data: { userId: session.userId, jumlah: body.jumlah },
  });
  return NextResponse.json(pencairan, { status: 201 });
}
