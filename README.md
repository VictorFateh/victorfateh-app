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
