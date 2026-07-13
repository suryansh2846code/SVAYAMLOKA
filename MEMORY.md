# 🧠 MEMORY.md — SVAYAMLOKA project notes

Living context for this repo: what it is, decisions made, and what's next.
Keep this updated as the world grows.

## The vision
An indie-game **world**, not a plain portfolio site. You boot into it and explore.
- **Aesthetic:** brutalism + maximalism.
- **Roots:** Indian culture & mythology (Devanagari accents, mandalas, sindoor/marigold/indigo/peacock palette, ॐ motifs).
- **Concept:** a whole world with a story and MULTIPLE characters/guides — each guide = a facet of the maker.
- **Field:** multidisciplinary (art · code · play · words).
- **Built by one hand.**

## Current state — PROLOGUE (2026-07-13)
Delivered: a story-driven **world-intro landing page** only.
- Boot/loading screen → HUD bar → hero/title with PRESS START → lore panel ("THE MYTH") → character-guide roster (4 placeholders) → typewriter NPC dialogue → footer.

## Where things live
| What | File |
|------|------|
| Editable content (world name, lore, characters, ticker) | `app/site.config.js` |
| Main experience (boot, HUD, tickers, mandalas, roster, dialogue) | `app/World.js` |
| Styling (brutalist CSS, textures, keyframes) | `app/globals.css` |
| Character art drop-zone | `public/characters/` |
| Layout / metadata | `app/layout.js` |

## Decisions
- **Next.js 15** App Router, **plain JS** (no TypeScript), **no UI libraries** — hand-built CSS.
- Fonts via CSS `@import` with system fallbacks, so it degrades gracefully offline.
- Character art is **user-supplied**; cards show brutalist placeholder frames until `art` is set.
- Avoid swastika-style glyphs (auspicious in Indian tradition but too easily misread) — use Devanagari letters instead.
- Git commits: **no "Co-Authored-By" trailer**.

## Roadmap / next steps
- [ ] Replace `YOUR NAME` in `app/site.config.js` with real name + role.
- [ ] Add real character art to `public/characters/`.
- [ ] Build out each guide into a full **region/section** (real projects framed as "quests").
- [ ] Add **world-map navigation** between regions.
- [ ] Remove the yellow BUILD NOTE banner in `app/World.js` before shipping.
- [ ] Deploy (Vercel).
