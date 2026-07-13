// One-off: adds the new July 2026 photo batch (10 products) to the already-
// seeded catalog. Cutouts are pre-generated in .claude/new-product-cutouts/
// by generate-new-product-cutouts.mjs + composite-new-products.cjs +
// dehalo-edge.cjs — this script only uploads them and inserts product rows.
//
// Usage: npx tsx scripts/seed-new-products.ts   (requires .env.local)

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

config({ path: path.join(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ASSETS_DIR = path.join(process.cwd(), ".claude", "new-product-cutouts");

interface SeedImage {
  file: string; // cutout filename, e.g. "wa3.png"
  alt: string;
}

interface SeedProduct {
  name: string;
  slug: string;
  categorySlug: string;
  short_description: string;
  description: string;
  base_price: number;
  sku: string;
  stock_quantity: number;
  size: string;
  images: SeedImage[];
}

const CARE = "30°C'de hassas yıkama. Ütülemeyin, kurutma makinesi kullanmayın.";

const PRODUCTS: SeedProduct[] = [
  {
    name: "Sevimli Fare Peluş",
    slug: "fare-pelus",
    categorySlug: "hayvanlar",
    short_description: "Kadife kulakları ve tatlı gülümsemesiyle yeni sevilen.",
    description:
      "Gri tüylü gövdesi, kadife pembe kulakları ve beyaz göbeğiyle bu fare, yumuşacık dokusu sayesinde kucaklamaya doyum olmuyor. Bebeğinizin ilk oyuncak arkadaşlarından biri olmaya aday.",
    base_price: 299,
    sku: "EB-FAR-001",
    stock_quantity: 20,
    size: "Orta (M) — 25 cm",
    images: [{ file: "wa3.png", alt: "Gri fare peluş oyuncak" }],
  },
  {
    name: "Sevimli Koala Peluş",
    slug: "koala-pelus",
    categorySlug: "hayvanlar",
    short_description: "Kocaman kulakları ve sakin ifadesiyle huzur dolu bir arkadaş.",
    description:
      "Gri tüylü yuvarlak gövdesi ve büyük kulaklarıyla bu koala, yumuşacık dokusu sayesinde uyku vakitlerinin vazgeçilmezi olacak.",
    base_price: 339,
    sku: "EB-KOA-001",
    stock_quantity: 20,
    size: "Orta (M) — 26 cm",
    images: [{ file: "wa4.png", alt: "Gri koala peluş oyuncak" }],
  },
  {
    name: "İnek Peluş Yastık",
    slug: "inek-pelus-yastik",
    categorySlug: "hayvanlar",
    short_description: "Benekli deseni ve yastık formuyla hem oyuncak hem dekorasyon.",
    description:
      "Siyah-beyaz benekli tüyü ve yumuşacık dolgusuyla bu inek yastık, hem sarılmak hem de odanızı süslemek için ideal.",
    base_price: 319,
    sku: "EB-INE-001",
    stock_quantity: 15,
    size: "Orta (M) — 30 cm",
    images: [{ file: "wa6.png", alt: "Benekli inek peluş yastık" }],
  },
  {
    name: "Kar Tanesi Peluş",
    slug: "kar-tanesi-pelus",
    categorySlug: "doga-fantastik",
    short_description: "Nakışlı yüzü ve kar tanesi formuyla kış temalı sevimli bir dost.",
    description:
      "Beyaz tüylü kar tanesi formuyla bu peluş, kış aylarının en tatlı arkadaşı. Yumuşak dokusu ve tatlı yüz ifadesiyle her yaştan çocuğun gözdesi olacak.",
    base_price: 279,
    sku: "EB-KAR-001",
    stock_quantity: 20,
    size: "Küçük (S) — 22 cm",
    images: [{ file: "wa7.png", alt: "Kar tanesi peluş oyuncak" }],
  },
  {
    name: "Kurabiyeli Canavar Peluş",
    slug: "kurabiyeli-canavar-pelus",
    categorySlug: "doga-fantastik",
    short_description: "Ağzındaki kurabiyesiyle tatlı ve eğlenceli bir karakter.",
    description:
      "Bembeyaz kabarık tüyü, pembe kulakları ve ağzındaki kurabiyesiyle bu şirin canavar, hayal gücünü besleyen eğlenceli bir oyun arkadaşı.",
    base_price: 339,
    sku: "EB-CNV-001",
    stock_quantity: 15,
    size: "Orta (M) — 26 cm",
    images: [{ file: "wa9.png", alt: "Beyaz kurabiyeli canavar peluş oyuncak" }],
  },
  {
    name: "Sevimli Ahtapot Peluş",
    slug: "ahtapot-pelus",
    categorySlug: "deniz-canlilari",
    short_description: "Sekiz yumuşacık koluyla okyanusun en sevimli hali.",
    description:
      "Gri tüylü yuvarlak gövdesi ve uzun kollarıyla bu ahtapot, sarılması keyifli bir doku sunar. Pembe fiyonkuyla tatlı bir detay kazanır.",
    base_price: 309,
    sku: "EB-AHT-001",
    stock_quantity: 18,
    size: "Orta (M) — 24 cm",
    images: [{ file: "wa11.png", alt: "Gri ahtapot peluş oyuncak" }],
  },
  {
    name: "Gri Penguen Peluş",
    slug: "gri-penguen-pelus",
    categorySlug: "deniz-canlilari",
    short_description: "Kırmızı kalp detayıyla sevgi dolu bir kutup dostu.",
    description:
      "Gri-beyaz tüylü yuvarlak gövdesi ve turuncu ayaklarıyla bu penguen, göğsündeki kalp detayıyla sevgiyle hediye edilebilecek bir peluş.",
    base_price: 319,
    sku: "EB-PEG-001",
    stock_quantity: 18,
    size: "Orta (M) — 24 cm",
    images: [{ file: "wa12.png", alt: "Gri penguen peluş oyuncak" }],
  },
  {
    name: "Siyah Penguen Peluş",
    slug: "siyah-penguen-pelus",
    categorySlug: "deniz-canlilari",
    short_description: "Kırmızı kalp detayıyla şirin bir kutup dostu.",
    description:
      "Siyah-beyaz tüylü yuvarlak gövdesi ve turuncu ayaklarıyla bu penguen, göğsündeki kalp detayıyla sevimli bir hediye seçeneği.",
    base_price: 319,
    sku: "EB-PES-001",
    stock_quantity: 18,
    size: "Orta (M) — 24 cm",
    images: [{ file: "wa13.png", alt: "Siyah penguen peluş oyuncak" }],
  },
  {
    name: "Beyaz Kedi Peluş",
    slug: "beyaz-kedi-pelus",
    categorySlug: "hayvanlar",
    short_description: "Altın gözleri ve pembe kulaklarıyla zarif bir dost.",
    description:
      "Bembeyaz yumuşak tüyü, altın rengi gözleri ve pembe kulaklarıyla bu kedi, sarılması keyifli bir doku ve şirin bir ifadeye sahip.",
    base_price: 309,
    sku: "EB-KEB-001",
    stock_quantity: 20,
    size: "Orta (M) — 25 cm",
    images: [
      { file: "wa19.png", alt: "Beyaz kedi peluş oyuncak, önden görünüm" },
      { file: "wa18.png", alt: "Beyaz kedi peluş oyuncak, yandan görünüm" },
    ],
  },
  {
    name: "Siyah Kedi Peluş",
    slug: "siyah-kedi-pelus",
    categorySlug: "hayvanlar",
    short_description: "Altın gözleri ve pembe kulaklarıyla gizemli bir dost.",
    description:
      "Simsiyah yumuşak tüyü, parlak altın gözleri ve pembe kulaklarıyla bu kedi, evinizin en şirin sakinlerinden biri olacak.",
    base_price: 309,
    sku: "EB-KES-001",
    stock_quantity: 18,
    size: "Orta (M) — 25 cm",
    images: [{ file: "wa21.png", alt: "Siyah kedi peluş oyuncak" }],
  },
];

async function uploadImage(productSlug: string, image: SeedImage) {
  const source = await readFile(path.join(ASSETS_DIR, image.file));
  const optimized = await sharp(source)
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 100 })
    .toBuffer();

  const storagePath = `${productSlug}/${randomUUID()}.webp`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(storagePath, optimized, { contentType: "image/webp", upsert: true });

  if (error) throw new Error(`Upload failed for ${image.file}: ${error.message}`);
  return storagePath;
}

async function main() {
  console.log("Looking up categories...");
  const categoryIdBySlug = new Map<string, string>();
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, slug");
  if (catError) throw catError;
  for (const c of categories) categoryIdBySlug.set(c.slug, c.id);

  console.log("Seeding new products...");
  for (const product of PRODUCTS) {
    const categoryId = categoryIdBySlug.get(product.categorySlug);
    if (!categoryId) throw new Error(`Unknown category ${product.categorySlug}`);

    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", product.slug)
      .maybeSingle();

    if (existing) {
      console.log(`  Skipping "${product.name}" (already seeded).`);
      continue;
    }

    const { data: inserted, error: insertError } = await supabase
      .from("products")
      .insert({
        name: product.name,
        slug: product.slug,
        description: product.description,
        short_description: product.short_description,
        category_id: categoryId,
        base_price: product.base_price,
        sku: product.sku,
        stock_quantity: product.stock_quantity,
        size: product.size,
        care_instructions: CARE,
        is_active: true,
        is_featured: false,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;
    const productId = inserted.id;

    for (const [i, image] of product.images.entries()) {
      const storagePath = await uploadImage(product.slug, image);
      const { error } = await supabase.from("product_images").insert({
        product_id: productId,
        storage_path: storagePath,
        alt_text: image.alt,
        sort_order: i,
        is_primary: i === 0,
      });
      if (error) throw error;
    }

    console.log(`  Created "${product.name}".`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
