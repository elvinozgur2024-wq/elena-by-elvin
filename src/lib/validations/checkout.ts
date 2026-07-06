import { z } from "zod";

export const shippingAddressSchema = z.object({
  full_name: z.string().min(3, "Ad soyad giriniz").max(120),
  phone: z
    .string()
    .regex(/^0?5\d{9}$/, "Geçerli bir telefon numarası giriniz (05XX XXX XX XX)"),
  city: z.string().min(2, "İl giriniz"),
  district: z.string().min(2, "İlçe giriniz"),
  neighborhood: z.string().optional(),
  address_line: z.string().min(10, "Açık adres giriniz"),
  postal_code: z.string().optional(),
});

export const checkoutSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  shipping: shippingAddressSchema,
  is_gift_wrapped: z.boolean(),
  gift_note: z.string().max(300, "Not en fazla 300 karakter olabilir").optional(),
  accepts_terms: z.literal(true, {
    message: "Devam etmek için mesafeli satış sözleşmesini onaylamalısınız",
  }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
