"use client";

// ─────────────────────────────────────────────────────────────
//  Audio for the void — one shared Web Audio context.
//
//  It PREFERS your real samples in /public/audio and FALLS BACK to
//  live synthesis if a file is missing, so the experience always
//  works and simply upgrades the moment you drop files in:
//
//    public/audio/drone.(mp3|ogg|wav)   ← looping ambient drone
//    public/audio/thump.(mp3|ogg|wav)   ← the pulse strike / bell
//
//  Created lazily and resumed on the first gesture (autoplay policy).
// ─────────────────────────────────────────────────────────────

let ctx = null;
const buffers = { drone: null, thump: null, whisper: null };
let priming = null;

const CANDIDATES = {
  drone: ["/audio/drone.mp3", "/audio/drone.ogg", "/audio/drone.wav"],
  thump: ["/audio/thump.mp3", "/audio/thump.ogg", "/audio/thump.wav"],
  whisper: ["/audio/whisper.mp3", "/audio/whisper.ogg", "/audio/whisper.wav"],
};

export function getCtx() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

async function decodeFirst(context, urls) {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const arr = await res.arrayBuffer();
      return await context.decodeAudioData(arr);
    } catch {
      /* try next */
    }
  }
  return null;
}

// Kick off file loading (safe to call repeatedly). Call on wake.
export function primeAudio() {
  const context = getCtx();
  if (!context || priming) return priming;
  priming = (async () => {
    buffers.drone = await decodeFirst(context, CANDIDATES.drone);
    buffers.thump = await decodeFirst(context, CANDIDATES.thump);
    buffers.whisper = await decodeFirst(context, CANDIDATES.whisper);
  })();
  return priming;
}

// ── DRONE ── file (looped) if available, else synthesized ──
export function startDrone({ target = 0.045 } = {}) {
  const context = getCtx();
  if (!context) return () => {};
  const nodes = [];

  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.exponentialRampToValueAtTime(target, context.currentTime + 6);
  master.connect(context.destination);
  nodes.push(master);

  if (buffers.drone) {
    const src = context.createBufferSource();
    src.buffer = buffers.drone;
    src.loop = true;
    src.connect(master);
    src.start();
    nodes.push(src);
  } else {
    // synth fallback: two detuned lows + faint shimmer + breathing LFO
    const lp = context.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 130;
    lp.Q.value = 0.7;
    lp.connect(master);
    nodes.push(lp);

    [55, 55.4].forEach((f) => {
      const osc = context.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const g = context.createGain();
      g.gain.value = 0.6;
      osc.connect(g); g.connect(lp); osc.start();
      nodes.push(osc, g);
    });

    const air = context.createOscillator();
    air.type = "triangle";
    air.frequency.value = 174;
    const airGain = context.createGain();
    airGain.gain.value = 0.015;
    air.connect(airGain); airGain.connect(master); air.start();
    nodes.push(air, airGain);

    const lfo = context.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = context.createGain();
    lfoGain.gain.value = target * 0.4;
    lfo.connect(lfoGain); lfoGain.connect(master.gain); lfo.start();
    nodes.push(lfo, lfoGain);
  }

  return () => {
    nodes.forEach((n) => {
      try { n.stop && n.stop(); } catch {}
      try { n.disconnect(); } catch {}
    });
  };
}

// ── THE THUMM ── file if available, else synthesized ──
export function playThump() {
  const context = getCtx();
  if (!context) return;

  if (buffers.thump) {
    const src = context.createBufferSource();
    src.buffer = buffers.thump;
    const g = context.createGain();
    g.gain.value = 0.9;
    src.connect(g); g.connect(context.destination);
    src.start();
    return;
  }

  // synth fallback: an ancient bell struck from millions of km away —
  // sub-bass drop + inharmonic metallic partials with long decay.
  const t = context.currentTime;
  const bus = context.createGain();
  bus.gain.value = 0.9;
  bus.connect(context.destination);

  const lp = context.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 900;
  lp.Q.value = 0.6;
  lp.connect(bus);

  const sub = context.createOscillator();
  sub.type = "sine";
  sub.frequency.setValueAtTime(78, t);
  sub.frequency.exponentialRampToValueAtTime(34, t + 0.6);
  const subGain = context.createGain();
  subGain.gain.setValueAtTime(0.0001, t);
  subGain.gain.exponentialRampToValueAtTime(0.5, t + 0.03);
  subGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
  sub.connect(subGain); subGain.connect(bus);
  sub.start(t); sub.stop(t + 1.8);

  [174, 262, 393, 541, 733].forEach((f, i) => {
    const osc = context.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    const g = context.createGain();
    const peak = 0.05 / (i + 1);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2 + i * 0.15);
    osc.connect(g); g.connect(lp);
    osc.start(t); osc.stop(t + 2.6 + i * 0.15);
  });
}

// ── THE WHISPER ── thousands of voices speaking one syllable, so quiet
//    the visitor isn't sure they heard it. File if available, else a
//    hush of filtered noise with a slow formant sweep.
export function playWhisper() {
  const context = getCtx();
  if (!context) return;

  if (buffers.whisper) {
    const src = context.createBufferSource();
    src.buffer = buffers.whisper;
    const g = context.createGain();
    g.gain.value = 0.25;
    src.connect(g); g.connect(context.destination);
    src.start();
    return;
  }

  const t = context.currentTime;
  const dur = 1.4;
  const noise = context.createBuffer(1, Math.floor(context.sampleRate * dur), context.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const src = context.createBufferSource();
  src.buffer = noise;

  const g = context.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.02, t + 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  g.connect(context.destination);

  // two vowel-like formants sweeping down — a collective hush
  [[520, 6], [1080, 8]].forEach(([f, q]) => {
    const bp = context.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(f, t);
    bp.frequency.linearRampToValueAtTime(f * 0.7, t + dur);
    bp.Q.value = q;
    src.connect(bp); bp.connect(g);
  });

  src.start(t);
  src.stop(t + dur);
}

// ── A DISTANT BELL ── a temple bell heard across impossible distances:
//    faint, high, inharmonic, long decay. Used sparingly in Scene 0.2.
export function playDistantBell() {
  const context = getCtx();
  if (!context) return;
  const t = context.currentTime;

  const bus = context.createGain();
  bus.gain.value = 0.5;
  bus.connect(context.destination);

  const lp = context.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 2600;
  lp.connect(bus);

  [1046, 1567, 2093].forEach((f, i) => {
    const osc = context.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f * (1 + (Math.random() - 0.5) * 0.008);
    const g = context.createGain();
    const peak = 0.012 / (i + 1);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.0 + i * 0.4);
    osc.connect(g); g.connect(lp);
    osc.start(t); osc.stop(t + 3.4 + i * 0.4);
  });
}

// ── STONE RESONANCE ── an ancient stone door moving somewhere beyond
//    existence: a very low, slow swell with a grinding low-mid body.
//    Plays once as the darkness recedes from the guardian.
export function playStoneResonance() {
  const context = getCtx();
  if (!context) return;
  const t = context.currentTime;
  const dur = 6.5;

  const bus = context.createGain();
  bus.gain.setValueAtTime(0.0001, t);
  bus.gain.exponentialRampToValueAtTime(0.08, t + 2.0); // slow swell in
  bus.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  bus.connect(context.destination);

  const lp = context.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 220;
  lp.Q.value = 0.8;
  lp.connect(bus);

  // deep body — two detuned low saws ground through the lowpass
  [30, 30.5, 46].forEach((f) => {
    const osc = context.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = f;
    const g = context.createGain();
    g.gain.value = 0.5;
    osc.connect(g); g.connect(lp);
    osc.start(t); osc.stop(t + dur);
  });

  // a faint grinding texture (filtered noise), like stone on stone
  const noise = context.createBuffer(1, Math.floor(context.sampleRate * dur), context.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
  const src = context.createBufferSource();
  src.buffer = noise;
  const bp = context.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 90;
  bp.Q.value = 2;
  const ng = context.createGain();
  ng.gain.value = 0.25;
  src.connect(bp); bp.connect(ng); ng.connect(lp);
  src.start(t); src.stop(t + dur);
}
