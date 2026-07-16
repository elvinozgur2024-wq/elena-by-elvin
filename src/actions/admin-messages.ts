"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Both mutations .select() the affected rows and check one came back: an
// RLS-rejected update/delete is not an error, it just matches 0 rows —
// without the check a missing policy would look like silent success.

export async function setMessageRead(messageId: string, isRead: boolean) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .update({ is_read: isRead })
    .eq("id", messageId)
    .select("id");
  if (error || !data?.length) throw new Error("Mesaj güncellenemedi");
  revalidatePath("/admin/mesajlar");
}

export async function deleteContactMessage(messageId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", messageId)
    .select("id");
  if (error || !data?.length) throw new Error("Mesaj silinemedi");
  revalidatePath("/admin/mesajlar");
}
