import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const data: any = {};
  if (body.nama) data.nama = body.nama;
  if (body.alamat !== undefined) data.alamat = body.alamat;
  if (body.noTelpon !== undefined) data.noTelpon = body.noTelpon;
  if (body.password) data.password = await bcrypt.hash(body.password, 12);

  const user = await prisma.user.update({
    where: { id: session.userId },
    data,
    select: { id: true, nama: true, email: true, role: true },
  });

  return NextResponse.json(user);
}
