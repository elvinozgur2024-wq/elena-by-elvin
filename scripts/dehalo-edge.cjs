// The ML matte for this toy sometimes reports high (but not quite 255)
// alpha for pixels that are actually a partial optical blend of white fur
// and the grey studio backdrop (fine hair sub-pixel antialiasing baked into
// the source photo before the matte ever ran) — so the matte's *alpha
// value* is what's wrong, not just the color, and a recolor-only fix can't
// repair it.
//
// Fix: wherever the matte already flagged a pixel as not-fully-opaque
// (alpha < 255) AND the pixel's color is near-neutral (a plausible blend of
// grey bg <-> white fg, not a saturated design color like the pink ears or
// black eyes), re-derive alpha directly from color as a two-color key:
//   coverage = (channel - bg) / (255 - bg), averaged over RGB
// and pin color to white. Fully-opaque pixels and colored/dark pixels are
// left completely untouched, so solid fur, ears, embroidery, and any
// interior grey decorative stitching survive unchanged.
const sharp = require("sharp");
const path = require("node:path");
const OUT = path.join(process.cwd(), ".claude", "new-product-cutouts");
const [, , inputName, bgArg] = process.argv;
const BG = (bgArg ?? "140,140,140").split(",").map(Number);
const FG = [255, 255, 255];
const SPREAD_MAX = Number(process.argv[4] ?? 30);
const MIN_LIGHTNESS = Number(process.argv[5] ?? Math.round((BG[0] + BG[1] + BG[2]) / 3) + 5);

(async () => {
  const src = path.join(OUT, inputName);
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += info.channels) {
    const a = data[i + 3];
    if (a === 0 || a === 255) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    const lightness = (r + g + b) / 3;
    if (spread > SPREAD_MAX || lightness < MIN_LIGHTNESS) continue;
    let coverage = 0;
    for (let c = 0; c < 3; c++) coverage += (data[i + c] - BG[c]) / (FG[c] - BG[c]);
    coverage = Math.max(0, Math.min(1, coverage / 3));
    data[i] = FG[0];
    data[i + 1] = FG[1];
    data[i + 2] = FG[2];
    data[i + 3] = Math.round(coverage * 255);
  }
  const outName = inputName.replace(/\.png$/, "-dehalo.png");
  await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toFile(path.join(OUT, outName));
  console.log("wrote", outName);
})();
