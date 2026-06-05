import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const where = session.role === "ANGGOTA" ? { userId: session.userId } : {};
  const transaksi = await prisma.transaksi.findMany({
    where,
    include: { user: { select: { nama: true } }, sampah: { select: { nama: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(transaksi);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ANGGOTA") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const sampah = await prisma.sampah.findUnique({ where: { id: body.sampahId } });
  if (!sampah) {
    return NextResponse.json({ error: "Sampah tidak ditemukan" }, { status: 404 });
  }
  const totalHarga = body.beratKg * sampah.hargaPerKg;
  const transaksi = await prisma.transaksi.create({
    data: {
      userId: session.userId,
      sampahId: body.sampahId,
      beratKg: body.beratKg,
      totalHarga,
      foto: body.foto,
      catatan: body.catatan,
      status: "PENDING",
    },
  });
  await prisma.log.create({
    data: {
      userId: session.userId,
      aksi: "SETOR_SAMPAH",
      detail: `Menyetor ${body.beratKg} kg ${sampah.nama}`,
    },
  });
  return NextResponse.json(transaksi, { status: 201 });
}
