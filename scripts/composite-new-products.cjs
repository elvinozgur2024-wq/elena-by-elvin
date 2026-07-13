const sharp = require("sharp");
const path = require("node:path");
const fs = require("node:fs");
const OUT = path.join(process.cwd(), ".claude", "new-product-cutouts");
const PREVIEW = path.join(OUT, "preview");
fs.mkdirSync(PREVIEW, { recursive: true });

const tints = {
  wa3: { r: 250, g: 236, b: 204 }, // hayvanlar butter
  wa4: { r: 250, g: 236, b: 204 },
  wa6: { r: 250, g: 236, b: 204 },
  wa7: { r: 214, g: 226, b: 209 }, // doga-fantastik sage
  wa9: { r: 214, g: 226, b: 209 },
  wa11: { r: 214, g: 231, b: 240 }, // deniz-canlilari sky
  wa12: { r: 214, g: 231, b: 240 },
  wa13: { r: 214, g: 231, b: 240 },
  wa18: { r: 250, g: 236, b: 204 },
  wa19: { r: 250, g: 236, b: 204 },
  wa21: { r: 250, g: 236, b: 204 },
};

(async () => {
  for (const [name, tint] of Object.entries(tints)) {
    const src = path.join(OUT, `${name}.png`);
    const meta = await sharp(src).metadata();
    const size = Math.max(meta.width, meta.height);
    const composited = await sharp({
      create: { width: size, height: size, channels: 4, background: { ...tint, alpha: 1 } },
    })
      .composite([{ input: src, gravity: "center" }])
      .png()
      .toBuffer();
    fs.writeFileSync(path.join(PREVIEW, `${name}-preview.png`), composited);
    console.log("composited", name);
  }
})();
