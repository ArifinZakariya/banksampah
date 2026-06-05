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
  await prisma.pencairan.delete({ where: { id } });
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

  if (body.status === "DISETUJUI") {
    const tabungan = await prisma.tabungan.findUnique({
      where: { userId: pencairan.userId },
    });
    if (tabungan) {
      await prisma.tabungan.update({
        where: { userId: pencairan.userId },
        data: { saldo: Math.max(0, tabungan.saldo - pencairan.jumlah) },
      });
    }
  }

  await prisma.log.create({
    data: {
      userId: session.userId,
      aksi: "KONFIRMASI_PENCAIRAN",
      detail: `Pencairan ${id} status: ${body.status}`,
    },
  });

  return NextResponse.json(pencairan);
}
