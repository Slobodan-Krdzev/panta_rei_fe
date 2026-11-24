// Reads the YouTube links in videos.txt, fetches each video's title, length, date, orientation and
// thumbnail, and writes src/videos.json + public/images/videos/*.webp (both are committed).
//
//   npm run videos      (run by hand after editing videos.txt; the production build never calls YouTube)

import sharp from "sharp";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public/images/videos");
const MANIFEST = path.join(ROOT, "src/videos.json");

const ID = /(?:v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})(?![\w-])/;
// the band's name is all over the page already: "Panta Rei - Naroden Mix Live" -> "Naroden Mix Live"
const BAND = "(?:Panta Rei(?: Band)?|(?:Група )?Панта Реи)";
const cleanTitle = (t) =>
  t.replace(new RegExp(`^${BAND}\\s*[-–—|]\\s*`, "i"), "").replace(new RegExp(`\\s*[-–—|]\\s*${BAND}$`, "i"), "").trim();

const pick = (html, re, what, id) => {
  const m = html.match(re);
  if (!m) throw new Error(`${id}: could not read ${what} from YouTube (is the video public?)`);
  return m[1];
};

async function fetchVideo(id, customTitle) {
  const watch = `https://www.youtube.com/watch?v=${id}`;
  const [oembed, page] = await Promise.all([
    fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watch)}`),
    fetch(watch, { headers: { "Accept-Language": "mk" } }),
  ]);
  if (!oembed.ok) throw new Error(`${id}: YouTube answered ${oembed.status} (the video must be public and allow embedding)`);
  const { title } = await oembed.json();
  const html = await page.text();
  const [, w, h] = html.match(/"embed":\{"iframeUrl":"[^"]+","width":(\d+),"height":(\d+)\}/) || [];
  if (!w) throw new Error(`${id}: could not read the video size from YouTube`);
  const portrait = Number(h) > Number(w);
  const description = JSON.parse(`"${pick(html, /"shortDescription":"((?:[^"\\]|\\.)*)"/, "the description", id)}"`);

  // portrait thumbnails only exist for vertical videos
  let image;
  for (const name of portrait ? ["oardefault", "oar2"] : ["maxresdefault", "hqdefault"]) {
    const res = await fetch(`https://i.ytimg.com/vi/${id}/${name}.jpg`);
    if (res.ok) {
      image = Buffer.from(await res.arrayBuffer());
      break;
    }
  }
  if (!image) throw new Error(`${id}: no thumbnail found`);
  const [width, height] = portrait ? [640, 1138] : [1120, 630];
  await sharp(image).resize({ width, height, fit: "cover" }).webp({ quality: 74, effort: 5 }).toFile(path.join(OUT_DIR, `${id}.webp`));

  return {
    id,
    title: customTitle || cleanTitle(title),
    description: description.split("\n")[0].trim() || title,
    seconds: Number(pick(html, /"videoDetails":\{.*?"lengthSeconds":"(\d+)"/s, "the length", id)),
    uploadDate: pick(html, /itemprop="uploadDate" content="([^"]+)"/, "the upload date", id),
    portrait,
    thumb: `/images/videos/${id}.webp`,
    width,
    height,
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const lines = (await readFile(path.join(ROOT, "videos.txt"), "utf8")).split("\n").map((l) => l.trim());
  const videos = [];
  for (const line of lines.filter((l) => l && !l.startsWith("#"))) {
    const [url, ...title] = line.split("|");
    const id = url.match(ID)?.[1];
    if (!id) throw new Error(`not a YouTube video link: ${line}`);
    if (!videos.some((v) => v.id === id)) videos.push(await fetchVideo(id, title.join("|").trim()));
  }
  // everything was fetched: only now touch the previous result
  await writeFile(MANIFEST, JSON.stringify(videos, null, 2) + "\n");
  const keep = new Set(videos.map((v) => `${v.id}.webp`));
  for (const f of await readdir(OUT_DIR)) if (f.endsWith(".webp") && !keep.has(f)) await rm(path.join(OUT_DIR, f));
  const tall = videos.filter((v) => v.portrait).length;
  console.log(`videos: ${videos.length} (${tall} vertical, ${videos.length - tall} horizontal)`);
}

main().catch((err) => {
  console.error("videos:", err.message);
  process.exit(1);
});
