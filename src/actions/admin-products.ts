"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { productSchema } from "@/lib/validations/product";
import type { ActionResult } from "@/actions/auth";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Yetkisiz");

  const { data: customer } = await supabase
    .from("customers")
    .select("role")
    .eq("id", user.id)
    .single();

  if (customer?.role !== "admin") throw new Error("Yetkisiz");
  return supabase;
}

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    short_description: formData.get("short_description") || undefined,
    category_id: formData.get("category_id") || null,
    base_price: formData.get("base_price"),
    compare_at_price: formData.get("compare_at_price") || null,
    sku: formData.get("sku"),
    stock_quantity: formData.get("stock_quantity"),
    size: formData.get("size") || undefined,
    care_instructions: formData.get("care_instructions") || undefined,
    is_active: formData.get("is_active") === "on",
    is_featured: formData.get("is_featured") === "on",
  });
}

export async function createProduct(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = parseProductForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgiler" };
  }

  const { data, error } = await supabase
    .from("products")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) {
    return {
      error: error.code === "23505" ? "Bu slug veya SKU zaten kullanılıyor" : "Ürün oluşturulamadı",
    };
  }

  revalidatePath("/admin/urunler");
  redirect(`/admin/urunler/${data.id}`);
}

export async function updateProduct(
  productId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = parseProductForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgiler" };
  }

  const { error } = await supabase
    .from("products")
    .update(parsed.data)
    .eq("id", productId);

  if (error) {
    return {
      error: error.code === "23505" ? "Bu slug veya SKU zaten kullanılıyor" : "Ürün güncellenemedi",
    };
  }

  revalidatePath("/admin/urunler");
  revalidatePath(`/admin/urunler/${productId}`);
  return {};
}

export async function deleteProduct(productId: string) {
  const supabase = await requireAdmin();
  await supabase.from("products").delete().eq("id", productId);
  revalidatePath("/admin/urunler");
}

export async function uploadProductImage(productId: string, formData: FormData) {
  const supabase = await requireAdmin();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("Dosya bulunamadı");

  // When the admin's "remove background" option is on, the uploader already
  // ran the cutout in the browser (imgly WASM) before upload, so the file
  // may arrive with a transparent background — we just optimize + preserve
  // that alpha here, keeping the ML runtime out of the Vercel serverless
  // bundle entirely. With the option off, this is a plain opaque photo.
  const buffer = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(buffer)
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 100 })
    .toBuffer();

  const path = `${productId}/${crypto.randomUUID()}.webp`;

  // Blob wrapper avoids a binary-corruption issue seen with raw Buffers on
  // some storage-client code paths — see uploadSiteImage for details.
  const blob = new Blob([new Uint8Array(optimized)], { type: "image/webp" });

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(path, blob, { contentType: "image/webp" });

  if (uploadError) throw new Error("Görsel yüklenemedi");

  const { count } = await supabase
    .from("product_images")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId);

  await supabase.from("product_images").insert({
    product_id: productId,
    storage_path: path,
    is_primary: (count ?? 0) === 0,
    sort_order: count ?? 0,
  });

  revalidatePath(`/admin/urunler/${productId}`);
}

export async function deleteProductImage(imageId: string, productId: string) {
  const supabase = await requireAdmin();
  const { data: image } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("id", imageId)
    .single();

  if (image) {
    await supabase.storage.from("product-images").remove([image.storage_path]);
  }

  await supabase.from("product_images").delete().eq("id", imageId);
  revalidatePath(`/admin/urunler/${productId}`);
}

export async function setPrimaryImage(imageId: string, productId: string) {
  const supabase = await requireAdmin();
  await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);
  await supabase
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", imageId);
  revalidatePath(`/admin/urunler/${productId}`);
}

export async function addVariant(productId: string, formData: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("product_variants").insert({
    product_id: productId,
    label: formData.get("label")?.toString() ?? "",
    sku_suffix: formData.get("sku_suffix")?.toString() ?? "",
    price_delta: Number(formData.get("price_delta") ?? 0),
    stock_quantity: Number(formData.get("stock_quantity") ?? 0),
  });
  revalidatePath(`/admin/urunler/${productId}`);
}

export async function deleteVariant(variantId: string, productId: string) {
  const supabase = await requireAdmin();
  await supabase.from("product_variants").delete().eq("id", variantId);
  revalidatePath(`/admin/urunler/${productId}`);
}
