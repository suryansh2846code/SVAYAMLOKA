"use client";

// Starts the ambient drone on the first gesture (the world wakes when
// the visitor arrives — no button). Uses the shared audio manager,
// which prefers a real file and falls back to synthesis.

import { useEffect } from "react";
import { primeAudio, startDrone } from "./audio";

export function useDrone({ enabled = true, target = 0.045 } = {}) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let stop = null;

    const begin = () => {
      if (stop) return;
      primeAudio();               // load files (if any) into the shared ctx
      stop = startDrone({ target });
      remove();
    };

    const remove = () => {
      window.removeEventListener("pointermove", begin);
      window.removeEventListener("pointerdown", begin);
      window.removeEventListener("keydown", begin);
      window.removeEventListener("touchstart", begin);
    };

    window.addEventListener("pointermove", begin);
    window.addEventListener("pointerdown", begin);
    window.addEventListener("keydown", begin);
    window.addEventListener("touchstart", begin);

    return () => {
      remove();
      if (stop) stop();
    };
  }, [enabled, target]);
}
