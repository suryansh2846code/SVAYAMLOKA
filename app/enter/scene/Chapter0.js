"use client";

// ─────────────────────────────────────────────────────────────
//  CHAPTER 0 — THE SILENCE BEFORE CREATION
//  0.0 Absolute Silence · 0.1 The Veil of Creation
//  Scene values are read each frame from the `dev` config store.
//  No bloom — the light comes from beneath the veil.
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Dust from "./Dust";
import CameraRig from "./CameraRig";
import Veil from "./Veil";
import Guardian from "./Guardian";
import Narration from "./Narration";
import EnvLight from "./EnvLight";
import PulseController from "./PulseController";

const LINE_1 = ["Before light", "sought the stars…"];
const LINE_2 = ["…memory had", "already awakened."];
const LINE_3 = ["I was its first witness."];
import { useDrone } from "./useDrone";
import { dev } from "./dev";
import styles from "../enter.module.css";

export const PHASES = [
  "SILENCE", "VEIL", "TEXT", "EYES",
  "GUARDIAN", "REVELATION", "NAME", "INVITATION",
];

// The camera never moves — the WORLD shakes, barely.
function WorldShake({ pulse, children }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const s = (pulse.shake || 0) * dev.shake;
    const t = clock.elapsedTime;
    ref.current.position.x = Math.sin(t * 53.0) * 0.03 * s;
    ref.current.position.y = Math.cos(t * 61.0) * 0.03 * s;
  });
  return <group ref={ref}>{children}</group>;
}

export default function Chapter0() {
  const [phase] = useState("SILENCE");
  const [woken, setWoken] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [revealTrigger, setRevealTrigger] = useState(0);
  const [holds, setHolds] = useState({ seams: false, text: false, text2: false, guardian: false });

  const pulse = useRef({
    shock: 0, reveal: 0, open: 0, shake: 0, flash: 0,
    fade: 1, env: 0, text: 0, text2a: 0, text2b: 0, text3: 0,
    seek: 0, eyeGlow: 0, emerge: 0, emergeArms: 0, push: 0,
  }).current;

  // HOLD freezes chosen elements visible (study); REPLAY re-runs the scene
  useEffect(() => {
    dev.holdSeams = holds.seams;
    dev.holdText = holds.text;
    dev.holdText2 = holds.text2;
    dev.holdGuardian = holds.guardian;
  }, [holds]);
  const toggle = (k) => setHolds((s) => ({ ...s, [k]: !s[k] }));

  useEffect(() => {
    const wake = () => setWoken(true);
    const opts = { once: true };
    window.addEventListener("pointermove", wake, opts);
    window.addEventListener("pointerdown", wake, opts);
    window.addEventListener("keydown", wake, opts);
    window.addEventListener("touchstart", wake, opts);
    return () => {
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("keydown", wake);
      window.removeEventListener("touchstart", wake);
    };
  }, []);

  useDrone({ enabled: true });

  return (
    <div className={styles.void} data-phase={phase}>
      <Canvas
        className={styles.canvas}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 12], fov: 55, near: 0.1, far: 100 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#040406"]} />

        {/* the guardian — always there at ~3%, hidden in the dark */}
        <Guardian pulse={pulse} />

        {/* the seams of the veil */}
        <Veil pulse={pulse} />

        {/* dust drifts in front of the membrane */}
        <WorldShake pulse={pulse}>
          <Dust pulse={pulse} />
        </WorldShake>

        <CameraRig pulse={pulse} />
      </Canvas>

      <EnvLight pulse={pulse} />
      <Narration pulse={pulse} rows={LINE_1} field="text" holdKey="holdText" />
      <Narration pulse={pulse} rows={LINE_2} field={["text2a", "text2b"]} holdKey="holdText2" />
      <Narration pulse={pulse} rows={LINE_3} field="text3" holdKey="holdText3" small />
      <PulseController woken={woken} pulse={pulse} trigger={trigger} revealTrigger={revealTrigger} />

      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.controls}>
        <span className={styles.ctrllabel}>hold</span>
        <button
          className={`${styles.ctrlbtn} ${holds.seams ? styles.ctrlbtnOn : ""}`}
          onClick={() => toggle("seams")}
        >
          seams
        </button>
        <button
          className={`${styles.ctrlbtn} ${holds.text ? styles.ctrlbtnOn : ""}`}
          onClick={() => toggle("text")}
        >
          text 1
        </button>
        <button
          className={`${styles.ctrlbtn} ${holds.text2 ? styles.ctrlbtnOn : ""}`}
          onClick={() => toggle("text2")}
        >
          text 2
        </button>
        <button
          className={`${styles.ctrlbtn} ${holds.guardian ? styles.ctrlbtnOn : ""}`}
          onClick={() => toggle("guardian")}
        >
          guardian
        </button>
        <button className={styles.ctrlbtn} onClick={() => setRevealTrigger((t) => t + 1)}>
          ◑ reveal
        </button>
        <button className={styles.ctrlbtn} onClick={() => setTrigger((t) => t + 1)}>
          ▶ replay
        </button>
      </div>
    </div>
  );
}
