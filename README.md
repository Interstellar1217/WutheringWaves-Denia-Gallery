# Denia Gallery - Wuthering Waves Fan Site

鸣潮 3.3 达尼娅同人图集 - 非盈利个人爱好项目

## Live Site

https://interstellar1217.github.io/WutheringWaves-Denia-Gallery/

## Tech Stack

- React 18 + Vite 5
- Plain CSS
- GitHub Pages (auto-deploy via Actions)

## Quick Start

```bash
npm install
npm run dev
```

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build
npm run thumbs           # Generate thumbnails (requires sharp)
```

## Project Structure

```
.
├─ public/
│  ├─ data/
│  │  └─ images.json             # Gallery metadata
│  └─ images/
│     ├─ full/                   # Original images
│     └─ thumbs/                 # Auto-generated thumbnails
├─ src/
│  ├─ App.jsx                    # Main component
│  ├─ main.jsx                   # Entry point
│  └─ styles.css                 # Global styles
└─ scripts/
   └─ generate-thumbnails.js     # Thumbnail generator
```

## Data Format

`public/data/images.json`:

```json
{
  "full": "143518930_p0.jpg",
  "thumbnail": "thumbs/143518930_p0_thumb.webp",
  "artistId": "113703823",
  "tags": ["denia", "fanart"],
  "createdAt": "2026-04-28"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `full` | Yes | Image filename in `public/images/full/` |
| `thumbnail` | Yes | Thumbnail filename in `public/images/thumbs/` |
| `artistId` | No | Pixiv user ID (auto-links to `https://www.pixiv.net/users/{id}`) |
| `tags` | Yes | Must include "denia" + relevant tags |
| `createdAt` | Yes | ISO date (YYYY-MM-DD) |

### Pixiv ID Detection

- **Digit-prefixed** (e.g., `143518930_p0.jpg`) → Auto-extracts Pixiv artwork ID
- **Letter-prefixed** (e.g., `HEVHeRObYAwI-OI.jpg`) → Treated as official/other

## Deployment

Push to `main` branch → GitHub Actions builds and deploys to GitHub Pages automatically.

## Copyright

All artworks belong to their respective creators. This is a non-profit personal fan project.

For copyright inquiries: https://github.com/Interstellar1217
