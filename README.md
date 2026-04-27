# Denia Personal Website (React)

A simplified Denia fan website built with React + Vite.

## Tech Stack

- React 18
- Vite 5
- Plain CSS

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Simplified Structure

```text
.
├─ CLAUDE.md
├─ README.md
├─ DENIA_OFFICIAL_NOTES.md
├─ index.html
├─ package.json
├─ package-lock.json
├─ vite.config.js
├─ .github/workflows/deploy.yml
├─ public/
│  ├─ data/
│  │  └─ images.json
│  └─ images/
│     └─ full/
└─ src/
   ├─ App.jsx
   ├─ main.jsx
   └─ styles.css
```

## What Each Part Does

- `src/`: all frontend logic and UI.
- `public/images/full/`: your original collected images.
- `public/data/images.json`: index file for gallery search/filter/sort.

## Data Format

Use one item per image in `public/data/images.json`:

```json
{
  "full": "143518930_p0.jpg",
  "artist": "Unknown",
  "pixivId": "pending-143518930",
  "tags": ["denia", "fanart"],
  "createdAt": "2026-04-26"
}
```

## Current Gallery Behavior

- Reads image from `full` only.
- Supports search by `artist`, `pixivId`, and `tags`.
- Supports tag filtering and sorting.
- If an image is missing, it falls back to a generated placeholder.

## Link Maintenance

- Official Art links: `src/App.jsx` -> `OFFICIAL_ARTWORKS`
- Sources links: `src/App.jsx` -> `renderSources()`

## Copyright

All artworks belong to original creators.
This project is for fan showcase and non-commercial learning use.
