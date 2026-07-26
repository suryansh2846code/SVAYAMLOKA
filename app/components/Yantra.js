"use client";

// The YANTRA HUB — an interactive mandala that maps the realms.
// Each guide sits on a spoke; clicking one smooth-scrolls to that
// realm. This is the "world map" that makes it feel navigable.
export default function Yantra({ characters, onSelect }) {
  const n = characters.length;
  const R = 128; // radius the nodes sit on

  return (
    <div className="yantra">
      <svg className="yantra__web" viewBox="0 0 320 320" aria-hidden="true">
        <circle cx="160" cy="160" r="150" className="yantra__ring" />
        <circle cx="160" cy="160" r="112" className="yantra__ring" />
        <circle cx="160" cy="160" r="60" className="yantra__ring" />
        {characters.map((_, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          return (
            <line
              key={i}
              x1="160" y1="160"
              x2={160 + Math.cos(a) * 150}
              y2={160 + Math.sin(a) * 150}
              className="yantra__spoke"
            />
          );
        })}
      </svg>

      <div className="yantra__core">
        <span className="yantra__om">ॐ</span>
        <span className="yantra__hint">choose a realm</span>
      </div>

      {characters.map((c, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + (Math.cos(a) * R) / 3.2; // percent positions
        const y = 50 + (Math.sin(a) * R) / 3.2;
        return (
          <button
            key={c.id}
            className="yantra__node"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              "--accent": `var(${c.accent})`,
            }}
            onClick={() => onSelect(c.id)}
          >
            <span className="yantra__glyph">{c.glyph}</span>
            <span className="yantra__label">{c.realm}</span>
            <span className="yantra__domain">{c.domain}</span>
          </button>
        );
      })}
    </div>
  );
}
