"use client";

import { useEffect, useRef, useState } from "react";
import { world, characters, ticker, threshold } from "./site.config";
import { useSmoothScroll } from "./lib/motion";
import { useReveal, useParallax } from "./lib/useReveal";
import Mandala from "./components/Mandala";
import ParallaxStage from "./components/ParallaxStage";
import Guide from "./components/Guide";
import QuestCard from "./components/QuestCard";
import Yantra from "./components/Yantra";

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
function Hud({ onMap }) {
  return (
    <div className="hud">
      <div className="hud__cell hud__cell--brand">{world.name}</div>
      <div className="hud__cell">
        CRAFT<span className="hud__meter"><i style={{ width: "88%", background: "var(--teal)" }} /></span>
      </div>
      <div className="hud__cell">
        CHAOS<span className="hud__meter"><i style={{ width: "72%", background: "var(--vermillion)" }} /></span>
      </div>
      <div className="hud__spacer" />
      <button className="hud__cell hud__map" onClick={onMap}>◈ MAP</button>
      <div className="hud__cell hud__coin">◎ {characters.length} REALMS</div>
      <div className="hud__cell">{world.version}</div>
    </div>
  );
}

/* ─── a single realm scene ─── */
function Realm({ character, refFn }) {
  const { id, layers, accent, quests } = character;
  return (
    <section className="realm" id={`realm-${id}`} ref={refFn}>
      <ParallaxStage layers={layers} accent={accent}>
        <Guide character={character} />
        <div className="realm__quests">
          {quests.map((q, i) => (
            <QuestCard key={i} quest={q} accent={accent} index={i} />
          ))}
        </div>
      </ParallaxStage>
    </section>
  );
}

/* ─── main experience ─── */
export default function World() {
  const [ready, setReady] = useState(false);
  const hubRef = useRef(null);
  const realmRefs = useRef({});

  useSmoothScroll();
  const revealScope = useReveal();
  const parallaxScope = useParallax();

  const goTo = (el) => el?.scrollIntoView({ behavior: "smooth", block: "start" });
  const toHub = () => goTo(hubRef.current);
  const toRealm = (id) => goTo(realmRefs.current[id]);

  return (
    <div ref={parallaxScope}>
      {!ready && <Boot done={() => setReady(true)} />}

      <Hud onMap={toHub} />
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
        <button className="startbtn" onClick={toHub}>▶ PRESS START</button>
      </header>

      <Ticker reverse />

      <div ref={revealScope}>
        {/* LORE */}
        <section className="section">
          <div className="section__head">
            <span className="section__num">00</span>
            <h2 className="section__title">
              THE MYTH<small>प्रस्तावना · prologue</small>
            </h2>
          </div>
          <div className="lore" data-reveal>
            <span className="lore__stamp">ॐ</span>
            {world.lore.map((line, i) => <p key={i}>{line}</p>)}
          </div>
        </section>

        {/* YANTRA HUB — realm map */}
        <section className="section" ref={hubRef}>
          <div className="section__head">
            <span className="section__num">01</span>
            <h2 className="section__title">
              CHOOSE YOUR REALM<small>each realm is a piece of the maker</small>
            </h2>
          </div>
          <Yantra characters={characters} onSelect={toRealm} />
        </section>
      </div>

      {/* THE REALMS */}
      {characters.map((c) => (
        <Realm
          key={c.id}
          character={c}
          refFn={(el) => (realmRefs.current[c.id] = el)}
        />
      ))}

      {/* THRESHOLD — closing NPC / contact */}
      <section className="section">
        <div className="dialogue">
          <div className="dialogue__ava">{threshold.glyph}</div>
          <div>
            <div className="dialogue__name">▸ {threshold.name}</div>
            <div className="dialogue__text">{threshold.text}</div>
            {threshold.cta && (
              <a className="dialogue__cta" href={threshold.cta.href}>
                {threshold.cta.label} ▸
              </a>
            )}
          </div>
        </div>
      </section>

      <Ticker />
      <footer>
        {world.name} · built by one hand with <span className="heart">♥</span> &amp; chaos · {world.version}
      </footer>
    </div>
  );
}
