// One-off: the flower and wordmark in elenaland-logo.png are baked into a
// single flattened raster (no separate layers), so "make the flower
// bigger" means physically re-compositing the image: crop the flower out
// tightly, scale it 2x, and paste it back above an unchanged crop of the
// wordmark, trimming the large blank margins the original had so the
// overall image doesn't grow more than necessary (which would otherwise
// shrink the rendered wordmark, since the header displays the logo at a
// fixed height with auto width).
const sharp = require("sharp");

const SRC = "public/brand/elenaland-logo.png";
const OUT = "public/brand/elenaland-logo.png";

const FLOWER = { left: 1100, top: 86, width: 334, height: 313 }; // padded bbox
const TEXT = { left: 0, top: 422, width: 2431, height: 243 }; // tight glyph crop
const TEXT_CENTER_X = 1248;
const TOP_MARGIN = 12;
const GAP = 35;
const BOTTOM_MARGIN = 12;

(async () => {
  const flower2x = await sharp(SRC)
    .extract(FLOWER)
    .resize(FLOWER.width * 2, FLOWER.height * 2, { kernel: "lanczos3" })
    .toBuffer();
  const flowerMeta = await sharp(flower2x).metadata();

  const textCrop = await sharp(SRC).extract(TEXT).toBuffer();

  const canvasWidth = 2431;
  const canvasHeight =
    TOP_MARGIN + flowerMeta.height + GAP + TEXT.height + BOTTOM_MARGIN;

  const flowerLeft = Math.round(TEXT_CENTER_X - flowerMeta.width / 2);
  const flowerTop = TOP_MARGIN;
  const textTop = TOP_MARGIN + flowerMeta.height + GAP;

  await sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  })
    .composite([
      { input: flower2x, left: flowerLeft, top: flowerTop },
      { input: textCrop, left: 0, top: textTop },
    ])
    .png()
    .toFile(OUT.replace(".png", "-v2.png"));

  console.log({ canvasWidth, canvasHeight, flowerLeft, flowerTop, textTop });
})();
