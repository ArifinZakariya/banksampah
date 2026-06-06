import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, code, purpose } = await request.json();

    if (!email || !code || !purpose) {
      return NextResponse.json(
        { error: "Email, kode, dan purpose harus diisi" },
        { status: 400 }
      );
    }

    const verification = await prisma.verification.findFirst({
      where: {
        email,
        code,
        purpose,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Kode verifikasi tidak valid atau sudah kedaluwarsa" },
        { status: 400 }
      );
    }

    await prisma.verification.update({
      where: { id: verification.id },
      data: { used: true },
    });

    return NextResponse.json({
      message: "Verifikasi berhasil",
      email,
      purpose,
    });
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
