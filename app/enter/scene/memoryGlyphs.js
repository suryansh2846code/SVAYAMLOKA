// ─────────────────────────────────────────────────────────────
//  THE PATTERNS OF REMEMBRANCE — the first language of Swayamlok.
//  Original "memory glyphs": flowing cloud-curls + yantra geometry
//  + calligraphic flow + rune marks, abstracted into something that
//  belongs only to this world. These same strokes return later as
//  puzzle symbols, so the flash is a first glimpse of a language the
//  visitor will slowly learn.
//
//  Each generator returns an array of strokes; each stroke is an
//  array of [x, y] points in local space (roughly -1..1).
// ─────────────────────────────────────────────────────────────

const TAU = Math.PI * 2;

const arc = (cx, cy, r, a0, a1, steps = 24) => {
  const p = [];
  for (let i = 0; i <= steps; i++) {
    const a = a0 + (a1 - a0) * (i / steps);
    p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return p;
};

const spiral = (cx, cy, r0, r1, turns, steps = 64) => {
  const p = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * TAU * turns;
    const r = r0 + (r1 - r0) * t;
    p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return p;
};

const wave = (x0, x1, y, amp, waves, steps = 48) => {
  const p = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    p.push([x0 + (x1 - x0) * t, y + Math.sin(t * TAU * waves) * amp]);
  }
  return p;
};

const ring = (r, rot = 0, sides = 48) => {
  const p = [];
  for (let i = 0; i <= sides; i++) {
    const a = rot + (i / sides) * TAU;
    p.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return p;
};

// ── the glyph forms ──

// flowing cloud scroll — curl + trailing lobes (云纹 abstracted)
function cloudScroll() {
  return [
    spiral(0.35, 0.18, 0.72, 0.05, 1.5),
    arc(-0.32, -0.08, 0.44, Math.PI * 0.05, Math.PI * 1.15),
    arc(-0.74, -0.12, 0.3, 0, Math.PI * 1.25),
    wave(-1.05, 0.55, -0.5, 0.1, 1.5),
  ];
}

// circular yantra — rings, interlocking triangles, spokes
function yantra() {
  const s = [ring(0.9), ring(0.52), ring(0.75, 0, 3), ring(0.75, Math.PI, 3)];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    s.push([[0, 0], [Math.cos(a) * 0.9, Math.sin(a) * 0.9]]);
  }
  return s;
}

// horizontal cloud band — scalloped line ending in a curl
function cloudLine() {
  const s = [];
  for (let i = 0; i < 3; i++) s.push(arc(-0.7 + i * 0.7, 0, 0.34, Math.PI, 0, 16));
  s.push([[-1.05, 0], [1.05, 0]]);
  s.push(spiral(1.0, 0.02, 0.26, 0.02, 1.1, 40));
  return s;
}

// cluster of tiny runes — before words, before Sanskrit
function runes() {
  const s = [];
  const marks = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < marks; i++) {
    const x = -0.6 + i * (1.2 / marks);
    if (Math.random() < 0.5) s.push([[x, -0.4], [x, 0.4]]);
    else s.push([[x - 0.12, -0.32], [x + 0.12, 0], [x - 0.12, 0.32]]);
    if (Math.random() < 0.4) s.push([[x - 0.09, 0.52], [x + 0.09, 0.52]]);
  }
  return s;
}

// lotus / temple-carving rosette
function lotus() {
  const s = [ring(0.24, 0, 32)];
  const petals = 6;
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * TAU;
    const cx = Math.cos(a) * 0.42;
    const cy = Math.sin(a) * 0.42;
    s.push(arc(cx, cy, 0.3, a + Math.PI * 0.6, a + Math.PI * 1.4, 14));
  }
  return s;
}

// astronomical diagram — orbit ring + nodes + crossing chord
function orbit() {
  const s = [ring(0.95, 0, 60)];
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU + 0.4;
    s.push(arc(Math.cos(a) * 0.95, Math.sin(a) * 0.95, 0.08, 0, TAU, 10));
  }
  s.push([[-0.9, -0.3], [0.9, 0.3]]);
  s.push(ring(0.4, 0.3, 48));
  return s;
}

// weighted toward cloud forms, so the field feels like drifting memory
const GENERATORS = [cloudScroll, cloudScroll, cloudLine, cloudLine, yantra, lotus, runes, orbit];

export function randomGlyph() {
  return GENERATORS[Math.floor(Math.random() * GENERATORS.length)]();
}
