"use client";

// ─────────────────────────────────────────────────────────────
//  SCENE 0.1 — THE VEIL OF CREATION
//  After a held silence: the heartbeat. The world shakes a breath.
//  For less than a second the veil between Nothingness and Memory
//  becomes transparent — reality distorts, hairline seams open and
//  light travels them, glyphs and the guardian are half-seen beneath
//  — then the veil heals and darkness returns.
//
//  Restraint is the point. The moment is the hero, not the seams.
//  Drives the shared `pulse`. One-shot; reload or ▶ replay to repeat.
// ─────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { gsap } from "gsap";
import { playThump, playWhisper, playDistantBell, playStoneResonance } from "./audio";
import { dev } from "./dev";

// The First Witness reveal — the darkness recedes CONTINUOUSLY down the
// centre body (crown → face → hands → torso → knees), and the arms flow
// in later but stay partly in shadow (like the legs). One smooth motion,
// no stops. Returns the time it ends.
function addReveal(tl, p, t0) {
  tl.to(p, { emerge: 0.9, duration: 5.4, ease: "sine.inOut" }, t0);            // body, seamless
  tl.to(p, { emergeArms: 0.55, duration: 2.6, ease: "sine.inOut" }, t0 + 3.2); // arms, later & partial
  return t0 + 6.5;
}

export default function PulseController({ woken, pulse, trigger = 0, revealTrigger = 0 }) {
  // ── "watch reveal" — replay just the First Witness on demand ──
  useEffect(() => {
    if (!revealTrigger) return;
    const p = pulse;
    const tl = gsap.timeline({ delay: 0.15 });
    // reset to a clean pre-reveal state, eyes already lit
    tl.set(p, {
      reveal: 0, fade: 1, open: 0, env: 0, shock: 0, shake: 0, seek: 0,
      text: 0, text2a: 0, text2b: 0, text3: 0, eyeGlow: 1, emerge: 0, emergeArms: 0,
    });
    tl.call(() => playStoneResonance(), null, 0.2);
    tl.to(p, { push: 1, duration: 8.0, ease: "sine.inOut" }, 0.3);
    const end = addReveal(tl, p, 0.6);
    tl.to(p, { text3: 1, duration: 2.0, ease: "power2.out" }, 3.0);
    tl.to(p, { push: 0, duration: 3.0 }, end + 2.0);
    return () => tl.kill();
  }, [revealTrigger, pulse]);

  return <PulseMain woken={woken} pulse={pulse} trigger={trigger} />;
}

function PulseMain({ woken, pulse, trigger = 0 }) {
  useEffect(() => {
    if (!woken) return;

    const p = pulse;
    const delay = trigger === 0 ? 3.0 : 0.3;
    const tl = gsap.timeline({ delay });

    // ── BLINK IN — sound, shake and veins strike together, from nowhere ──
    tl.call(() => playThump(), null, 0);
    tl.call(() => playWhisper(), null, 0);

    tl.fromTo(p, { shake: 0 }, { shake: 1, duration: 0.04, ease: "power4.out" }, 0);
    tl.to(p, { shake: 0, duration: 0.6, ease: "power3.out" }, 0.04);

    tl.set(p, { shock: 1 }, 0);
    tl.to(p, { shock: 0, duration: 0.8, ease: "power2.inOut" }, 0.08);

    // the veins snap into being (a blink) — corner → centre, but fast
    tl.set(p, { fade: 1 }, 0);
    tl.fromTo(p, { reveal: 0 }, { reveal: 1.12, duration: 0.18, ease: "power4.out" }, 0);
    tl.fromTo(p, { flash: 1.1 }, { flash: 0, duration: 0.35, ease: "power2.out" }, 0);

    // warm light washes into the void from the cracks
    tl.fromTo(p, { env: 0 }, { env: 1, duration: 0.22, ease: "power2.out" }, 0);

    // ── the guardian appears behind the veins ──
    tl.fromTo(p, { open: 0 }, { open: 1, duration: 0.45, ease: "power2.out" }, 0.18);

    // hold the impossible instant (brief)
    const exit = 1.15;

    // ── BLINK OUT — the whole network fades out smoothly, together ──
    tl.to(p, { fade: 0, duration: 0.4, ease: "power2.inOut" }, exit);
    tl.to(p, { open: 0, duration: 0.4, ease: "power2.inOut" }, exit);
    tl.to(p, { env: 0, duration: 0.6, ease: "power2.inOut" }, exit);
    // reset the network offscreen once it's fully dark (invisible)
    tl.set(p, { reveal: 0 }, exit + 0.7);

    // ═══ SCENE 0.2 — THE FIRST MEMORY ═══════════════════════════
    // Darkness has returned. Stillness. One mote strays to the centre.
    // Then a single line is remembered — it surfaces, holds, and sinks
    // back, leaving a one-frame seam-memory behind it.
    const s2 = exit + 2.0; // a held silence after the seams heal

    // the lone particle begins its slow drift inward (~1.5s before words)
    tl.set(p, { seek: 1 }, s2 - 1.5);

    // the words are remembered — surfacing from the dark
    tl.to(p, { text: 1, duration: 1.7, ease: "power2.out" }, s2);
    tl.call(() => playDistantBell(), null, s2 + 0.4); // a bell across impossible distance

    // hold in stillness, then darkness forgets it again
    const forget = s2 + 3.6;
    tl.to(p, { text: 0, duration: 1.8, ease: "power2.inOut" }, forget);

    // the mote settles back into ordinary drift; silence remains
    tl.set(p, { seek: 0 }, forget + 2.2);

    // ═══ SCENE 0.4 — THE SECOND MEMORY awakens the guardian ═══
    // The words come FIRST, row by row. Only then do his eyes ignite —
    // so the viewer feels the line itself awakened him.
    const s4 = forget + 4.0; // an uneasy silence after the first words

    // "…memory had"
    tl.call(() => playDistantBell(), null, s4);
    tl.to(p, { text2a: 1, duration: 1.3, ease: "power2.out" }, s4);
    // 0.8s pause → "already awakened."
    tl.to(p, { text2b: 1, duration: 1.3, ease: "power2.out" }, s4 + 2.1);

    // 0.5s pause → his eyes IGNITE: 1 → 2 → 5 → 8 → 10 → 20 → 40%, stop
    const ig = s4 + 3.9;
    tl.call(() => playDistantBell(), null, ig);
    tl.to(p, { eyeGlow: 0.025, duration: 0.9, ease: "none" }, ig);
    tl.to(p, { eyeGlow: 0.05, duration: 0.7, ease: "none" }, ig + 0.9);
    tl.to(p, { eyeGlow: 0.125, duration: 0.7, ease: "none" }, ig + 1.6);
    tl.to(p, { eyeGlow: 0.2, duration: 0.6, ease: "none" }, ig + 2.3);
    tl.to(p, { eyeGlow: 0.25, duration: 0.5, ease: "none" }, ig + 2.9);
    tl.to(p, { eyeGlow: 0.5, duration: 0.5, ease: "none" }, ig + 3.4);
    tl.to(p, { eyeGlow: 1.0, duration: 0.6, ease: "power2.in" }, ig + 3.9); // stop at ~40%

    // ═══ SCENE 0.4 — THE FIRST WITNESS ══════════════════════════
    // The eyes hold (~3s). Then a deep stone resonance, and the DARKNESS
    // RECEDES from him — top-down, uneven, never fully. The camera leans
    // in a slow 5-8%. Then he states a fact (not an introduction).
    const witness = ig + 3.9 + 3.0;
    tl.call(() => playStoneResonance(), null, witness - 0.3);
    // the previous line dissolves before the Witness speaks
    tl.to(p, { text2a: 0, text2b: 0, duration: 1.3, ease: "power2.inOut" }, witness - 0.4);
    tl.to(p, { push: 1, duration: 8.0, ease: "sine.inOut" }, witness);     // the lean-in
    addReveal(tl, p, witness);                                             // stepped: crown→…→arms
    tl.to(p, { text3: 1, duration: 2.0, ease: "power2.out" }, witness + 3.2);
    tl.call(() => playDistantBell(), null, witness + 4.4);
    // hold the (partly) revealed Witness — ~25% stays in darkness. Chapter
    // 0.5 (the name + the gate) continues from here.

    return () => tl.kill();
  }, [woken, pulse, trigger]);

  return null;
}
