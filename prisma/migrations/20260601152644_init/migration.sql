-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ANGGOTA');

-- CreateEnum
CREATE TYPE "StatusTransaksi" AS ENUM ('PENDING', 'DIKONFIRMASI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "StatusPencairan" AS ENUM ('MENUNGGU', 'DISETUJUI', 'DITOLAK');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ANGGOTA',
    "foto" TEXT,
    "alamat" TEXT,
    "noTelpon" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sampah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "harga_per_kg" DOUBLE PRECISION NOT NULL,
    "satuan" TEXT NOT NULL DEFAULT 'kg',
    "deskripsi" TEXT,
    "foto" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaksi" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "sampah_id" TEXT NOT NULL,
    "berat_kg" DOUBLE PRECISION NOT NULL,
    "total_harga" DOUBLE PRECISION NOT NULL,
    "status" "StatusTransaksi" NOT NULL DEFAULT 'PENDING',
    "foto" TEXT,
    "catatan" TEXT,
    "verified_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tabungan" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tabungan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pencairan" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "jumlah" DOUBLE PRECISION NOT NULL,
    "status" "StatusPencairan" NOT NULL DEFAULT 'MENUNGGU',
    "tanggal_pencairan" TIMESTAMP(3),
    "catatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pencairan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "aksi" TEXT NOT NULL,
    "detail" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tabungan_user_id_key" ON "tabungan"("user_id");

-- AddForeignKey
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_sampah_id_fkey" FOREIGN KEY ("sampah_id") REFERENCES "sampah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tabungan" ADD CONSTRAINT "tabungan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pencairan" ADD CONSTRAINT "pencairan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
