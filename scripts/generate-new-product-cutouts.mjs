// One-off: ML background removal for the new batch of product photos in
// C:\Users\canca\Desktop\elena. Mirrors generate-cutouts.mjs's approach but
// reads from that folder instead of .claude/.
import { removeBackground } from "@imgly/background-removal-node";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "C:\\Users\\canca\\Desktop\\elena";
const OUT = path.join(process.cwd(), ".claude", "new-product-cutouts");

const FILES = [
  "WhatsApp Image 2026-07-09 at 12.48.15 (3).jpeg", // fare (mouse) studio
  "WhatsApp Image 2026-07-09 at 12.48.15 (4).jpeg", // koala studio
  "WhatsApp Image 2026-07-09 at 12.48.15 (6).jpeg", // inek pillow studio
  "WhatsApp Image 2026-07-09 at 12.48.15 (7).jpeg", // kar tanesi (only lifestyle shot — test quality)
  "WhatsApp Image 2026-07-09 at 12.48.15 (9).jpeg", // kurabiyeli canavar studio
  "WhatsApp Image 2026-07-09 at 12.48.15 (11).jpeg", // ahtapot studio
  "WhatsApp Image 2026-07-09 at 12.48.15 (12).jpeg", // penguen gri
  "WhatsApp Image 2026-07-09 at 12.48.15 (13).jpeg", // penguen siyah
  "WhatsApp Image 2026-07-09 at 12.48.15 (18).jpeg", // kedi beyaz side
  "WhatsApp Image 2026-07-09 at 12.48.15 (19).jpeg", // kedi beyaz front
  "WhatsApp Image 2026-07-09 at 12.48.15 (21).jpeg", // kedi siyah studio
];

await mkdir(OUT, { recursive: true });

let done = 0;
for (const file of FILES) {
  const input = await readFile(path.join(SRC, file));
  const blob = new Blob([input], { type: "image/jpeg" });
  const resultBlob = await removeBackground(blob, {
    output: { format: "image/png" },
  });
  const cutout = Buffer.from(await resultBlob.arrayBuffer());
  const outName = file.replace(/^WhatsApp Image 2026-07-09 at 12\.48\.15 ?/, "wa").replace(/[()]/g, "").replace(/\.jpeg$/, ".png");
  await writeFile(path.join(OUT, outName), cutout);
  done++;
  console.log(`  [${done}/${FILES.length}] ${file} -> ${outName}`);
}

console.log(`\nDone. ${done} cutout(s) written to ${OUT}`);
