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
  await prisma.transaksi.delete({ where: { id } });
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
  const transaksi = await prisma.transaksi.update({
    where: { id },
    data: {
      status: body.status,
      catatan: body.catatan,
      verifiedBy: session.userId,
    },
  });

  if (body.status === "DIKONFIRMASI") {
    const tabungan = await prisma.tabungan.findUnique({
      where: { userId: transaksi.userId },
    });
    if (tabungan) {
      await prisma.tabungan.update({
        where: { userId: transaksi.userId },
        data: { saldo: tabungan.saldo + transaksi.totalHarga },
      });
    }
  }

  await prisma.log.create({
    data: {
      userId: session.userId,
      aksi: "KONFIRMASI_TRANSAKSI",
      detail: `Transaksi ${id} status: ${body.status}`,
    },
  });

  return NextResponse.json(transaksi);
}
