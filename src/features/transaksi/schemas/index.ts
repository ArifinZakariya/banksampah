import { z } from "zod";

export const createTransaksiSchema = z.object({
  sampahId: z.string().min(1, "Pilih jenis sampah"),
  beratKg: z.number().positive("Berat harus lebih dari 0"),
  catatan: z.string().optional(),
  foto: z.string().optional(),
});

export const updateStatusTransaksiSchema = z.object({
  status: z.enum(["DIKONFIRMASI", "DITOLAK"]),
  catatan: z.string().optional(),
});

export type CreateTransaksiSchema = z.infer<typeof createTransaksiSchema>;
export type UpdateStatusTransaksiSchema = z.infer<typeof updateStatusTransaksiSchema>;
