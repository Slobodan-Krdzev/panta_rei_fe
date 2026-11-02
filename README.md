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

## Theme

`<html data-theme="metallic">` in `index.html` enables the black / rose-gold theme from the
logo. Remove the attribute to return to the original cream / red theme.
