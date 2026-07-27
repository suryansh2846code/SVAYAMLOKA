"use client";

// THE GUARDIAN — present from the very beginning, at ~3% opacity: a
// figure you sense but never see, hidden in the dark. Then his EYES
// ignite, ramping up until they hold. He is not "revealed" — he was
// always there; the darkness just stops hiding his gaze.
//
//   pulse.open     → a touch more visible during the veil moment (0..1)
//   pulse.eyeGlow  → his eyes catching light, 0..1 (holds near the end)

import { useMemo, useRef, Suspense } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { dev } from "./dev";

const SRC = "/characters/me/76ed1ddf-0eaf-4103-afde-957f1d11235c.png";
const BASE = 0.03;           // always-present opacity (~3%)
const EYE_MAX = 0.4;         // the eyes stop at ~40%

// where the guardian's eyes sit on the figure plane (local coords).
// tweakable if the glints don't land exactly on his eyes.
const EYE = { x: 0.2, y: 3.05, z: 0.03, size: 0.28 };

// soft full-figure feather so the baked background never reads as a box
function figureFeather() {
  const w = 256, h = 384;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(w / 2, h * 0.42, 0, w / 2, h * 0.42, w * 0.95);
  g.addColorStop(0.0, "rgba(255,255,255,0.95)");
  g.addColorStop(0.5, "rgba(255,255,255,0.7)");
  g.addColorStop(0.82, "rgba(255,255,255,0.25)");
  g.addColorStop(1.0, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  return new THREE.CanvasTexture(c);
}

// a soft glint for an eye
function glowDot() {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,220,160,0.6)");
  g.addColorStop(1, "rgba(255,200,120,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(c);
}

function GuardianMesh({ pulse }) {
  const tex = useLoader(THREE.TextureLoader, SRC);
  const feather = useMemo(figureFeather, []);
  const glow = useMemo(glowDot, []);
  const fig = useRef();
  const eL = useRef();
  const eR = useRef();

  useFrame(() => {
    const held = dev.holdGuardian;
    const open = held ? 1 : pulse.open || 0;
    const eg = held ? 1 : pulse.eyeGlow || 0;

    if (fig.current) fig.current.material.opacity = BASE + open * dev.guardianAmount;
    const eyeOp = eg * EYE_MAX;
    if (eL.current) eL.current.material.opacity = eyeOp;
    if (eR.current) eR.current.material.opacity = eyeOp;
  });

  return (
    <group position={[0, -0.6, -4]} renderOrder={1}>
      {/* the figure — barely there */}
      <mesh ref={fig}>
        <planeGeometry args={[6, 9]} />
        <meshBasicMaterial map={tex} alphaMap={feather} color="#4a3616"
          transparent opacity={0} depthWrite={false} depthTest={false}
          toneMapped={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* the eyes — igniting */}
      <mesh ref={eL} position={[-EYE.x, EYE.y, EYE.z]}>
        <planeGeometry args={[EYE.size, EYE.size]} />
        <meshBasicMaterial map={glow} color="#ffd39a" transparent opacity={0}
          depthWrite={false} depthTest={false} toneMapped={false}
          blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={eR} position={[EYE.x, EYE.y, EYE.z]}>
        <planeGeometry args={[EYE.size, EYE.size]} />
        <meshBasicMaterial map={glow} color="#ffd39a" transparent opacity={0}
          depthWrite={false} depthTest={false} toneMapped={false}
          blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

export default function Guardian({ pulse }) {
  return (
    <Suspense fallback={null}>
      <GuardianMesh pulse={pulse} />
    </Suspense>
  );
}
