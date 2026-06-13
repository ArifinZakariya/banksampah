import { NextResponse } from "next/server";
import { generateInvoicePDF, generateInvoiceNumber } from "@/lib/invoice-pdf";

export async function GET() {
  try {
    const no = generateInvoiceNumber();
    console.log("[test-pdf] Generating PDF...", no);
    
    const buffer = await generateInvoicePDF({
      noInvoice: no,
      namaAnggota: "Test User",
      emailAnggota: "test@test.com",
      jumlah: 50000,
      tanggalPencairan: "13 Juni 2026",
    });

    console.log("[test-pdf] PDF generated, size:", buffer.length);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="test.pdf"',
      },
    });
  } catch (error: any) {
    console.error("[test-pdf] ERROR:", error.message, error.stack);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
