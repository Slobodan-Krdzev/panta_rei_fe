# Група Панта Реи — website

React + Vite. Deploys to Vercel as-is (framework preset: Vite).

```bash
npm install
npm run dev      # local dev server (also refreshes the gallery first)
npm run build    # production build → dist/
```

## Gallery

1. Put full-size photos (JPG, PNG or WebP, any size) in `gallery-originals/`.
2. Run `npm run gallery`, or just restart `npm run dev`.

Each photo is compressed to WebP in two sizes (1800px and 900px) in `public/images/gallery/`,
and `src/gallery.json` is regenerated. Deleting a photo from `gallery-originals/` removes it
from the site on the next run. The carousel shuffles the order on every visit.

`gallery-originals/` is git-ignored (originals are large); commit `public/images/gallery/`
and `src/gallery.json` — that is what Vercel serves.

## Videos

1. Add a YouTube link (normal or Shorts) as a line in `videos.txt`. The order there is the order on the site.
2. Run `npm run videos` and commit `videos.txt`, `src/videos.json` and `public/images/videos/`.

Title, length, date, orientation and thumbnail are read from YouTube. Horizontal videos get their own
larger row above the vertical ones. Videos must be public and allow embedding. The player
(youtube-nocookie.com) only loads when a visitor opens a video.

## Site settings (`.env`)

- `VITE_SITE_URL` — the live address (no trailing slash). Used for the canonical URL, social previews,
  `sitemap.xml`, `robots.txt` and structured data. **Change it when you connect your own domain.**
- `VITE_THEME` — `metallic` (black / rose-gold from the logo) or empty for the original cream / red look.

## SEO

`npm run build` pre-renders the page to static HTML (`scripts/prerender.mjs`), so search engines and
link previews see the full content, and generates:

- `<head>`: title, description, keywords, canonical, Open Graph / Twitter cards, geo tags (`index.html`)
- JSON-LD structured data: MusicGroup + EntertainmentBusiness, WebSite, WebPage, ImageGallery, FAQPage (`src/seo.js`)
- `sitemap.xml` (with every gallery photo) and `robots.txt` (served per host by `vercel.json`: only pantareinastani.com is crawlable; `*.vercel.app` and preview URLs get `Disallow: /` + `X-Robots-Tag: noindex`)

FAQ text lives in `src/data.js` and feeds both the visible section and the FAQPage data.

Icons: `npm run icons` rebuilds the favicon set from the logo (`scripts/build-icons.mjs`).
The share image is `public/og-image.jpg` (1200×630).
