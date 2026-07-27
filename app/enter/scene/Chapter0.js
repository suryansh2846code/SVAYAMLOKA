"use client";

// ─────────────────────────────────────────────────────────────
//  CHAPTER 0 — THE SILENCE BEFORE CREATION
//  0.0 Absolute Silence · 0.1 The Veil of Creation
//  A live control panel (leva) tunes every variable via the shared
//  `dev` store. No bloom — the light comes from beneath the veil.
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Leva, useControls, folder, button } from "leva";
import Dust from "./Dust";
import CameraRig from "./CameraRig";
import Veil from "./Veil";
import PulseController from "./PulseController";
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

  const pulse = useRef({
    shock: 0, reveal: 0, open: 0, shake: 0, flash: 0,
  }).current;

  const ctrl = useControls({
    Veil: folder({
      seamBright: { value: dev.seamBright, min: 0, max: 4, step: 0.05 },
      flowSpeed: { value: dev.flowSpeed, min: 0, max: 2, step: 0.02 },
      flowFreq: { value: dev.flowFreq, min: 0.3, max: 6, step: 0.1 },
      flowStrength: { value: dev.flowStrength, min: 0, max: 2, step: 0.05 },
      guardianAmount: { value: dev.guardianAmount, min: 0, max: 1, step: 0.01 },
      fillDuration: { value: dev.fillDuration, min: 0.2, max: 2, step: 0.02 },
      veilOpen: { value: dev.veilOpen, min: 0, max: 1, step: 0.01, label: "preview open" },
      preview: { value: dev.preview, label: "hold visible" },
    }),
    Dust: folder({
      dustOpacity: { value: dev.dustOpacity, min: 0, max: 1, step: 0.01 },
      dustSize: { value: dev.dustSize, min: 0.02, max: 0.4, step: 0.005 },
    }),
    World: folder({
      shake: { value: dev.shake, min: 0, max: 2, step: 0.05 },
    }),
    Actions: folder({
      "▶ replay pulse": button(() => setTrigger((t) => t + 1)),
      "⧉ log settings": button(() =>
        console.log("SVAYAMLOKA dev settings:\n" + JSON.stringify({ ...dev }, null, 2))
      ),
    }),
  });
  Object.assign(dev, ctrl);

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
      <Leva collapsed={false} titleBar={{ title: "SVAYAMLOKA · Scene 0.1" }} />

      <Canvas
        className={styles.canvas}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 12], fov: 55, near: 0.1, far: 100 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#040406"]} />

        {/* the veil is the void itself (backdrop) */}
        <Veil pulse={pulse} />

        {/* dust drifts in front of the membrane */}
        <WorldShake pulse={pulse}>
          <Dust pulse={pulse} />
        </WorldShake>

        <CameraRig />
      </Canvas>

      <PulseController woken={woken} pulse={pulse} trigger={trigger} />

      <div className={styles.vignette} aria-hidden="true" />
    </div>
  );
}
