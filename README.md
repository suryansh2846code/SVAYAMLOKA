# ॐ SVAYAMLOKA

> *a realm built by one hand*

An indie-game **portfolio-world** — not a plain website. Brutalist + maximalist design rooted in Indian culture & mythology, framed as a game you boot into and explore. Each character/guide is a facet of the maker's multidisciplinary work (art · code · play · words).

This is the **prologue**: a story-driven world-intro landing page. Regions, quests, and real projects come next.

## Stack
- [Next.js 15](https://nextjs.org/) (App Router, plain JS)
- No UI libraries — hand-built brutalist CSS, SVG mandalas, film-grain/scanline overlays

## Run it
```bash
npm install
npm run dev
```
Then open http://localhost:3000

## Make it yours
- **Text, lore & characters** live in [`app/site.config.js`](app/site.config.js) — the editable "save file".
- **Character art** → drop images in [`public/characters/`](public/characters/) and set each character's `art` field.
- The main experience (boot loader, HUD, roster, dialogue) is in [`app/World.js`](app/World.js); styling in [`app/globals.css`](app/globals.css).
- Remove the yellow **BUILD NOTE** banner in `app/World.js` before shipping.

---
built by one hand, with ♥ & chaos.
