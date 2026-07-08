// Phase 1 of the cutout pipeline (run before reprocess-product-images.ts).
//
// Runs the imgly ML segmentation model over each original product photo and
// writes a transparent PNG to .claude/cutouts/. Kept in its OWN process that
// imports ONLY imgly (no `sharp`): imgly bundles sharp@0.32 and the project
// uses sharp@0.35, and loading both native builds in one process crashes.
// Phase 2 (sharp optimize + Supabase upload) reads these PNGs separately.
//
// Usage: node scripts/generate-cutouts.mjs
import { removeBackground } from "@imgly/background-removal-node";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ASSETS = path.join(process.cwd(), ".claude");
const OUT = path.join(ASSETS, "cutouts");

// Every source photo referenced by the seeded catalog (see scripts/seed.ts).
const FILES = [
  "ayı.jpeg",
  "ayıayakta.jpeg",
  "yaşlıayı.jpeg",
  "balinaön.jpeg",
  "balinayan.jpeg",
  "balinadiğeryan.jpeg",
  "kapibara.jpeg",
  "kabibarakalemli.jpeg",
  "pandaçıkmamış.jpeg",
  "civciv1.jpeg",
  "civciv2.jpeg",
  "avokado.jpeg",
  "avokadoyan.jpeg",
  "kruvasan.jpeg",
  "dinazor.jpeg",
  "beyazdinazor.jpeg",
  "pembedinazor.jpeg",
  "uykuarkadaşı.jpeg",
  "kızuykuarkadaşıkutulu.jpeg",
  "erkekuykuarkadaşıkutulu.jpeg",
  "ayıanahtarlık.jpeg",
  "pandaanahtarlık.jpeg",
  "kurbağaanahtarlık.jpeg",
  "kedianahtarlık.jpeg",
  "çilekanahtarlık.jpeg",
  "yıldızanahtarlık.jpeg",
  "avakadoanahtarlık.jpeg",
];

await mkdir(OUT, { recursive: true });

let done = 0;
for (const file of FILES) {
  const input = await readFile(path.join(ASSETS, file));
  const blob = new Blob([input], { type: "image/jpeg" });
  const resultBlob = await removeBackground(blob, {
    output: { format: "image/png" },
  });
  const cutout = Buffer.from(await resultBlob.arrayBuffer());
  const outName = `${file.replace(/\.[a-z]+$/i, "")}.png`;
  await writeFile(path.join(OUT, outName), cutout);
  done++;
  console.log(`  [${done}/${FILES.length}] ${file} -> cutouts/${outName}`);
}

console.log(`\nDone. ${done} cutout(s) written to ${OUT}`);
