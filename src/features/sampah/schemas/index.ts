import { z } from "zod";

export const createSampahSchema = z.object({
  nama: z.string().min(2, "Nama sampah minimal 2 karakter"),
  hargaPerKg: z.number().positive("Harga harus lebih dari 0"),
  satuan: z.string().default("kg"),
  deskripsi: z.string().optional(),
});

export type CreateSampahSchema = z.infer<typeof createSampahSchema>;
