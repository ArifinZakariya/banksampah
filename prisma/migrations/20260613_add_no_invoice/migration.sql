-- AlterTable
ALTER TABLE "pencairan" ADD COLUMN "no_invoice" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "pencairan_no_invoice_key" ON "pencairan"("no_invoice");
