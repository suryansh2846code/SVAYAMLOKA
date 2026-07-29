"use client";

// THE GUARDIAN — present from the very beginning at ~3% opacity: a figure
// you sense but never see (a faint base layer of his real silhouette).
// His eyes ignite, and then the DARKNESS RECEDES from him — a second
// layer is revealed top-down through a repainted mask: crown first, then
// face, the folded hands (centre) before the outer arms, then the torso.
// The mask front is uneven (fog) and stops short of the bottom, so ~25%
// of him always belongs to the dark. He never moves.
//
//   pulse.open     → a touch more visible during the veil moment (0..1)
//   pulse.eyeGlow  → his eyes catching light, 0..1 (holds)
//   pulse.emerge   → the darkness receding from him (0..1)

import { useMemo, useRef, Suspense } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { dev } from "./dev";

const SRC = "/characters/me/guardian.png";
const BASE = 0.03;    // always-present opacity (~3%)
const EYE_MAX = 0.4;  // the eyes stop at ~40%
const FIG_MAX = 0.5;  // how visible his revealed form becomes

const EYE = { x: 0.2, y: 3.05, z: 0.03, size: 0.28 };
const COLD = new THREE.Color("#4a3616");
const WARM = new THREE.Color("#8a6636");

const smoothstep = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

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
  const glow = useMemo(glowDot, []);
  const figA = useRef(); // uniform faint base ("he was always here")
  const figB = useRef(); // top-down revealed layer
  const eL = useRef();
  const eR = useRef();

  // the reveal mask — repainted as he emerges (canvas → alphaMap)
  const mask = useMemo(() => {
    const W = 128, H = 192;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const tx = new THREE.CanvasTexture(canvas);
    tx.minFilter = THREE.LinearFilter;
    tx.magFilter = THREE.LinearFilter;
    const steps = Math.ceil(W / 4) + 1;
    const noise = new Float32Array(steps);
    for (let i = 0; i < steps; i++) noise[i] = Math.random();
    return { canvas, tx, W, H, noise };
  }, []);
  const prev = useRef({ e: -1, a: -1 });

  // emerge = the centre body's front (crown → face → hands → torso → knees),
  // arms   = the wide outer arm region, revealed separately (last).
  const drawMask = (emerge, arms) => {
    const { canvas, W, H, noise, tx } = mask;
    const ctx = canvas.getContext("2d");
    ctx.filter = "none";
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    // soft edge = darkness fading out, highlights/shadows surfacing
    ctx.filter = "blur(7px)";
    ctx.fillStyle = "#fff";
    const centerY = emerge * 0.98 * H; // down the body
    const armY = arms * 0.5 * H;       // arms live in the upper half
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(W, -8);
    for (let x = W; x >= 0; x -= 4) {
      const cxd = Math.abs(x / W - 0.5);
      const cf = smoothstep(0.3, 0.16, cxd); // 1 centre column → 0 outer
      const jag = (noise[Math.floor((W - x) / 4)] - 0.5) * 0.1 * H;
      ctx.lineTo(x, armY + (centerY - armY) * cf + jag);
    }
    ctx.closePath();
    ctx.fill();
    ctx.filter = "none";
    tx.needsUpdate = true;
  };

  useFrame(() => {
    const held = dev.holdGuardian;
    const open = held ? 1 : pulse.open || 0;
    const emerge = held ? 1 : pulse.emerge || 0;
    const arms = held ? 1 : pulse.emergeArms || 0;
    const eg = held ? 1 : pulse.eyeGlow || 0;

    if (Math.abs(emerge - prev.current.e) > 0.002 || Math.abs(arms - prev.current.a) > 0.002) {
      drawMask(emerge, arms);
      prev.current.e = emerge;
      prev.current.a = arms;
    }

    if (figA.current) figA.current.material.opacity = BASE + open * dev.guardianAmount;
    if (figB.current) {
      figB.current.material.opacity = FIG_MAX - BASE;             // mask gates what shows
      figB.current.material.color.copy(COLD).lerp(WARM, Math.max(emerge, arms));
    }
    const eyeOp = eg * EYE_MAX;
    if (eL.current) eL.current.material.opacity = eyeOp;
    if (eR.current) eR.current.material.opacity = eyeOp;
  });

  return (
    <group position={[0, -0.6, -4]} renderOrder={1}>
      {/* A — uniform faint presence (always ~3%) */}
      <mesh ref={figA}>
        <planeGeometry args={[6, 9]} />
        <meshBasicMaterial map={tex} color="#4a3616" transparent opacity={0}
          depthWrite={false} depthTest={false} toneMapped={false}
          blending={THREE.AdditiveBlending} />
      </mesh>

      {/* B — the darkness receding, revealed top-down through the mask */}
      <mesh ref={figB}>
        <planeGeometry args={[6, 9]} />
        <meshBasicMaterial map={tex} alphaMap={mask.tx} color="#4a3616"
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
