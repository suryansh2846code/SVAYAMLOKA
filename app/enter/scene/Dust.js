"use client";

// ─────────────────────────────────────────────────────────────
//  DUST — ~500 tiny motes suspended in the void. Barely visible,
//  moving incredibly slowly, easing toward the cursor. Ash in air.
//  Fades in over the first few seconds so we open on true black.
// ─────────────────────────────────────────────────────────────

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { dev } from "./dev";

// A soft round sprite generated at runtime — no texture asset.
function softCircleTexture() {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const COUNT = 520;
const RANGE = { x: 26, y: 16, z: 18 }; // volume the dust fills

export default function Dust({ pulse }) {
  const pointsRef = useRef();
  const matRef = useRef();
  const sprite = useMemo(softCircleTexture, []);
  const { pointer } = useThree();
  const drift = useRef(new THREE.Vector3());

  // positions + per-mote slow velocities
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * RANGE.x;
      positions[i * 3 + 1] = (Math.random() - 0.5) * RANGE.y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * RANGE.z;
      velocities[i * 3] = (Math.random() - 0.5) * 0.006;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.004 + 0.002; // faint upward bias
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.006;
    }
    return { positions, velocities };
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05) * 60; // normalize, clamp on stalls
    const pos = pointsRef.current.geometry.attributes.position.array;

    // cursor nudges the whole field, easing in slowly
    drift.current.x += (pointer.x * 1.2 - drift.current.x) * 0.02;
    drift.current.y += (pointer.y * 0.8 - drift.current.y) * 0.02;

    // the pulse: reality exhales (shock>0), then inhales (shock<0)
    const shock = pulse ? pulse.shock : 0;
    // Scene 0.2: one lone mote stops drifting and seeks the centre
    const seek = pulse ? pulse.seek : 0;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;

      if (i === 0 && seek > 0) {
        // the wandering particle — barely, toward the middle of the void
        pos[ix] += (0 - pos[ix]) * 0.004 * seek * dt;
        pos[ix + 1] += (0 - pos[ix + 1]) * 0.004 * seek * dt;
        pos[ix + 2] += (0 - pos[ix + 2]) * 0.004 * seek * dt;
        continue;
      }

      pos[ix] += (velocities[ix] + drift.current.x * 0.01) * dt;
      pos[ix + 1] += (velocities[ix + 1] + drift.current.y * 0.01) * dt;
      pos[ix + 2] += velocities[ix + 2] * dt;

      // radial push out from center, scaled by the shock envelope
      if (shock !== 0) {
        const px = pos[ix], py = pos[ix + 1], pz = pos[ix + 2];
        const len = Math.hypot(px, py, pz) || 1;
        const push = shock * 0.12 * dt;
        pos[ix] += (px / len) * push;
        pos[ix + 1] += (py / len) * push;
        pos[ix + 2] += (pz / len) * push;
      }

      // wrap motes that drift out of the volume
      if (pos[ix] > RANGE.x / 2) pos[ix] = -RANGE.x / 2;
      else if (pos[ix] < -RANGE.x / 2) pos[ix] = RANGE.x / 2;
      if (pos[ix + 1] > RANGE.y / 2) pos[ix + 1] = -RANGE.y / 2;
      else if (pos[ix + 1] < -RANGE.y / 2) pos[ix + 1] = RANGE.y / 2;
      if (pos[ix + 2] > RANGE.z / 2) pos[ix + 2] = -RANGE.z / 2;
      else if (pos[ix + 2] < -RANGE.z / 2) pos[ix + 2] = RANGE.z / 2;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // ease opacity in over the first ~4s → open on true black.
    // As the guardian's eyes ignite, the world dims around them (they
    // don't), so the gaze reads as something that cannot be hidden.
    if (matRef.current) {
      const eg = pulse ? pulse.eyeGlow || 0 : 0;
      const targetOpacity = dev.dustOpacity * (1 - 0.5 * eg);
      matRef.current.opacity += (targetOpacity - matRef.current.opacity) * 0.02;
      matRef.current.size = dev.dustSize;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        map={sprite}
        size={0.09}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={new THREE.Color("#b9c2d6")}
      />
    </points>
  );
}
