"use client";

// Remembered lines, lower-middle, like inscriptions. Each letter is
// *remembered* in turn — a soft, staggered surfacing (opacity + blur).
// `field` may be a single pulse key (one reveal flowing across all rows)
// OR an array of keys, one per row (each row timed independently).

import { useEffect, useMemo, useRef } from "react";
import styles from "../enter.module.css";
import { dev } from "./dev";

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function Narration({ pulse, rows, field, holdKey }) {
  const spansRef = useRef([]);

  const model = useMemo(() => {
    const perRow = Array.isArray(field);
    let gi = 0;
    const rws = rows.map((row, ri) => {
      const chars = [...row];
      const f = perRow ? field[ri] : field;
      return chars.map((ch, li) => ({ ch, gi: gi++, li, n: chars.length, f }));
    });
    return { rws, total: gi, perRow };
  }, [rows, field]);

  useEffect(() => {
    let raf;
    const spread = 0.72;
    const charDur = 0.35;
    const n = model.total;
    const held = () => holdKey && dev[holdKey];

    const loop = () => {
      const spans = spansRef.current;
      model.rws.forEach((row) => {
        row.forEach((c) => {
          const el = spans[c.gi];
          if (!el) return;
          const t = held() ? 1 : Math.max(0, Math.min(1, pulse[c.f] || 0));
          const start = model.perRow
            ? (c.li / Math.max(1, c.n - 1)) * spread   // stagger within the row
            : (c.gi / Math.max(1, n - 1)) * spread;    // stagger across all rows
          const lt = smooth(start, start + charDur, t);
          el.style.opacity = String(lt);
          el.style.filter = `blur(${(1 - lt) * 4}px)`;
        });
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pulse, model, holdKey]);

  return (
    <div className={styles.narration} aria-hidden="true">
      {model.rws.map((row, ri) => (
        <p className={styles.line} key={ri}>
          {row.map((c) => (
            <span
              key={c.gi}
              className={styles.char}
              ref={(el) => (spansRef.current[c.gi] = el)}
            >
              {c.ch === " " ? " " : c.ch}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
