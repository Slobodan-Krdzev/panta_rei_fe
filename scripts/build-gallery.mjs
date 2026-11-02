// Compresses every photo in gallery-originals/ into web-ready WebP files
// (public/images/gallery/) and writes the list the carousel reads (src/gallery.json).
//
//   npm run gallery      (also runs automatically before `npm run dev`)
//
// Unchanged photos are skipped, and outputs of deleted originals are removed.

import sharp from "sharp";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "gallery-originals");
const OUT_DIR = path.join(ROOT, "public/images/gallery");
const MANIFEST = path.join(ROOT, "src/gallery.json");
const PUBLIC_PATH = "/images/gallery";

const SIZES = { lg: 1800, sm: 900 }; // longest edge in px
const QUALITY = 76;
const SUPPORTED = /\.(jpe?g|png|webp|avif|tiff?)$/i;

const slugify = (name) =>
  path
    .parse(name)
    .name.normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "photo";

const isFresh = async (src, out) =>
  existsSync(out) && (await stat(out)).mtimeMs >= (await stat(src)).mtimeMs;

async function main() {
  if (!existsSync(SRC_DIR)) {
    await mkdir(SRC_DIR, { recursive: true });
    console.log("gallery: created gallery-originals/ — drop photos there and run again.");
    return;
  }
  await mkdir(OUT_DIR, { recursive: true });

  const files = (await readdir(SRC_DIR)).filter((f) => !f.startsWith(".")).sort();
  const skipped = files.filter((f) => !SUPPORTED.test(f));
  if (skipped.length) console.warn(`gallery: skipping unsupported files (use JPG/PNG/WebP): ${skipped.join(", ")}`);

  const manifest = [];
  const keep = new Set();
  const usedSlugs = new Set();
  const seenHashes = new Map();
  const duplicates = [];
  let processed = 0;

  for (const file of files.filter((f) => SUPPORTED.test(f))) {
    // the same photo saved twice (e.g. "x.JPEG" and "x.jpg") is only shown once
    const hash = createHash("sha1").update(await readFile(path.join(SRC_DIR, file))).digest("hex");
    if (seenHashes.has(hash)) {
      duplicates.push(`${file} (= ${seenHashes.get(hash)})`);
      continue;
    }
    seenHashes.set(hash, file);

    let slug = slugify(file);
    for (let i = 2; usedSlugs.has(slug); i++) slug = `${slugify(file)}-${i}`;
    usedSlugs.add(slug);

    const src = path.join(SRC_DIR, file);
    const entry = { id: slug };

    for (const [size, edge] of Object.entries(SIZES)) {
      const outName = `${slug}-${size}.webp`;
      const out = path.join(OUT_DIR, outName);
      keep.add(outName);

      if (!(await isFresh(src, out))) {
        await sharp(src)
          .rotate() // respect camera orientation
          .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
          .webp({ quality: QUALITY, effort: 5 })
          .toFile(out);
        if (size === "lg") processed++;
      }
      if (size === "lg") {
        const { width, height } = await sharp(out).metadata();
        Object.assign(entry, { width, height });
      }
      entry[size] = `${PUBLIC_PATH}/${outName}`;
    }
    manifest.push(entry);
  }

  for (const f of await readdir(OUT_DIR)) {
    if (!keep.has(f) && f.endsWith(".webp")) await rm(path.join(OUT_DIR, f));
  }

  if (duplicates.length) console.warn(`gallery: skipped duplicates: ${duplicates.join(", ")}`);
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`gallery: ${manifest.length} photo(s), ${processed} newly compressed.`);
}

main().catch((err) => {
  console.error("gallery:", err.message);
  process.exit(1);
});
