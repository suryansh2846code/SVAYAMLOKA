"use client";

// ─────────────────────────────────────────────────────────────
//  Motion spine: Lenis smooth-scroll wired into GSAP ScrollTrigger.
//  This is what makes the world feel like an experience you move
//  through, not a page you scroll. Respects prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Register the plugin once, on the client.
export function registerGsap() {
  if (typeof window === "undefined") return;
  if (!gsap.core.globals().ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }
}

// Boot Lenis smooth scroll and keep ScrollTrigger in sync with it.
export function useSmoothScroll() {
  useEffect(() => {
    registerGsap();

    // Reduced motion: skip Lenis entirely, let native scroll run.
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // ScrollTrigger measurements can change once fonts/images load.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      lenis.destroy();
    };
  }, []);
}

export { gsap, ScrollTrigger, prefersReducedMotion };
