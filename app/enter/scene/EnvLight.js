"use client";

// Environmental light. When the cracks come, warm light washes into the
// void from the impact corner — as if the seams are casting light into
// the space around them. Driven by pulse.env (0..1). Screen-blended,
// subtle, so it lifts the darkness rather than flooding it.

import { useEffect, useRef } from "react";
import styles from "../enter.module.css";

export default function EnvLight({ pulse }) {
  const ref = useRef();
  useEffect(() => {
    let raf;
    const loop = () => {
      if (ref.current) {
        const e = Math.max(0, Math.min(1, pulse.env || 0));
        ref.current.style.opacity = String(e * 0.16);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pulse]);

  return <div className={styles.envlight} ref={ref} aria-hidden="true" />;
}
