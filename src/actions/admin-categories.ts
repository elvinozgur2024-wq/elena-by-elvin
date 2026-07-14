"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/validations/product";
import type { ActionResult } from "@/actions/auth";

export async function createCategory(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    tint: formData.get("tint"),
    sort_order: formData.get("sort_order") || 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgiler" };
  }

  const { error } = await supabase.from("categories").insert(parsed.data);
  if (error) {
    return {
      error: error.code === "23505" ? "Bu slug zaten kullanılıyor" : "Kategori oluşturulamadı",
    };
  }

  // Category names/tints/photos render on the ISR-cached homepage and store.
  revalidatePath("/");
  revalidatePath("/magaza");
  revalidatePath("/admin/kategoriler");
  return {};
}

export async function updateCategory(
  categoryId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    tint: formData.get("tint"),
    sort_order: formData.get("sort_order") || 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgiler" };
  }

  const { error } = await supabase
    .from("categories")
    .update(parsed.data)
    .eq("id", categoryId);

  if (error) return { error: "Kategori güncellenemedi" };

  revalidatePath("/");
  revalidatePath("/magaza");
  revalidatePath(`/magaza/${parsed.data.slug}`);
  revalidatePath("/admin/kategoriler");
  return {};
}

export async function uploadCategoryImage(
  categoryId: string,
  formData: FormData,
) {
  const supabase = await createClient();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("Dosya bulunamadı");

  const { data: category } = await supabase
    .from("categories")
    .select("slug, image_path")
    .eq("id", categoryId)
    .maybeSingle();
  if (!category) throw new Error("Kategori bulunamadı");

  const buffer = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(buffer)
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  // Timestamped path so every upload lands on a fresh URL — no CDN
  // cache-busting query params needed (categories have no updated_at).
  const path = `site/category-${categoryId}-${Date.now()}.webp`;

  // Wrap in a Blob rather than passing the raw Buffer directly — with the
  // storage client a plain Buffer's bytes were corrupted in the deployed
  // Node runtime (see uploadSiteImage). A Blob is unambiguously binary.
  const blob = new Blob([new Uint8Array(optimized)], { type: "image/webp" });

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(path, blob, { contentType: "image/webp" });

  if (uploadError) throw new Error("Görsel yüklenemedi");

  const { error } = await supabase
    .from("categories")
    .update({ image_path: path })
    .eq("id", categoryId);

  if (error) {
    // Don't leave an orphaned file the row doesn't point at.
    await supabase.storage.from("product-images").remove([path]);
    throw new Error("Görsel kaydedilemedi");
  }

  // The old file is unreferenced now — clean it up.
  if (category.image_path && category.image_path !== path) {
    await supabase.storage.from("product-images").remove([category.image_path]);
  }

  revalidatePath("/");
  revalidatePath(`/magaza/${category.slug}`);
  revalidatePath("/admin/kategoriler");
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", categoryId);
  revalidatePath("/");
  revalidatePath("/magaza");
  revalidatePath("/admin/kategoriler");
}
