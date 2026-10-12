# victorfateh.com

[![Netlify Status](https://api.netlify.com/api/v1/badges/e6253da7-47ca-4671-936f-455757a5cc3a/deploy-status)](https://app.netlify.com/sites/victorfateh/deploys)

Why overkill a portfolio when you don't have to?

Step 1

```shell
npm i 
```

Step 2

```shell
npm start
```

Open http://127.0.0.1:4173/ and leave the server running while editing. Parcel
automatically rebuilds and refreshes the page when HTML, CSS or JavaScript changes.
Development output goes into `.cache/dev/`, so production builds can run without
overwriting the local preview.

The Parcel static-files reporter copies `robots.txt` and the Windows tile icon into
both development and production output after each build. Restart the dev server
after editing these files, since the reporter does not watch static files for changes.

## Site icons

`assets/favicon.svg` is the editable vector source for the midnight-and-white VF
mark. The glyphs are paths, so exports do not depend on an installed font. Keep the
letters inside a circular crop and check readability at 16px and 32px.

- `favicon.ico`: a real ICO containing 16px, 32px and 48px images.
- `icon.png` and `icon-512.png`: 192px and 512px rounded-square PNG exports.
- `apple-touch-icon.png`: 180px with a solid square background; iOS applies its own mask.
- `mstile-150x150.png`: 150px with a solid square background for `browserconfig.xml`.

`scripts/parcel-namer-icons.cjs` preserves the public icon filenames while Parcel
continues to hash other assets for caching. Keep the icon URLs stable for search
crawlers. Export icons again after editing the SVG; do not upscale the old bitmap
or rename a PNG to `.ico`. Google may take days or weeks to refresh its cached icon.

## Search metadata and hosting

Netlify runs `npm run build` and publishes `dist/`, as configured in `netlify.toml`.
The preferred public URLs are `/`, `/resume`, `/philosophy` and `/travel` on
`https://www.victorfateh.com`. Keep navigation, canonical links, Open Graph URLs
and `sitemap.xml` consistent. The `.html` URLs remain available; the embedded
résumé document also points to `/resume` as its canonical page.

The homepage contains `WebSite`, `ProfilePage` and `Person` structured data.
Update it alongside the visible work history and search description if the role,
employer or profile links change. Set sitemap `lastmod` dates to actual significant
page changes, rather than the date of every build.

The Parcel preview serves page content but does not emulate Netlify redirects or
headers. Verify changes to those rules on Netlify. Google Search Console ownership
and indexing status have not yet been confirmed.

## Travel guides

Edit `travel-lists/*.txt`. Use `## Food` (or another category/destination) for
section headings, `Place name (optional notes)` for spots, and arrows for routes.
Blank lines are allowed between spots. `npm run dev` and `npm run build` regenerate
the embedded guide data; restart the dev server after editing a list. Update the
last-edited date in `travel.html` when changing the notes.

Add new destinations to `CITIES` in `scripts/travel-guide.mjs`. Multi-destination
guides can use `sectionLocations: true` so map links search the section's locality.
The basemap uses standard OpenStreetMap tiles without an API key, with visible
attribution below the map. Follow the [tile usage policy](https://operations.osmfoundation.org/policies/tiles/).

Run `npm test` for travel search, link and data regression checks; run
`npm run build` to produce the deployable `dist/` directory.
