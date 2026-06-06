import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOTPParams {
  email: string;
  code: string;
  purpose: "register" | "reset-password";
}

export async function sendOTP({ email, code, purpose }: SendOTPParams) {
  const subject =
    purpose === "register"
      ? "Verifikasi Email - Bank Sampah"
      : "Reset Password - Bank Sampah";

  const heading =
    purpose === "register"
      ? "Verifikasi Akun Anda"
      : "Reset Password Anda";

  const description =
    purpose === "register"
      ? "Gunakan kode berikut untuk memverifikasi email Anda:"
      : "Gunakan kode berikut untuk mereset password Anda:";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
      <div style="max-width:400px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1);">
        <div style="background:linear-gradient(135deg,#059669 0%,#10b981 100%);padding:32px 24px;text-align:center;">
          <div style="width:56px;height:56px;margin:0 auto 16px;background:rgba(255,255,255,0.2);border-radius:16px;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:28px;">♻️</span>
          </div>
          <h1 style="color:#ffffff;font-size:20px;font-weight:700;margin:0;">Bank Sampah</h1>
        </div>
        <div style="padding:32px 24px;">
          <h2 style="color:#0f172a;font-size:18px;font-weight:600;margin:0 0 8px;">${heading}</h2>
          <p style="color:#64748b;font-size:14px;margin:0 0 24px;">${description}</p>
          <div style="background:#f0fdf4;border:2px dashed #059669;border-radius:12px;padding:20px;text-align:center;margin:0 0 24px;">
            <span style="font-size:32px;font-weight:700;color:#059669;letter-spacing:8px;font-family:monospace;">${code}</span>
          </div>
          <p style="color:#94a3b8;font-size:12px;margin:0;text-align:center;">Kode ini berlaku selama 10 menit</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: "Bank Sampah <onboarding@resend.dev>",
    to: email,
    subject,
    html,
  });
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
