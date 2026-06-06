import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(request: Request) {
  try {
    const { email, code, purpose } = await request.json();

    if (!email || !code || !purpose) {
      return NextResponse.json(
        { error: "Email, kode, dan purpose harus diisi" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id FROM verifications 
         WHERE email = $1 AND code = $2 AND purpose = $3 AND used = false AND expires_at > NOW()
         ORDER BY created_at DESC LIMIT 1`,
        [email, code, purpose]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Kode verifikasi tidak valid atau sudah kedaluwarsa" },
          { status: 400 }
        );
      }

      await client.query(
        "UPDATE verifications SET used = true WHERE id = $1",
        [result.rows[0].id]
      );
    } finally {
      client.release();
    }

    return NextResponse.json({
      message: "Verifikasi berhasil",
      email,
      purpose,
    });
  } catch (error: any) {
    console.error("Verify code error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
