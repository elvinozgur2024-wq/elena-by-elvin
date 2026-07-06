import { createPublicClient } from "@/lib/supabase/public";
import type { SiteContent } from "@/types/database.types";

const DEFAULTS: SiteContent = {
  id: true,
  hero_badge: "Yeni Sezon",
  hero_headline: "Sarılmaya değer yumuşacık anılar",
  hero_subheadline:
    "Elena By Elvin, bebeğinizin ilk gülüşlerine eşlik edecek özenle seçilmiş peluş oyuncaklar sunar. Her biri sevgiyle tasarlandı, sarılmak için can atıyor.",
  hero_image_path: null,
  gift_badge: "Elenaland Hediye Paketi",
  gift_headline: "Sevdiklerinize özel bir sürpriz hazırlayın",
  gift_body:
    "Ödeme sırasında hediye paketi seçeneğini işaretleyin, kişisel notunuzu ekleyin — gerisini bize bırakın.",
  gift_image_path: null,
  updated_at: "",
};

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("site_content").select("*").maybeSingle();
  return data ?? DEFAULTS;
}
