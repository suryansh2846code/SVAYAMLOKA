"use client";

// Tuned config for the void — the scene components read these each
// frame. These are the locked-in Scene 0.1 values (the dev control
// panel has been removed now that the look is dialled in).

export const dev = {
  // veil (Scene 0.1) — restrained; the light IS the seam
  seamBright: 0.45,      // brightness of the luminous seams
  guardianAmount: 0.18,  // how perceptible the guardian is behind the membrane
  fillDuration: 0.9,     // (reserved) seam travel time
  veilOpen: 1.0,         // preview: membrane openness when "hold visible"
  preview: false,        // HOLD the seams lit so you can study them

  // the living flow — bright pulses travelling inside the fractures
  flowSpeed: 0.5,        // how fast the pulses travel
  flowFreq: 2.2,         // how many pulses along a seam
  flowStrength: 1.0,     // how bright the travelling pulses are

  // dust
  dustOpacity: 0.5,
  dustSize: 0.09,

  // world
  shake: 0.6,

  // replay counter (bumped by the Replay button)
  replay: 0,
};
