# Project screenshots

Each project has its own folder named after its `id` in `src/data/portfolio.ts`,
for example `public/projects/cultur-always-wins/`.

## Capture guidelines

- Capture at **1440px wide** (browser viewport), at default zoom.
- Use a **full-width crop of the top of the page** (above the fold) as the cover.
- Export as **WebP or JPG under 300 KB** per image.
- Name the main image **`cover`** — e.g. `cover.webp` or `cover.jpg`.
  This is the one shown on the card and first in the modal gallery.
- Add up to 3 extra images per project (any names, e.g. `01-product.webp`).
  The first entry in the project's `images` array is always the cover.

## Wiring an image up

In `src/data/portfolio.ts`, set the project's `images` array to the public paths:

```ts
images: ['/projects/cultur-always-wins/cover.webp', '/projects/cultur-always-wins/02.webp'],
```

If a project has no `images`, the card and modal fall back to a dark gradient
with the project initials — nothing breaks.

## Placeholders

All seven projects currently use placeholder covers copied from existing site
assets (`public/images/story/`). They are full-resolution PNGs between roughly
0.8 MB and 2.7 MB — well over the 300 KB target above, so replace them with
proper captures before shipping.
