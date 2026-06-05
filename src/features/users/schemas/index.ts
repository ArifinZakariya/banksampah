import { z } from "zod";

export const updateProfileSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter").optional(),
  alamat: z.string().optional(),
  noTelpon: z.string().optional(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
