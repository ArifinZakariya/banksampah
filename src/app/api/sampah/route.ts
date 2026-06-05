import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sampah = await prisma.sampah.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(sampah);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const sampah = await prisma.sampah.create({ data: body });
  return NextResponse.json(sampah, { status: 201 });
}
