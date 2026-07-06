"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { shippingAddressSchema } from "@/lib/validations/checkout";
import type { ActionResult } from "@/actions/auth";

export async function createAddress(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Giriş yapmalısınız" };

  const parsed = shippingAddressSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    district: formData.get("district"),
    neighborhood: formData.get("neighborhood") || undefined,
    address_line: formData.get("address_line"),
    postal_code: formData.get("postal_code") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgiler" };
  }

  const { error } = await supabase.from("addresses").insert({
    ...parsed.data,
    customer_id: user.id,
    label: formData.get("label")?.toString() || "Adresim",
  });

  if (error) return { error: "Adres kaydedilemedi" };

  revalidatePath("/hesabim");
  return {};
}

export async function deleteAddress(addressId: string) {
  const supabase = await createClient();
  await supabase.from("addresses").delete().eq("id", addressId);
  revalidatePath("/hesabim");
}
