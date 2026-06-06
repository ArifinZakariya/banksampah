import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOTP, generateOTP } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, purpose } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email harus diisi" },
        { status: 400 }
      );
    }

    if (!purpose || !["register", "reset-password"].includes(purpose)) {
      return NextResponse.json(
        { error: "Purpose tidak valid" },
        { status: 400 }
      );
    }

    if (purpose === "register") {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json(
          { error: "Email sudah terdaftar" },
          { status: 400 }
        );
      }
    }

    if (purpose === "reset-password") {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json(
          { error: "Email tidak ditemukan" },
          { status: 404 }
        );
      }
    }

    await prisma.verification.deleteMany({
      where: {
        email,
        purpose,
        used: false,
      },
    });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verification.create({
      data: {
        email,
        code,
        purpose,
        expiresAt,
      },
    });

    await sendOTP({ email, code, purpose: purpose as "register" | "reset-password" });

    return NextResponse.json({
      message: "Kode verifikasi telah dikirim ke email Anda",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
