// Builds the favicon set from the band logo:
// the logo's copper ring with its own "P" and "R" letterforms inside.
//
//   node scripts/build-icons.mjs
//
// Outputs (committed, in public/): favicon.ico, favicon-16/32/48.png,
// apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png

import sharp from "sharp";
import path from "node:path";
import { writeFile } from "node:fs/promises";

const ROOT = path.resolve(import.meta.dirname, "..");
const LOGO = path.join(ROOT, "public/images/panta-rei-logo-metallic-full.png");
const OUT = path.join(ROOT, "public");
const BG = { r: 11, g: 10, b: 9 };

// Geometry of the artwork inside the logo file (measured from the image)
const RING = { cx: 890, cy: 428.5, r: 281.5, band: 16 };
const TEXT_ROWS = [355, 476]; // the wordmark crosses the ring here, so the ring has gaps
const LINE_ROWS = [515, 545]; // the thin line next to "BAND"
const P = { left: 226, top: 362, width: 134, height: 107 };
const R = { left: 1199, top: 362, width: 126, height: 107 };

async function rgba(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, ...info };
}

// Black background → transparent, keeping the metallic colour (same method as the header logo)
function knockOutBlack(img, floor = 30) {
  const { data } = img;
  for (let i = 0; i < data.length; i += 4) {
    const m = Math.max(data[i], data[i + 1], data[i + 2]);
    const a = Math.max(0, Math.min(1, (m - floor) / (255 - floor)));
    if (a > 0) for (let c = 0; c < 3; c++) data[i + c] = Math.min(255, data[i + c] / (m / 255));
    data[i + 3] = Math.round(a * 255);
  }
  return img;
}

async function ringLayer() {
  const size = Math.ceil((RING.r + RING.band) * 2);
  const left = Math.round(RING.cx - size / 2);
  const top = Math.round(RING.cy - size / 2);
  const img = knockOutBlack(await rgba(await sharp(LOGO).extract({ left, top, width: size, height: size }).toBuffer()));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x + left - RING.cx, y + top - RING.cy);
      const gy = y + top;
      const inGap = (gy >= TEXT_ROWS[0] && gy <= TEXT_ROWS[1]) || (gy >= LINE_ROWS[0] && gy <= LINE_ROWS[1]);
      if (Math.abs(d - RING.r) > RING.band || inGap) img.data[(y * size + x) * 4 + 3] = 0;
    }
  }
  return sharp(img.data, { raw: { width: size, height: size, channels: 4 } }).png().toBuffer();
}

async function letter(box, height) {
  const img = knockOutBlack(await rgba(await sharp(LOGO).extract(box).toBuffer()));
  return sharp(img.data, { raw: { width: img.width, height: img.height, channels: 4 } })
    .resize({ height })
    .png()
    .toBuffer();
}

// 1024px master: ring + "PR" on the logo's black
async function master({ size = 1024, ringScale = 0.86, bold = false } = {}) {
  const ringPx = Math.round(size * ringScale);
  const ring = await sharp(await ringLayer()).resize(ringPx).toBuffer();
  const lh = Math.round(size * 0.27 * (ringScale / 0.86)); // letters scale with the ring
  const [p, r] = await Promise.all([letter(P, lh), letter(R, lh)]);
  const pw = (await sharp(p).metadata()).width;
  const rw = (await sharp(r).metadata()).width;
  const gap = Math.round(size * 0.035);
  const x0 = Math.round((size - (pw + gap + rw)) / 2);
  const y0 = Math.round((size - lh) / 2);

  let layer = await sharp({ create: { width: size, height: size, channels: 4, background: { ...BG, alpha: 0 } } })
    .composite([
      { input: ring, left: Math.round((size - ringPx) / 2), top: Math.round((size - ringPx) / 2) },
      { input: p, left: x0, top: y0 },
      { input: r, left: x0 + pw + gap, top: y0 },
    ])
    .png()
    .toBuffer();

  // Small favicons: thicken the hairline strokes so they survive at 16–48px
  if (bold) {
    const thick = await sharp(layer).blur(size * 0.012).toBuffer();
    const { data, info } = await sharp(thick).raw().toBuffer({ resolveWithObject: true });
    for (let i = 3; i < data.length; i += 4) data[i] = Math.min(255, data[i] * 3.2);
    for (let i = 0; i < data.length; i += 4) {
      if (!data[i + 3]) continue;
      const m = Math.max(data[i], data[i + 1], data[i + 2]) || 1;
      for (let c = 0; c < 3; c++) data[i + c] = Math.min(255, (data[i + c] / m) * 235);
    }
    layer = await sharp(data, { raw: info }).png().toBuffer();
  }

  return sharp({ create: { width: size, height: size, channels: 4, background: { ...BG, alpha: 1 } } })
    .composite([{ input: layer }])
    .png()
    .toBuffer();
}

// Multi-size .ico with PNG-encoded entries (supported by every current browser)
function ico(pngs) {
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ size, buf }, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(buf.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += buf.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.buf)]);
}

const fine = await master();
const bold = await master({ bold: true, ringScale: 0.94 });
const maskable = await master({ ringScale: 0.68 }); // keeps the art inside Android's safe zone

const png = (src, size) => sharp(src).resize(size, size, { kernel: "lanczos3" }).png({ compressionLevel: 9 }).toBuffer();

const small = await Promise.all([16, 32, 48].map(async (size) => ({ size, buf: await png(bold, size) })));
for (const { size, buf } of small) await writeFile(path.join(OUT, `favicon-${size}.png`), buf);
await writeFile(path.join(OUT, "favicon.ico"), ico(small));
await writeFile(path.join(OUT, "apple-touch-icon.png"), await png(fine, 180));
await writeFile(path.join(OUT, "icon-192.png"), await png(fine, 192));
await writeFile(path.join(OUT, "icon-512.png"), await png(fine, 512));
await writeFile(path.join(OUT, "icon-maskable-512.png"), await png(maskable, 512));
console.log("icons: favicon.ico (16/32/48), favicon-16/32/48.png, apple-touch-icon.png, icon-192/512.png, icon-maskable-512.png");
