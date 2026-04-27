# CLAUDE.md

This file provides coding guidance for the Wuthering Waves Denia personal fan website repository.

## Project Overview

**Denia Personal Website** — A fan-made gallery and information site for Denia (达妮娅), a 5-star Fusion Resonator from Wuthering Waves Version 3.3.

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
```

## Project Structure

```text
.
├─ CLAUDE.md                     # This file - development guidelines
├─ README.md                     # User-facing project documentation
├─ DENIA_OFFICIAL_NOTES.md       # Character information and official sources
├─ index.html                    # HTML entry point
├─ package.json                  # Dependencies and scripts
├─ package-lock.json             # Locked dependency versions
├─ vite.config.js                # Vite configuration
├─ .github/workflows/deploy.yml  # CI/CD deployment workflow
├─ public/
│  ├─ data/
│  │  └─ images.json             # Gallery image metadata (search/filter index)
│  └─ images/
│     └─ full/                   # Full-size gallery images (Pixiv/Kurobbs/etc.)
└─ src/
   ├─ App.jsx                    # Main app component with all page sections
   ├─ main.jsx                   # React entry point
   └─ styles.css                 # Global styles, theme variables, responsive layout
```

## Folder Roles

| Path | Purpose |
|------|---------|
| `src/main.jsx` | React application bootstrap |
| `src/App.jsx` | Main app with Home/Profile/Story/Gallery/Official Art/Sources pages |
| `src/styles.css` | Theme CSS variables, responsive grid, animations |
| `public/images/full/` | Collected full-size fanart images |
| `public/data/images.json` | Gallery index with tags, artist, Pixiv ID metadata |

## Data Model

Gallery items in `public/data/images.json`:

```json
{
  "full": "143518930_p0.jpg",
  "artist": "Unknown",
  "pixivId": "pending-143518930",
  "tags": ["denia", "fanart"],
  "createdAt": "2026-04-26"
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `full` | string | Image filename in `public/images/full/` |
| `artist` | string | Artist name (shown in gallery card) |
| `pixivId` | string | Pixiv artwork ID or pending identifier |
| `tags` | array | Tags for filtering (include "denia" + relevant tags) |
| `createdAt` | string | ISO date string (YYYY-MM-DD) |

## Component Architecture

### App.jsx Exports

- `OFFICIAL_INFO` — Character basic info constants
- `OFFICIAL_ARTWORKS` — Array of official artwork images with source links
- `PROFILE_ARCHIVE` — Character profile data structure
- `App` — Default export, main application component

### Page Sections

1. **Home** — Welcome message, character snapshot, version timeline
2. **Profile** — Character archive card with stats table
3. **Story** — Version 3.3 timeline and narrative notes
4. **Gallery** — Draggable, filterable image grid with lightbox
5. **Official Art** — Official PlayStation Blog artwork board
6. **Sources** — External link references

### Key UI Components

- `ZoomableImage` — Pinch/drag zoomable image viewer (for lightbox)
- Draggable gallery cards with touch/mouse pointer events

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

1. Place image file in `public/images/full/`
2. Add entry to `public/data/images.json`:
   ```json
   {
     "full": "your-image.jpg",
     "artist": "Artist Name",
     "pixivId": "12345678",
     "tags": ["denia", "fanart", "tag2"],
     "createdAt": "2026-04-28"
   }
   ```

### Updating Official Links

Edit `src/App.jsx`:
- `OFFICIAL_ARTWORKS` array — Add/remove official artwork entries
- `renderSources()` function — Update external reference links

### Character Info Updates

Edit `src/App.jsx` → `OFFICIAL_INFO` constant:
```javascript
const OFFICIAL_INFO = {
  name: 'Denia',
  cnName: 'Da Ni Ya',
  rarity: '5-Star Resonator',
  element: 'Fusion',
  weapon: 'Rectifier',
  // ...
};
```

## Current Features

- **Tag filtering** — Filter gallery by artist or tags
- **Search** — Search by artist name, Pixiv ID, or tags
- **Sorting** — Default, Artist A-Z, Pixiv ID Desc, Latest Date
- **Draggable cards** — Touch and mouse pointer drag support
- **Lightbox viewer** — Keyboard navigation (Arrow keys, Escape)
- **Responsive** — Mobile-first breakpoints (700px, 980px)
- **Music player** — NetEase Music embedded player

## Notes

- Gallery reads directly from `full` field; thumbnails are optional
- Missing images fall back to generated SVG placeholder
- Official art and Sources links maintained in `src/App.jsx`
- Background image uses `public/images/full/HEVHeRObYAwI-OI.jpg`

## Copyright

All artworks belong to original creators. This project is for fan showcase and non-commercial learning use only.
