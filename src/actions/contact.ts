"use server";

import { createClient } from "@/lib/supabase/server";
import { sendContactNotificationEmail } from "@/lib/email/contact-notification";
import { contactSchema } from "@/lib/validations/product";
import type { ActionResult } from "@/actions/auth";

export type ContactActionResult = ActionResult & { success?: boolean };

export async function submitContactMessage(
  _prev: ContactActionResult,
  formData: FormData,
): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgiler" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert(parsed.data);

  if (error) {
    return { error: "Mesajınız gönderilemedi, lütfen tekrar deneyin" };
  }

  // Messages were only landing in the contact_messages table, which nothing
  // surfaces — forward each one to the shop's inbox. Best-effort by design.
  await sendContactNotificationEmail(parsed.data);

  return { success: true };
}
