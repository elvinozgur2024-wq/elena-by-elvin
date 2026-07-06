"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/actions/auth";

export async function updateSiteContent(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_content")
    .update({
      hero_badge: formData.get("hero_badge"),
      hero_headline: formData.get("hero_headline"),
      hero_subheadline: formData.get("hero_subheadline"),
      gift_badge: formData.get("gift_badge"),
      gift_headline: formData.get("gift_headline"),
      gift_body: formData.get("gift_body"),
    })
    .eq("id", true);

  if (error) return { error: "Kaydedilemedi, lütfen tekrar deneyin" };

  revalidatePath("/");
  revalidatePath("/admin/site-icerigi");
  return {};
}

export async function uploadSiteImage(
  field: "hero_image_path" | "gift_image_path",
  formData: FormData,
) {
  const supabase = await createClient();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("Dosya bulunamadı");

  const buffer = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(buffer)
    .resize(1800, 1800, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  // Fixed path per field (not a UUID) so re-uploading replaces the old file
  // instead of accumulating orphaned images.
  const slot = field === "hero_image_path" ? "hero" : "gift";
  const path = `site/${slot}.webp`;

  // Wrap in a Blob rather than passing the raw Buffer directly — with
  // upsert:true the storage client takes a different internal code path
  // that was corrupting a plain Buffer's bytes (each invalid-UTF8 sequence
  // replaced with U+FFFD) in the deployed Node runtime. A Blob is
  // unambiguously binary and avoids that.
  const blob = new Blob([new Uint8Array(optimized)], { type: "image/webp" });

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(path, blob, { contentType: "image/webp", upsert: true });

  if (uploadError) throw new Error("Görsel yüklenemedi");

  const { error } = await supabase
    .from("site_content")
    .update({ [field]: path })
    .eq("id", true);

  if (error) throw new Error("Görsel kaydedilemedi");

  revalidatePath("/");
  revalidatePath("/admin/site-icerigi");
}
