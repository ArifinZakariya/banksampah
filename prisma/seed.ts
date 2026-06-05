import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const anggotaPassword = await bcrypt.hash("anggota123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@banksampah.com" },
    update: {},
    create: {
      nama: "Admin Bank Sampah",
      email: "admin@banksampah.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const anggota = await prisma.user.upsert({
    where: { email: "anggota@banksampah.com" },
    update: {},
    create: {
      nama: "Anggota Bank Sampah",
      email: "anggota@banksampah.com",
      password: anggotaPassword,
      role: "ANGGOTA",
      tabungan: { create: { saldo: 50000 } },
    },
  });

  const sampahList = [
    { nama: "Kertas", hargaPerKg: 2000, satuan: "kg" },
    { nama: "Plastik", hargaPerKg: 1500, satuan: "kg" },
    { nama: "Botol Kaca", hargaPerKg: 1000, satuan: "kg" },
    { nama: "Kardus", hargaPerKg: 2500, satuan: "kg" },
    { nama: "Logam", hargaPerKg: 5000, satuan: "kg" },
    { nama: "Minyak Jelantah", hargaPerKg: 3000, satuan: "liter" },
  ];

  for (const sampah of sampahList) {
    const existing = await prisma.sampah.findFirst({ where: { nama: sampah.nama } });
    if (!existing) {
      await prisma.sampah.create({ data: sampah });
    }
  }

  await prisma.log.create({
    data: {
      userId: admin.id,
      aksi: "SEED_DATA",
      detail: "Database telah diisi dengan data awal",
    },
  });

  console.log("Seed berhasil!");
  console.log("Admin: admin@banksampah.com / admin123");
  console.log("Anggota: anggota@banksampah.com / anggota123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
