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

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== "ANGGOTA") {
    return NextResponse.json({ error: "Anggota tidak ditemukan" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.log.deleteMany({ where: { userId: id } }),
    prisma.pencairan.deleteMany({ where: { userId: id } }),
    prisma.transaksi.deleteMany({ where: { userId: id } }),
    prisma.tabungan.deleteMany({ where: { userId: id } }),
    prisma.user.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true });
}
