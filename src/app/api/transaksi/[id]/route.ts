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

  const transaksi = await prisma.transaksi.findUnique({ where: { id } });
  if (!transaksi) {
    return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
  }

  await prisma.transaksi.delete({ where: { id } });

  await recalculateSaldo(transaksi.userId);

  await prisma.log.create({
    data: {
      userId: session.userId,
      aksi: "HAPUS_TRANSAKSI",
      detail: `Transaksi ${id} dihapus`,
    },
  });

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

  try {
    const transaksi = await prisma.transaksi.update({
      where: { id },
      data: {
        status: body.status,
        catatan: body.catatan || null,
        verifiedBy: session.userId,
      },
    });

    const saldoBaru = await recalculateSaldo(transaksi.userId);

    await prisma.log.create({
      data: {
        userId: session.userId,
        aksi: "KONFIRMASI_TRANSAKSI",
        detail: `Transaksi ${id} status: ${body.status}`,
      },
    });

    return NextResponse.json({ ...transaksi, saldoBaru });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memproses transaksi" },
      { status: 500 }
    );
  }
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

  const updated = await prisma.tabungan.upsert({
    where: { userId },
    create: { userId, saldo: Math.max(0, saldo) },
    update: { saldo: Math.max(0, saldo) },
  });

  return updated.saldo;
}
