"use client";

// Small scroll helpers built on GSAP ScrollTrigger.
//  useReveal  → fade/slide a group of elements up as they enter view
//  useParallax → move an element on the Y axis relative to scroll

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "./motion";

// Reveal every element matching `selector` inside the returned ref.
export function useReveal(selector = "[data-reveal]") {
  const scope = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !scope.current) return;
    registerGsap();

    const ctx = gsap.context(() => {
      gsap.utils.toArray(selector).forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    }, scope);

    return () => ctx.revert();
  }, [selector]);

  return scope;
}

// Parallax any element that has [data-depth="0.2"] inside the ref.
// depth 0 = static, higher = moves more. Negative = opposite direction.
export function useParallax() {
  const scope = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !scope.current) return;
    registerGsap();

    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-depth]").forEach((el) => {
        const depth = parseFloat(el.dataset.depth) || 0;
        gsap.to(el, {
          yPercent: -depth * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("[data-parallax-stage]") || el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  return scope;
}
