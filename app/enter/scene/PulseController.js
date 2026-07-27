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
import { playThump, playWhisper } from "./audio";
import { dev } from "./dev";

export default function PulseController({ woken, pulse, trigger = 0 }) {
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
    tl.fromTo(p, { reveal: 0 }, { reveal: 1.12, duration: 0.18, ease: "power4.out" }, 0);
    tl.fromTo(p, { flash: 1.1 }, { flash: 0, duration: 0.35, ease: "power2.out" }, 0);

    // ── the guardian appears behind the veins ──
    tl.fromTo(p, { open: 0 }, { open: 1, duration: 0.45, ease: "power2.out" }, 0.18);

    // hold the impossible instant (brief)
    const exit = 1.15;

    // ── BLINK OUT — another flash, then everyone is gone ──
    tl.to(p, { flash: 0.9, duration: 0.05, ease: "power2.out" }, exit);
    tl.to(p, { flash: 0, duration: 0.3, ease: "power2.out" }, exit + 0.05);
    tl.to(p, { reveal: 0, duration: 0.22, ease: "power3.in" }, exit);      // veins blink out
    tl.to(p, { open: 0, duration: 0.28, ease: "power2.in" }, exit + 0.04); // guardian gone

    return () => tl.kill();
  }, [woken, pulse, trigger]);

  return null;
}
