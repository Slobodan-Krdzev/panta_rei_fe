// Runs after `vite build`: renders the React app to static HTML (so every crawler and link
// preview sees the full content), injects the JSON-LD structured data, and writes
// sitemap.xml + robots.txt for the site URL in .env (VITE_SITE_URL).
//
// Output: dist/index.html (home), dist/<slug>.html for every landing page in src/pages.js,
// and dist/404.html, which Vercel serves (with status 404) for every unknown URL.
// vercel.json has "cleanUrls": true, so /svadbi serves svadbi.html (and /svadbi.html redirects to /svadbi).

import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");
const SERVER = path.join(ROOT, "dist-server");

const { render, structuredData, pageStructuredData, SITE_URL, PHOTOS, PAGES } = await import(
  pathToFileURL(path.join(SERVER, "entry-server.js")).href
);

if (!/^https?:\/\//.test(SITE_URL)) {
  console.error("prerender: VITE_SITE_URL in .env must be a full URL, e.g. https://pantarei.mk");
  process.exit(1);
}

const template = await readFile(path.join(DIST, "index.html"), "utf8");
const attr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

// Swap the home page's <head> tags in the template for a landing page's own
function landingHead(html, page) {
  const url = `${SITE_URL}/${page.slug}`;
  const swaps = [
    [/<title>[^<]*<\/title>/, `<title>${attr(page.title)}</title>`],
    [/(<meta name="description" content=")[^"]*/, `$1${attr(page.description)}`],
    [/(<link rel="canonical" href=")[^"]*/, `$1${url}`],
    [/(hreflang="mk" href=")[^"]*/, `$1${url}`],
    [/(hreflang="x-default" href=")[^"]*/, `$1${url}`],
    [/(<meta property="og:title" content=")[^"]*/, `$1${attr(page.title)}`],
    [/(<meta property="og:description" content=")[^"]*/, `$1${attr(page.description)}`],
    [/(<meta property="og:url" content=")[^"]*/, `$1${url}`],
    [/(<meta name="twitter:title" content=")[^"]*/, `$1${attr(page.title)}`],
    [/(<meta name="twitter:description" content=")[^"]*/, `$1${attr(page.description)}`],
    // the largest paint on a landing page is its own photo, not the home hero
    [
      /<link rel="preload" as="image"[^>]*>/,
      `<link rel="preload" as="image" href="${page.image.src}" imagesrcset="${page.image.srcSm} 900w, ${page.image.src} 1800w" imagesizes="(max-width: 960px) 100vw, 55vw" fetchpriority="high" />`,
    ],
  ];
  for (const [re, value] of swaps) {
    if (!re.test(html)) throw new Error(`prerender: index.html has no tag matching ${re}`);
    html = html.replace(re, value);
  }
  return html;
}

// The 404 page must stay out of search results and must not claim to be the home page
function notFoundHead(html) {
  const swaps = [
    [/<title>[^<]*<\/title>/, "<title>Страницата не постои (404) | Група Панта Реи</title>"],
    [/(<meta name="description" content=")[^"]*/, "$1Страницата што ја барате не постои или е преместена."],
    [/(<meta name="robots" content=")[^"]*/, "$1noindex, follow"],
    [/\s*<meta name="keywords"[^>]*>/, ""],
    [/\s*<link rel="canonical"[^>]*>/, ""],
    [/\s*<link rel="alternate" hreflang="mk"[^>]*>/, ""],
    [/\s*<link rel="alternate" hreflang="x-default"[^>]*>/, ""],
    [/\s*<meta property="og:url"[^>]*>/, ""],
    [/\s*<!-- Performance: hero photo is the largest paint -->\s*<link rel="preload" as="image"[^>]*>/, ""],
  ];
  for (const [re, value] of swaps) {
    if (!re.test(html)) throw new Error(`prerender: index.html has no tag matching ${re}`);
    html = html.replace(re, value);
  }
  return html;
}

const fill = (html, routePath, data) =>
  html.replace("<!--app-html-->", render(routePath)).replace("<!--app-head-->", jsonLd(data));

// 1) Home + landing pages
const home = fill(template, "/", structuredData());
await writeFile(path.join(DIST, "index.html"), home);
for (const page of PAGES) {
  await writeFile(path.join(DIST, `${page.slug}.html`), fill(landingHead(template, page), `/${page.slug}`, pageStructuredData(page)));
}

await writeFile(
  path.join(DIST, "404.html"),
  notFoundHead(template).replace("<!--app-html-->", render("/404")).replace("<!--app-head-->", "")
);

// 2) sitemap.xml — every page, the home page with every photo listed for Google Images
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const today = new Date().toISOString().slice(0, 10);
const entry = (loc, priority, images) => `  <url>
    <loc>${esc(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
${images.map((src) => `    <image:image><image:loc>${esc(SITE_URL + src)}</image:loc></image:image>`).join("\n")}
  </url>`;
const homeImages = ["/images/panta-rei-formal.webp", "/images/panta-rei-casual.webp", "/og-image.jpg", ...PHOTOS.map((p) => p.lg)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[entry(`${SITE_URL}/`, "1.0", homeImages), ...PAGES.map((p) => entry(`${SITE_URL}/${p.slug}`, "0.8", [p.image.src]))].join("\n")}
</urlset>
`;
await writeFile(path.join(DIST, "sitemap.xml"), sitemap);

// 3) robots.txt — two variants, picked per host by the rewrites in vercel.json:
//    the real domain gets robots-allow.txt, every other host (*.vercel.app, previews) gets robots-block.txt.
//    No plain robots.txt is written, otherwise Vercel would serve it before the rewrite runs.
await writeFile(
  path.join(DIST, "robots-allow.txt"),
  `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
);
await writeFile(path.join(DIST, "robots-block.txt"), `User-agent: *\nDisallow: /\n`);

await rm(SERVER, { recursive: true, force: true });
console.log(
  `prerender: index.html (${Math.round(home.length / 1024)} KB) + ${PAGES.length} landing pages + 404.html, sitemap.xml (${PAGES.length + 1} URLs), robots-allow/block.txt → ${SITE_URL}`
);
