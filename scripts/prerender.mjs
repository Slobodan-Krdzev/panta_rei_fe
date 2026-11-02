// Runs after `vite build`: renders the React app to static HTML (so every crawler and link
// preview sees the full content), injects the JSON-LD structured data, and writes
// sitemap.xml + robots.txt for the site URL in .env (VITE_SITE_URL).

import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");
const SERVER = path.join(ROOT, "dist-server");

const { render, structuredData, SITE_URL, PHOTOS } = await import(pathToFileURL(path.join(SERVER, "entry-server.js")).href);

if (!/^https?:\/\//.test(SITE_URL)) {
  console.error("prerender: VITE_SITE_URL in .env must be a full URL, e.g. https://pantarei.mk");
  process.exit(1);
}

// 1) index.html with pre-rendered markup + structured data
const jsonLd = JSON.stringify(structuredData()).replace(/</g, "\\u003c");
const template = await readFile(path.join(DIST, "index.html"), "utf8");
const html = template
  .replace("<!--app-html-->", render())
  .replace("<!--app-head-->", `<script type="application/ld+json">${jsonLd}</script>`);
await writeFile(path.join(DIST, "index.html"), html);

// 2) sitemap.xml — one page, with every photo listed for Google Images
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const images = [
  "/images/panta-rei-formal.webp",
  "/images/panta-rei-casual.webp",
  "/og-image.jpg",
  ...PHOTOS.map((p) => p.lg),
];
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${esc(SITE_URL)}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
${images.map((src) => `    <image:image><image:loc>${esc(SITE_URL + src)}</image:loc></image:image>`).join("\n")}
  </url>
</urlset>
`;
await writeFile(path.join(DIST, "sitemap.xml"), sitemap);

// 3) robots.txt
await writeFile(
  path.join(DIST, "robots.txt"),
  `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
);

await rm(SERVER, { recursive: true, force: true });
console.log(`prerender: index.html (${Math.round(html.length / 1024)} KB), sitemap.xml (${images.length} images), robots.txt → ${SITE_URL}`);
