# Character art goes here

Drop your own images in this folder, e.g. `naga.png`, `cartographer.png`.

Then open `app/site.config.js` and point each character's `art` field at it:

```js
{
  id: "01",
  name: "THE CARTOGRAPHER",
  art: "/characters/cartographer.png",   // <- was null
  ...
}
```

Tips for the indie-game look:
- Square-ish images look best in the card frames (they're `1:1`).
- Pixel art / hand-drawn / high-contrast illustrations suit the brutalist frames.
- PNG with transparency works great — the striped frame shows through.
- Big files are fine, but export ~1000px for speed.
