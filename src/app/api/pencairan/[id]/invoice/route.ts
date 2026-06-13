import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateInvoicePDF, safeInvoiceFilename } from "@/lib/invoice-pdf";
import { formatDate } from "@/lib/utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const pencairan = await prisma.pencairan.findUnique({
    where: { id },
    include: { user: { select: { nama: true, email: true } } },
  });

  if (!pencairan) {
    return NextResponse.json({ error: "Pencairan tidak ditemukan" }, { status: 404 });
  }

  if (session.role === "ANGGOTA" && pencairan.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (pencairan.status !== "DISETUJUI" || !pencairan.noInvoice) {
    return NextResponse.json(
      { error: "Invoice hanya tersedia untuk pencairan yang sudah disetujui" },
      { status: 400 }
    );
  }

  try {
    const tanggalFormatted = pencairan.tanggalPencairan
      ? formatDate(pencairan.tanggalPencairan)
      : formatDate(pencairan.createdAt);

    const pdfBuffer = await generateInvoicePDF({
      noInvoice: pencairan.noInvoice,
      namaAnggota: pencairan.user?.nama || "N/A",
      emailAnggota: pencairan.user?.email || "N/A",
      jumlah: pencairan.jumlah,
      tanggalPencairan: tanggalFormatted,
      catatan: pencairan.catatan,
    });

    const filename = safeInvoiceFilename(pencairan.noInvoice);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Invoice-${filename}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Gagal generate invoice PDF:", error);
    return NextResponse.json(
      { error: "Gagal generate invoice" },
      { status: 500 }
    );
  }
}
