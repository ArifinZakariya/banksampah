import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface SendOTPParams {
  email: string;
  code: string;
  purpose: "register" | "reset-password";
}

export async function sendOTP({ email, code, purpose }: SendOTPParams) {
  const subject =
    purpose === "register"
      ? "Verifikasi Email - Jagad Resik"
      : "Reset Password - Jagad Resik";

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
          <h1 style="color:#ffffff;font-size:20px;font-weight:700;margin:0;">Jagad Resik</h1>
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

  await transporter.sendMail({
    from: `"Jagad Resik" <${process.env.GMAIL_USER}>`,
    to: email,
    subject,
    html,
  });
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

interface SendInvoiceEmailParams {
  email: string;
  nama: string;
  noInvoice: string;
  jumlah: number;
  tanggalPencairan: string;
  pdfBuffer: Buffer;
}

export async function sendInvoiceEmail({
  email,
  nama,
  noInvoice,
  jumlah,
  tanggalPencairan,
  pdfBuffer,
}: SendInvoiceEmailParams) {
  const safeFilename = noInvoice.replace(/\//g, "-");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
      <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1);">
        <div style="background:linear-gradient(135deg,#059669 0%,#10b981 100%);padding:32px 24px;text-align:center;">
          <div style="width:56px;height:56px;margin:0 auto 16px;background:rgba(255,255,255,0.2);border-radius:16px;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:28px;">✅</span>
          </div>
          <h1 style="color:#ffffff;font-size:20px;font-weight:700;margin:0;">Pencairan Disetujui</h1>
        </div>
        <div style="padding:32px 24px;">
          <p style="color:#64748b;font-size:14px;margin:0 0 16px;">Halo <strong>${nama}</strong>,</p>
          <p style="color:#64748b;font-size:14px;margin:0 0 24px;">Permintaan pencairan Anda telah disetujui. Berikut detailnya:</p>
          <div style="background:#f0fdf4;border-radius:12px;padding:20px;margin:0 0 24px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="color:#64748b;font-size:13px;padding:4px 0;">No. Invoice</td>
                <td style="color:#0f172a;font-size:13px;font-weight:600;padding:4px 0;text-align:right;">${noInvoice}</td>
              </tr>
              <tr>
                <td style="color:#64748b;font-size:13px;padding:4px 0;">Tanggal</td>
                <td style="color:#0f172a;font-size:13px;padding:4px 0;text-align:right;">${tanggalPencairan}</td>
              </tr>
              <tr>
                <td style="color:#64748b;font-size:13px;padding:4px 0;border-top:1px solid #e2e8f0;padding-top:8px;">Jumlah</td>
                <td style="color:#059669;font-size:16px;font-weight:700;padding:4px 0;border-top:1px solid #e2e8f0;padding-top:8px;text-align:right;">Rp ${jumlah.toLocaleString("id-ID")}</td>
              </tr>
            </table>
          </div>
          <p style="color:#64748b;font-size:14px;margin:0 0 8px;">Invoice PDF terlampir dalam email ini. Silakan simpan sebagai bukti transaksi.</p>
          <p style="color:#94a3b8;font-size:12px;margin:0;text-align:center;">Jika ada pertanyaan, silakan hubungi admin Jagad Resik.</p>
        </div>
        <div style="background:#f1f5f9;padding:16px 24px;text-align:center;">
          <p style="color:#94a3b8;font-size:11px;margin:0;">Jagad Resik Digital &copy; ${new Date().getFullYear()}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Jagad Resik" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Invoice Pencairan ${noInvoice} - Jagad Resik`,
    html,
    attachments: [
      {
        filename: `Invoice-${safeFilename}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}
