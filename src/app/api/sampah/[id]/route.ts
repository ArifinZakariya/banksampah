import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await request.json();
  const sampah = await prisma.sampah.update({
    where: { id },
    data: {
      nama: body.nama,
      hargaPerKg: body.hargaPerKg,
      satuan: body.satuan,
      deskripsi: body.deskripsi,
    },
  });
  return NextResponse.json(sampah);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.sampah.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
