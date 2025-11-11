import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(1, { message: "Password tidak boleh kosong" }),
});

export const registerSchema = z.object({
  username: z.string().min(1, { message: "Username tidak boleh kosong" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export const bookSchema = z.object({
  title: z.string().min(1, { message: "Judul tidak boleh kosong" }),
  writer: z.string().min(1, { message: "Penulis tidak boleh kosong" }),
  publisher: z.string().min(1, { message: "Penerbit tidak boleh kosong" }),
  publicationYear: z.coerce
    .number()
    .min(1000, { message: "Tahun terbit harus angka (misal: 2024)" }),
  genreId: z.string().min(1, { message: "Genre harus dipilih" }),
  price: z.coerce
    .number()
    .min(0, { message: "Harga harus angka dan tidak boleh negatif" }),
  stockQuantity: z.coerce
    .number()
    .min(0, { message: "Stok harus angka dan tidak boleh negatif" }),
  condition: z.enum(['New', 'Used'], { message: "Kondisi harus New atau Used" }),
  isbn: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().url({ message: "Harus berupa URL gambar yang valid" }).optional().or(z.literal('')),
});

export type BookFormData = z.infer<typeof bookSchema>;