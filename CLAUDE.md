# CLAUDE.md

This file provides coding guidance for the Wuthering Waves Denia personal fan website repository.

## Project Overview

**Denia Gallery** — A fan-made gallery site for Denia (达妮娅), a 5-star Fusion Resonator from Wuthering Waves Version 3.3.

## Tech Stack

- **Frontend**: React 18, Vite 5
- **Styling**: Plain CSS with custom theme variables
- **Deployment**: GitHub Pages (via GitHub Actions)

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run thumbs           # Generate thumbnails (requires sharp)
```

## Project Structure

```text
.
├─ CLAUDE.md                     # This file - development guidelines
├─ README.md                     # User-facing project documentation
├─ index.html                    # HTML entry point
├─ package.json                  # Dependencies and scripts
├─ package-lock.json             # Locked dependency versions
├─ vite.config.js                # Vite configuration
├─ .github/workflows/deploy.yml  # CI/CD deployment workflow
├─ scripts/
│  └─ generate-thumbnails.js     # Thumbnail generation script
├─ public/
│  ├─ data/
│  │  └─ images.json             # Gallery image metadata
│  └─ images/
│     ├─ full/                   # Full-size gallery images
│     └─ thumbs/                 # Auto-generated thumbnails
└─ src/
   ├─ App.jsx                    # Main gallery component
   ├─ main.jsx                   # React entry point
   └─ styles.css                 # Global styles, theme variables
```

## Data Model

Gallery items in `public/data/images.json`:

```json
{
  "full": "143518930_p0.jpg",
  "thumbnail": "thumbs/143518930_p0_thumb.webp",
  "artistId": "113703823",
  "tags": ["denia", "fanart"],
  "createdAt": "2026-04-26"
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `full` | string | Image filename in `public/images/full/` |
| `thumbnail` | string | Thumbnail filename in `public/images/thumbs/` |
| `artistId` | string | Pixiv user ID (optional, builds user link: `https://www.pixiv.net/users/{id}`) |
| `tags` | array | Tags for filtering (must include "denia") |
| `createdAt` | string | ISO date string (YYYY-MM-DD) |

### Pixiv ID Auto-Detection

The system automatically extracts Pixiv artwork IDs from filenames:

| Filename Pattern | Recognition |
|-----------------|-------------|
| `143518930_p0.jpg` | Pixiv artwork ID: `143518930` |
| `143518930_p0_master.jpg` | Pixiv artwork ID: `143518930` |
| `HEVHeRObYAwI-OI.jpg` | Official/other (no Pixiv ID) |

**Rule**: Filename starts with digits → Pixiv artwork; starts with letters → official/other

## Component Architecture

### App.jsx

- **Default Export**: `App` — Main gallery component
- **Helper Functions**:
  - `extractPixivId(filename)` — Extracts Pixiv ID from filename
  - `buildPixivUrl(pixivId)` — Builds artwork URL
  - `buildPixivUserUrl(artistId)` — Builds user profile URL
  - `fallbackSvg(name)` — Generates SVG placeholder for missing images
- **Sub-Components**:
  - `ZoomableImage` — Pinch/drag zoomable image viewer (lightbox)
  - `LoadingSpinner` — Loading indicator

### Key Features

- **Tag filtering** — Filter gallery by tags
- **Search** — Search by Pixiv ID or tags
- **Sorting** — Default, Date, Pixiv ID (click to toggle asc/desc)
- **Draggable cards** — Touch and mouse pointer drag support with localStorage persistence
- **Lightbox viewer** — Keyboard navigation (Arrow keys, Escape), zoomable images
- **Responsive** — Mobile-first breakpoints (500px, 768px, 900px, 1100px)
- **i18n** — Chinese/English language toggle with preference persistence

## Theme Variables (styles.css)

```css
:root {
  --bg-ink: #141b1c;        /* Dark background */
  --bg-panel: #1a2426;      /* Panel background */
  --paper: #e6ddc8;         /* Primary text color */
  --gold: #b78a4b;          /* Accent gold */
  --teal: #4e7f80;          /* Accent teal */
  --line: rgba(215, 177, 117, 0.28); /* Border lines */
}
```

## Development Guidelines

### Adding New Gallery Images

1. Download image to `public/images/full/`
2. Run `npm run thumbs` to generate thumbnail
3. Add entry to `public/data/images.json`:
   ```json
   {
     "full": "143518930_p0.jpg",
     "thumbnail": "thumbs/143518930_p0_thumb.webp",
     "artistId": "113703823",
     "tags": ["denia", "fanart"],
     "createdAt": "2026-04-28"
   }
   ```

### Thumbnail Generation

```bash
# Install sharp (first time only)
npm install sharp

# Generate thumbnails for all images
npm run thumbs
```

### Updating i18n Strings

Edit `src/App.jsx` → `t` object:
```javascript
const t = {
  eyebrow: 'Wuthering Waves Fan Site',
  title: 'DENIA GALLERY',
  galleryTitle: 'Fan Art Gallery',  // 第二个标题（图集副标题）
  artist: 'Artist',
  // ...
};
```

## Notes

- Gallery uses thumbnails for grid display, full images for lightbox
- Missing images fall back to generated SVG placeholder
- Drag positions persist in localStorage
- Language preference persists in localStorage
- Background image: `public/images/full/HEVHeRObYAwI-OI.jpg`

## Copyright

All artworks belong to original creators. This project is a non-profit personal fan project.
