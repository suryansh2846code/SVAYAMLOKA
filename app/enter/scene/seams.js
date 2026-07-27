// ─────────────────────────────────────────────────────────────
//  THE VEIL SEAMS — deterministic, tree-like, fading into space.
//  A few trunks fan from an off-screen impact and cross the view.
//  Off each trunk grow branches, off each branch grow twigs — like a
//  tree / river delta. Crucially, brightness FADES ALONG each limb to
//  zero at its tip, so every fracture dissolves into the darkness
//  instead of stopping dead.
//
//  Per vertex: normalized distance from the impact (travelling light)
//  and a WEIGHT that tapers to 0 at the tips.
// ─────────────────────────────────────────────────────────────

const ORIGIN = [-13, -8]; // off-screen, bottom-left

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildSeams(seed = 7) {
  const rnd = mulberry32(seed);
  const pos = [];
  const raw = [];
  const wt = [];

  const dist = (x, y) => Math.hypot(x - ORIGIN[0], y - ORIGIN[1]);

  // add a path with a weight that eases from wStart (base) → wEnd (tip)
  const addPath = (pts, wStart, wEnd) => {
    const n = pts.length;
    const wAt = (i) => {
      const t = n > 1 ? i / (n - 1) : 0;
      // hold most of the weight, then fade the last stretch to the tip
      const fade = t < 0.55 ? 1 : 1 - (t - 0.55) / 0.45;
      return (wStart + (wEnd - wStart) * t) * fade;
    };
    for (let i = 0; i < n - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      pos.push(a[0], a[1], 0, b[0], b[1], 0);
      raw.push(dist(a[0], a[1]), dist(b[0], b[1]));
      wt.push(wAt(i), wAt(i + 1));
    }
  };

  // gentle organic limb: holds heading, small deviations
  const grow = (x, y, baseAng, len, wander) => {
    const step = 0.85;
    const steps = Math.max(3, Math.floor(len / step));
    const pts = [[x, y]];
    let px = x, py = y;
    for (let i = 0; i < steps; i++) {
      const a = baseAng + Math.sin(i * 0.5) * wander * 0.5 + (rnd() - 0.5) * wander;
      px += Math.cos(a) * step;
      py += Math.sin(a) * step;
      pts.push([px, py]);
    }
    return pts;
  };

  const headingAt = (pts, idx) => {
    const a = pts[Math.max(0, idx)];
    const b = pts[Math.min(pts.length - 1, idx + 1)];
    return Math.atan2(b[1] - a[1], b[0] - a[0]);
  };

  // grow children off a limb — like a tree, recursively. Each level is
  // smaller, thinner (fainter) and fades to nothing at its tip, so the
  // fracture keeps splitting into ever-finer veins that dissolve away.
  const LEN = [7, 4, 2.4, 1.4, 0.9];   // limb length by depth
  const branchOff = (pts, wBaseAtStart, depth) => {
    const n = pts.length;
    const nb = depth < 2 ? 3 + Math.floor(rnd() * 2) : 2 + Math.floor(rnd() * 2); // more, esp. early
    for (let k = 0; k < nb; k++) {
      const frac = 0.2 + rnd() * 0.65;
      const idx = Math.floor(frac * (n - 1));
      const p = pts[idx];
      const wHere = wBaseAtStart * (1 - frac * 0.4);
      const spread = 0.45 + rnd() * 0.6 + depth * 0.1;   // finer veins curl more
      const ang = headingAt(pts, idx) + (rnd() < 0.5 ? 1 : -1) * spread;
      const base = LEN[Math.min(depth, LEN.length - 1)];
      const len = base * (0.7 + rnd() * 0.6);
      const child = grow(p[0], p[1], ang, len, 0.28 + depth * 0.06);
      const cW = wHere * 0.68;             // each generation thinner (fainter)
      addPath(child, cW, 0.0);             // fades to nothing at the tip
      if (depth < 4 && rnd() < 0.85) branchOff(child, cW, depth + 1);
    }
  };

  // ── trunks fanning across the whole screen, then the tree grows ──
  // Trunks are brightest near the impact (the corner) and fade to
  // nothing at their far ends, so the mains dissolve into space too.
  const N = 6;
  for (let i = 0; i < N; i++) {
    const ang = 0.12 + (i / (N - 1)) * 1.28 + (rnd() - 0.5) * 0.1;
    const trunk = grow(ORIGIN[0], ORIGIN[1], ang, 30 + rnd() * 12, 0.16);
    addPath(trunk, 1.0, 0.0);              // main branch fades out into space
    branchOff(trunk, 0.85, 0);
  }

  // normalize distance across the visible span
  let maxD = 0, minD = Infinity;
  for (const d of raw) { if (d > maxD) maxD = d; if (d < minD) minD = d; }
  const distU = new Float32Array(raw.length);
  for (let i = 0; i < raw.length; i++) distU[i] = (raw[i] - minD) / (maxD - minD);

  return {
    positions: new Float32Array(pos),
    dist: distU,
    weight: new Float32Array(wt),
    vertexCount: raw.length,
  };
}
