"use client";

import { useEffect, useRef, useState } from "react";
import { world, characters, ticker } from "./site.config";

/* ─── decorative mandala / chakra (pure SVG, no assets) ─── */
function Mandala({ className, spokes = 24 }) {
  const rays = Array.from({ length: spokes }, (_, i) => {
    const a = (i / spokes) * Math.PI * 2;
    return (
      <line
        key={i}
        x1={100} y1={100}
        x2={100 + Math.cos(a) * 96} y2={100 + Math.sin(a) * 96}
        stroke="currentColor" strokeWidth="2"
      />
    );
  });
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="100" cy="100" r="42" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="100" cy="100" r="14" fill="currentColor" />
      {rays}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <circle key={`p${i}`} cx={100 + Math.cos(a) * 70} cy={100 + Math.sin(a) * 70} r="6"
            fill="none" stroke="currentColor" strokeWidth="2" />
        );
      })}
    </svg>
  );
}

/* ─── boot / loading screen ─── */
function Boot({ done }) {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 18 + 6;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
        setTimeout(() => setGone(true), 400);
        setTimeout(done, 850);
      }
      setPct(Math.min(100, Math.round(p)));
    }, 220);
    return () => clearInterval(id);
  }, [done]);

  return (
    <div className={`boot ${gone ? "gone" : ""}`}>
      <div className="boot__om">ॐ</div>
      <div className="boot__label">summoning {world.name}…</div>
      <div className="boot__bar"><div className="boot__fill" style={{ width: `${pct}%` }} /></div>
      <div className="boot__pct">{pct}% · loading assets, gods & bad decisions</div>
    </div>
  );
}

/* ─── scrolling ticker ─── */
function Ticker({ reverse }) {
  const items = [...ticker, ...ticker];
  return (
    <div className={`ticker ${reverse ? "ticker--reverse" : ""}`}>
      <div className="ticker__track">
        {items.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

/* ─── top HUD ─── */
function Hud() {
  return (
    <div className="hud">
      <div className="hud__cell hud__cell--brand">{world.name}</div>
      <div className="hud__cell">
        CRAFT
        <span className="hud__meter"><i style={{ width: "88%", background: "var(--teal)" }} /></span>
      </div>
      <div className="hud__cell">
        CHAOS
        <span className="hud__meter"><i style={{ width: "72%", background: "var(--vermillion)" }} /></span>
      </div>
      <div className="hud__spacer" />
      <div className="hud__cell hud__coin">◎ {characters.length} GUIDES</div>
      <div className="hud__cell">{world.version}</div>
    </div>
  );
}

/* ─── character card ─── */
function Card({ c }) {
  return (
    <article className="card" tabIndex={0}>
      <span className="card__id">{c.id}</span>
      <div className="card__frame">
        {c.art ? (
          <img src={c.art} alt={c.name} />
        ) : (
          <>
            <span className="card__glyph" style={{ color: `var(${c.accent})` }}>{c.glyph}</span>
            <span className="card__drop">drop art → /public/characters/</span>
          </>
        )}
      </div>
      <div className="card__body">
        <span className="card__domain">{c.domain}</span>
        <h3 className="card__name">{c.name}</h3>
        <p className="card__line">“{c.line}”</p>
        <div className="card__stats">
          {Object.entries(c.stats).map(([k, v]) => (
            <div className="stat" key={k}>
              <span className="stat__k">{k}</span>
              <span className="stat__bar"><i style={{ width: `${v}%`, background: `var(${c.accent})` }} /></span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ─── footer NPC with typewriter ─── */
function Dialogue() {
  const full =
    "You made it to the edge of the prologue. The rest of the world is still being built — regions, quests, real projects. Come back and watch it grow.";
  const [txt, setTxt] = useState("");
  const iRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      iRef.current += 1;
      setTxt(full.slice(0, iRef.current));
      if (iRef.current >= full.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="dialogue">
      <div className="dialogue__ava">ग</div>
      <div>
        <div className="dialogue__name">▸ THE GATEKEEPER</div>
        <div className="dialogue__text">{txt}<span className="caret">▌</span></div>
      </div>
    </div>
  );
}

/* ─── main experience ─── */
export default function World() {
  const [ready, setReady] = useState(false);
  const rosterRef = useRef(null);

  return (
    <>
      {!ready && <Boot done={() => setReady(true)} />}

      <Hud />
      <Ticker />

      {/* HERO / TITLE */}
      <header className="hero">
        <Mandala className="mandala mandala--a" spokes={32} />
        <Mandala className="mandala mandala--b" spokes={16} />
        <span className="hero__eyebrow">◈ an indie-game portfolio</span>
        <h1 className="hero__title">{world.name}</h1>
        <p className="hero__sub">{world.subtitle}</p>
        <p className="hero__player">
          PLAYER: <b>{world.player}</b> · {world.role}
        </p>
        <button
          className="startbtn"
          onClick={() => rosterRef.current?.scrollIntoView({ behavior: "smooth" })}
        >
          ▶ PRESS START
        </button>
      </header>

      <Ticker reverse />

      {/* build note — delete this block when you ship */}
      <div className="buildnote">
        <div>
          ⚙ BUILD NOTE — edit <b>app/site.config.js</b> for names &amp; lore ·
          drop character art in <b>public/characters/</b> · this banner lives in <b>app/World.js</b>.
        </div>
      </div>

      {/* LORE */}
      <section className="section">
        <div className="section__head">
          <span className="section__num">00</span>
          <h2 className="section__title">
            THE MYTH
            <small>प्रस्तावना · prologue</small>
          </h2>
        </div>
        <div className="lore">
          <span className="lore__stamp">ॐ</span>
          {world.lore.map((line, i) => <p key={i}>{line}</p>)}
        </div>
      </section>

      {/* ROSTER */}
      <section className="section" ref={rosterRef}>
        <div className="section__head">
          <span className="section__num">01</span>
          <h2 className="section__title">
            SELECT YOUR GUIDE
            <small>each one is a piece of the maker</small>
          </h2>
        </div>
        <div className="roster">
          {characters.map((c) => <Card key={c.id} c={c} />)}
        </div>
      </section>

      {/* DIALOGUE */}
      <section className="section">
        <Dialogue />
      </section>

      <Ticker />
      <footer>
        {world.name} · built by one hand with <span className="heart">♥</span> &amp; chaos · {world.version}
      </footer>
    </>
  );
}
