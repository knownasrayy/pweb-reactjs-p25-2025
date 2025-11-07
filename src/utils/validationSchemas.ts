import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(1, { message: "Password tidak boleh kosong" }),
});

export const registerSchema = z.object({
  name: z.string().min(1, { message: "Nama tidak boleh kosong" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});