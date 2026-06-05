import { z } from "zod";

export const createPencairanSchema = z.object({
  jumlah: z.number().positive("Jumlah harus lebih dari 0"),
});

export const updateStatusPencairanSchema = z.object({
  status: z.enum(["DISETUJUI", "DITOLAK"]),
  catatan: z.string().optional(),
});

export type CreatePencairanSchema = z.infer<typeof createPencairanSchema>;
export type UpdateStatusPencairanSchema = z.infer<typeof updateStatusPencairanSchema>;
