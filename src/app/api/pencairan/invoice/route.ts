import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const noInvoice = searchParams.get("no");

  if (!noInvoice) {
    return NextResponse.json({ error: "Nomor invoice harus diisi" }, { status: 400 });
  }

  const pencairan = await prisma.pencairan.findUnique({
    where: { noInvoice },
    include: { user: { select: { nama: true, email: true } } },
  });

  if (!pencairan) {
    return NextResponse.json({ error: "Invoice tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(pencairan);
}
