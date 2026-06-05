import { z } from "zod";

export const emailSchema = z.string().email("Email tidak valid");

export const passwordSchema = z.string().min(6, "Password minimal 6 karakter");

export const namaSchema = z.string().min(3, "Nama minimal 3 karakter");

export const positiveNumberSchema = z
  .number()
  .positive("Nilai harus lebih dari 0");
