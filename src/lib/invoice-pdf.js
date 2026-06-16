const PDFDocument = require("pdfkit");

function generateInvoicePDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        bufferPages: true,
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const pageWidth = doc.page.width;
      const contentWidth = pageWidth - 100;

      const headerY = 50;
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#666666")
        .text("BANK SAMPAH DIGITAL", 50, headerY + 15, { align: "center", width: contentWidth });

      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .fillColor("#059669")
        .text("INVOICE PENCAIRAN", 50, headerY + 30, { align: "center", width: contentWidth });

      const lineY = headerY + 60;
      doc
        .moveTo(50, lineY)
        .lineTo(pageWidth - 50, lineY)
        .lineWidth(2)
        .strokeColor("#059669")
        .stroke();

      let infoY = lineY + 20;

      doc.fontSize(10).font("Helvetica-Bold").fillColor("#333333").text("No. Invoice", 50, infoY);
      doc.font("Helvetica").text(`: ${data.noInvoice}`, 160, infoY);

      infoY += 22;
      doc.font("Helvetica-Bold").text("Tanggal", 50, infoY);
      doc.font("Helvetica").text(`: ${data.tanggalPencairan}`, 160, infoY);

      infoY += 22;
      doc.font("Helvetica-Bold").text("Status", 50, infoY);
      doc.font("Helvetica").fillColor("#059669").text(": DISETUJUI", 160, infoY);

      infoY += 30;
      doc.moveTo(50, infoY).lineTo(pageWidth - 50, infoY).lineWidth(0.5).strokeColor("#cccccc").stroke();

      infoY += 15;
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#059669").text("DATA ANGGOTA", 50, infoY);

      infoY += 22;
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#333333").text("Nama", 50, infoY);
      doc.font("Helvetica").text(`: ${data.namaAnggota}`, 160, infoY);

      infoY += 22;
      doc.font("Helvetica-Bold").text("Email", 50, infoY);
      doc.font("Helvetica").text(`: ${data.emailAnggota}`, 160, infoY);

      infoY += 30;
      doc.moveTo(50, infoY).lineTo(pageWidth - 50, infoY).lineWidth(0.5).strokeColor("#cccccc").stroke();

      infoY += 15;
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#059669").text("DETAIL PENCAIRAN", 50, infoY);

      infoY += 25;
      doc.rect(50, infoY, contentWidth, 25).fill("#059669");
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#ffffff").text("Deskripsi", 60, infoY + 7, { width: 250 });
      doc.text("Jumlah", pageWidth - 200, infoY + 7, { width: 140, align: "right" });

      infoY += 25;
      doc.rect(50, infoY, contentWidth, 30).fill("#f0fdf4");
      doc.fontSize(10).font("Helvetica").fillColor("#333333").text("Pencairan Saldo", 60, infoY + 9, { width: 250 });
      doc.font("Helvetica-Bold").fillColor("#059669").text("Rp " + data.jumlah.toLocaleString("id-ID"), pageWidth - 200, infoY + 9, { width: 140, align: "right" });

      if (data.catatan) {
        infoY += 35;
        doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Catatan: " + data.catatan, 60, infoY);
      }

      infoY += 45;
      doc.moveTo(50, infoY).lineTo(pageWidth - 50, infoY).lineWidth(1).strokeColor("#059669").stroke();

      infoY += 10;
      doc.rect(50, infoY, contentWidth, 30).fill("#059669");
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#ffffff").text("TOTAL PENCAIRAN", 60, infoY + 8, { width: 250 });
      doc.text("Rp " + data.jumlah.toLocaleString("id-ID"), pageWidth - 200, infoY + 8, { width: 140, align: "right" });

      infoY += 80;
      doc.fontSize(10).font("Helvetica").fillColor("#333333").text("Mengetahui,", pageWidth - 250, infoY, { align: "center", width: 200 });
      infoY += 20;
      doc.font("Helvetica-Bold").text("Kepala Program Jagad Resik", pageWidth - 250, infoY, { align: "center", width: 200 });
      infoY += 25;
      doc.font("Helvetica-Bold").fillColor("#059669").text("Bu Nissa", pageWidth - 250, infoY, { align: "center", width: 200 });

      infoY += 35;
      doc.moveTo(pageWidth - 230, infoY).lineTo(pageWidth - 70, infoY).lineWidth(0.5).strokeColor("#333333").stroke();

      const footerY = doc.page.height - 60;
      doc.fontSize(8).font("Helvetica").fillColor("#999999").text("Invoice ini merupakan bukti pencairan saldo dari Jagad Resik Digital.", 50, footerY, { align: "center", width: contentWidth });
      doc.text("Simpan invoice ini sebagai bukti transaksi.", 50, footerY + 12, { align: "center", width: contentWidth });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

function generateInvoiceNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = String(Math.floor(1000 + Math.random() * 9000));
  return "INV-" + year + month + "-" + random;
}

function safeInvoiceFilename(noInvoice) {
  return noInvoice.replace(/\//g, "-");
}

module.exports = { generateInvoicePDF, generateInvoiceNumber, safeInvoiceFilename };
