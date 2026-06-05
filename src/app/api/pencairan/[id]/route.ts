import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;

  const pencairan = await prisma.pencairan.findUnique({ where: { id } });
  if (!pencairan) {
    return NextResponse.json({ error: "Pencairan tidak ditemukan" }, { status: 404 });
  }

  await prisma.pencairan.delete({ where: { id } });

  await recalculateSaldo(pencairan.userId);

  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await request.json();
  const pencairan = await prisma.pencairan.update({
    where: { id },
    data: {
      status: body.status,
      catatan: body.catatan,
      tanggalPencairan: body.status === "DISETUJUI" ? new Date() : null,
    },
  });

  await recalculateSaldo(pencairan.userId);

  await prisma.log.create({
    data: {
      userId: session.userId,
      aksi: "KONFIRMASI_PENCAIRAN",
      detail: `Pencairan ${id} status: ${body.status}`,
    },
  });

  return NextResponse.json(pencairan);
}

async function recalculateSaldo(userId: string) {
  const totalSetoran = await prisma.transaksi.aggregate({
    where: { userId, status: "DIKONFIRMASI" },
    _sum: { totalHarga: true },
  });

  const totalPencairan = await prisma.pencairan.aggregate({
    where: { userId, status: "DISETUJUI" },
    _sum: { jumlah: true },
  });

  const saldo = (totalSetoran._sum.totalHarga || 0) - (totalPencairan._sum.jumlah || 0);

  await prisma.tabungan.update({
    where: { userId },
    data: { saldo: Math.max(0, saldo) },
  });
}
