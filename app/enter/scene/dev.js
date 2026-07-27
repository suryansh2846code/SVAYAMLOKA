"use client";

// Live-tunable config for the void. The control panel (leva, wired in
// Chapter0) writes here; the scene components read it every frame.
// Tune in the panel, then hit "log settings" and paste me the numbers.

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
