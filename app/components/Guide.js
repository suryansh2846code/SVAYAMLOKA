"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion";

// A realm's guide: portrait (or glyph placeholder) + a typewriter greeting.
// The typewriter only runs once the guide scrolls into view.
export default function Guide({ character }) {
  const { name, domain, realm, glyph, art, accent, greeting, stats } = character;
  const [txt, setTxt] = useState(prefersReducedMotion() ? greeting : "");
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || started || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTxt(greeting.slice(0, i));
      if (i >= greeting.length) clearInterval(id);
    }, 24);
    return () => clearInterval(id);
  }, [started, greeting]);

  return (
    <div className="guide" ref={ref}>
      <div className="guide__portrait" style={{ "--accent": `var(${accent})` }}>
        {art ? (
          <img src={art} alt={name} />
        ) : (
          <span className="guide__glyph">{glyph}</span>
        )}
        <span className="guide__realm">{realm}</span>
      </div>

      <div className="guide__panel">
        <span className="guide__domain">{domain}</span>
        <h3 className="guide__name">{name}</h3>
        <p className="guide__say">
          {txt}
          <span className="caret">▌</span>
        </p>
        <div className="guide__stats">
          {Object.entries(stats).map(([k, v]) => (
            <div className="stat" key={k}>
              <span className="stat__k">{k}</span>
              <span className="stat__bar">
                <i style={{ width: `${v}%`, background: `var(${accent})` }} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
