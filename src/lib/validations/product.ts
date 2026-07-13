import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Ürün adı giriniz"),
  slug: z.string().min(2, "Slug giriniz").regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir"),
  description: z.string().optional(),
  short_description: z.string().max(200).optional(),
  category_id: z.string().uuid().nullable(),
  base_price: z.coerce.number().min(0, "Fiyat 0 veya üzeri olmalı"),
  compare_at_price: z.coerce.number().min(0).nullable().optional(),
  sku: z.string().min(2, "SKU giriniz"),
  stock_quantity: z.coerce.number().int().min(0),
  size: z.string().optional(),
  care_instructions: z.string().optional(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
});

export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Kategori adı giriniz"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir"),
  description: z.string().optional(),
  tint: z.enum(["blush", "sage", "butter", "sky", "lavender", "mint"]),
  sort_order: z.coerce.number().int().default(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Ad soyad giriniz"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  message: z.string().min(10, "Mesajınızı biraz daha detaylandırın"),
});

export type ContactInput = z.infer<typeof contactSchema>;
