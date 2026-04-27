# Denia Official Notes (Wuthering Waves 3.3)

Updated: 2026-04-26 (Asia/Shanghai)

## 1) Character Basics (officially presented in 3.3 materials)

- Character: Denia (达尼娅)
- Rarity: 5-star Resonator
- Attribute: Fusion
- Weapon: Rectifier

## 2) Version and Story Timing

- Version 3.3 update launch date: 2026-04-30
- Main Quest Chapter III Segue update mentioned in the same official material: 2026-05-21

## 3) Personality / Narrative Notes (official article wording paraphrased)

- Denia is described as elegant and warm in public contexts.
- The same official write-up also hints she has a hidden, unstable side.

## 4) Official Illustration Links Used In Site

These image links are embedded from the official 3.3 PlayStation Blog article page assets:

- https://live.staticflickr.com/65535/55199634126_4946af5407_h.jpg
- https://live.staticflickr.com/65535/55200039335_0eab3d67b3_h.jpg
- https://live.staticflickr.com/65535/55199882529_fca43ab474_h.jpg

## 5) Primary Sources

- PlayStation Blog (official 3.3 announcement article by Kuro Games global publishing lead):
  https://blog.playstation.com/2026/04/17/wuthering-waves-version-3-3-reverbs-from-the-end-of-galaxies-update-arrives-april-30/

- Official 3.3 video link embedded in that article:
  https://www.youtube.com/watch?v=SKLSDZGQHLQ

- Kurobbs Wiki profile page (used as layout-style reference for profile UI):
  https://wiki.kurobbs.com/mc/item/1478089902761410560

## 6) Source Link Maintenance In Code

- Official Art page links are configured in:
  `src/App.jsx` -> `OFFICIAL_ARTWORKS`
- Sources page links are configured in:
  `src/App.jsx` -> `renderSources()`

## 7) Notes For Your Multi-Source Image Workflow

- Put your collected full-size images (Pixiv / Kurobbs / Xiaohongshu / etc.) in:
  `public/images/full`
- Optional thumbnails go to:
  `public/images/thumbnails`
- If thumbnail is missing, current gallery logic falls back to full image automatically.

- Dataset is:
  `public/data/images.json`
  with fields like `full`, `thumbnail`, `tags`, `artist`, `pixivId`, `createdAt`.

- Tag indexing is supported even if you only keep full-size images, as long as tags exist in JSON.
