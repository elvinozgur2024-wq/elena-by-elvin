// Phase 2 of the cutout pipeline. Reads the transparent PNGs produced by
// scripts/generate-cutouts.mjs (the ML background-removal pass), optimizes
// each to webp, and overwrites the matching object in Supabase Storage in
// place (same storage_path, so no DB rows change).
//
// Run scripts/generate-cutouts.mjs FIRST to populate .claude/cutouts/.
//
// Usage: npx tsx scripts/reprocess-product-images.ts [--dry-run]

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { readFile, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

config({ path: path.join(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const DRY_RUN = process.argv.includes("--dry-run");
const ASSETS_DIR = path.join(process.cwd(), ".claude");
const CUTOUTS_DIR = path.join(process.cwd(), ".claude", "cutouts");
const BACKUP_DIR = path.join(process.cwd(), ".claude", "pre-cutout-backup");

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Mirrors scripts/seed.ts's PRODUCTS list: which source file + alt text
// belongs to which product slug, so we can match DB rows to files without
// guessing. Keep this in sync with seed.ts if the catalog changes.
const PRODUCT_IMAGE_FILES: Record<string, { file: string; alt: string }[]> = {
  "kahverengi-ayi-pelus": [
    { file: "ayı.jpeg", alt: "Kahverengi ayı peluş oyuncak, önden görünüm" },
    { file: "ayıayakta.jpeg", alt: "Kahverengi ayı peluş oyuncak, ayakta duruş" },
    { file: "yaşlıayı.jpeg", alt: "Kahverengi ayı peluş oyuncak, detay" },
  ],
  "gulumseyen-balina-pelus": [
    { file: "balinaön.jpeg", alt: "Beyaz balina peluş oyuncak, önden görünüm" },
    { file: "balinayan.jpeg", alt: "Beyaz balina peluş oyuncak, yandan görünüm" },
    { file: "balinadiğeryan.jpeg", alt: "Beyaz balina peluş oyuncak, diğer yan" },
  ],
  "sevimli-kapibara-pelus": [
    { file: "kapibara.jpeg", alt: "Kapibara peluş oyuncak" },
    { file: "kabibarakalemli.jpeg", alt: "Kapibara peluş kalem kutusu" },
  ],
  "sevimli-panda-pelus": [{ file: "pandaçıkmamış.jpeg", alt: "Panda peluş oyuncak" }],
  "sari-civciv-pelus": [
    { file: "civciv1.jpeg", alt: "Sarı civciv peluş oyuncak" },
    { file: "civciv2.jpeg", alt: "Sarı civciv peluş oyuncak, diğer açı" },
  ],
  "kalpli-avokado-pelus": [
    { file: "avokado.jpeg", alt: "Kalpli avokado peluş oyuncak" },
    { file: "avokadoyan.jpeg", alt: "Kalpli avokado peluş oyuncak, yandan" },
  ],
  "kruvasan-pelus-yastik": [{ file: "kruvasan.jpeg", alt: "Kruvasan peluş yastık" }],
  "renkli-dinozor-pelus": [
    { file: "dinazor.jpeg", alt: "Yeşil dinozor peluş oyuncak" },
    { file: "beyazdinazor.jpeg", alt: "Beyaz dinozor peluş oyuncak" },
    { file: "pembedinazor.jpeg", alt: "Pembe dinozor peluş oyuncak" },
  ],
  "uyku-arkadasim-pelus-bebek": [
    { file: "uykuarkadaşı.jpeg", alt: "Uyku arkadaşı peluş bebek" },
    { file: "kızuykuarkadaşıkutulu.jpeg", alt: "Kız uyku arkadaşı, kutulu" },
    { file: "erkekuykuarkadaşıkutulu.jpeg", alt: "Erkek uyku arkadaşı, kutulu" },
  ],
  "hayvan-figurlu-anahtarlik-koleksiyonu": [
    { file: "ayıanahtarlık.jpeg", alt: "Ayı figürlü anahtarlık" },
    { file: "pandaanahtarlık.jpeg", alt: "Panda figürlü anahtarlık" },
    { file: "kurbağaanahtarlık.jpeg", alt: "Kurbağa figürlü anahtarlık" },
    { file: "kedianahtarlık.jpeg", alt: "Kedi figürlü anahtarlık" },
    { file: "çilekanahtarlık.jpeg", alt: "Çilek figürlü anahtarlık" },
    { file: "yıldızanahtarlık.jpeg", alt: "Yıldız figürlü anahtarlık" },
    { file: "avakadoanahtarlık.jpeg", alt: "Avokado figürlü anahtarlık" },
  ],
};

async function main() {
  await mkdir(BACKUP_DIR, { recursive: true });

  let processed = 0;
  let skipped = 0;

  for (const [slug, images] of Object.entries(PRODUCT_IMAGE_FILES)) {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (productError) throw productError;
    if (!product) {
      console.warn(`  ! No product found for slug "${slug}", skipping.`);
      continue;
    }

    const { data: dbImages, error: imagesError } = await supabase
      .from("product_images")
      .select("id, storage_path, alt_text")
      .eq("product_id", product.id);
    if (imagesError) throw imagesError;

    for (const { file, alt } of images) {
      const dbImage = dbImages?.find((img) => img.alt_text === alt);
      if (!dbImage) {
        console.warn(`  ! No DB row for "${slug}" / "${alt}", skipping.`);
        skipped++;
        continue;
      }

      const cutoutName = `${file.replace(/\.[a-z]+$/i, "")}.png`;
      const cutoutPath = path.join(CUTOUTS_DIR, cutoutName);
      const cutout = await readFile(cutoutPath).catch(() => null);
      if (!cutout) {
        console.warn(
          `  ! Missing cutout ${cutoutName}. Run generate-cutouts.mjs first. Skipping.`,
        );
        skipped++;
        continue;
      }

      // alphaThreshold=0 keeps the transparent background transparent; the
      // near-alpha=0 flag trims faint 1px matting fringe left by the model.
      const optimized = await sharp(cutout)
        .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82, alphaQuality: 100 })
        .toBuffer();

      if (DRY_RUN) {
        console.log(`  [dry-run] would overwrite ${dbImage.storage_path} from ${file}`);
        processed++;
        continue;
      }

      await copyFile(
        path.join(ASSETS_DIR, file),
        path.join(BACKUP_DIR, file),
      ).catch(() => {});

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(dbImage.storage_path, optimized, {
          contentType: "image/webp",
          upsert: true,
        });
      if (uploadError) throw uploadError;

      console.log(`  Reprocessed ${dbImage.storage_path} (${slug} / ${file})`);
      processed++;
    }
  }

  console.log(`\nDone. Reprocessed ${processed} image(s), skipped ${skipped}.`);
  if (!DRY_RUN) {
    console.log(`Original source files backed up to ${BACKUP_DIR}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
