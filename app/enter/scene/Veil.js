"use client";

// THE VEIL OF CREATION — crisp thin luminous seams.
// A few hairline seams span the void. When the veil thins, warm light
// TRAVELS them (ivory at the fresh front, gold trailing), then retreats
// and heals. The guardian is barely glimpsed behind the membrane.
// Idle = pure black. No bloom — the light IS the seam.
//
//   pulse.reveal → the travelling light along the seams (0..1)
//   pulse.open   → how transparent the membrane is (guardian/beneath)

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildSeams } from "./seams";
import { dev } from "./dev";

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const TAU = Math.PI * 2;
const GOLD = [0.85, 0.7, 0.42];
const IVORY = [0.97, 0.92, 0.8];

function Seams({ pulse }) {
  const { positions, dist, weight, vertexCount } = useMemo(() => buildSeams(7), []);
  const colorAttr = useMemo(() => new Float32Array(vertexCount * 3), [vertexCount]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colorAttr, 3));
    return g;
  }, [positions, colorAttr]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const holding = dev.holdSeams;
    const front = holding ? 1.1 : pulse.reveal;
    const fade = holding ? 1 : (pulse.fade == null ? 1 : pulse.fade); // uniform blink-out
    const bright = dev.seamBright * (holding ? 1 : 1 + (pulse.flash || 0)) * fade;
    const speed = dev.flowSpeed;
    const freq = dev.flowFreq;
    const strength = dev.flowStrength;
    const arr = geometry.attributes.color.array;

    for (let i = 0; i < vertexCount; i++) {
      const d = dist[i];
      let r = 0, g = 0, b = 0;
      if (d <= front) {
        const edge = smooth(front - 0.12, front, d);   // filled body → bright front
        const spark = smooth(front - 0.03, front, d);  // fresh leading light
        const bodyBase = 0.16 + 0.5 * edge + spark * 0.6;

        // ── the vein is ALIVE: bright pulses travel along the fracture ──
        // sharp peaks in sin() move outward as time advances (blood flow)
        const flow = Math.sin((d * freq - t * speed) * TAU);
        const pulse2 = Math.pow(Math.max(0, flow), 5); // discrete travelling dots
        // second, slower current for organic layering
        const flow2 = Math.sin((d * freq * 0.6 - t * speed * 0.55) * TAU + 1.7);
        const pulse3 = Math.pow(Math.max(0, flow2), 6) * 0.6;

        // children fractures are fainter — almost invisible tributaries
        const bb = (bodyBase + (pulse2 + pulse3) * strength) * bright * weight[i];
        const warmMix = Math.min(1, edge + (pulse2 + pulse3) * 0.7);
        r = (GOLD[0] + (IVORY[0] - GOLD[0]) * warmMix) * bb;
        g = (GOLD[1] + (IVORY[1] - GOLD[1]) * warmMix) * bb;
        b = (GOLD[2] + (IVORY[2] - GOLD[2]) * warmMix) * bb;
      }
      const o = i * 3;
      arr[o] = r; arr[o + 1] = g; arr[o + 2] = b;
    }
    geometry.attributes.color.needsUpdate = true;
  });

  return (
    <lineSegments geometry={geometry} frustumCulled={false} renderOrder={2}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={1}
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

// (the guardian now lives in its own component — Guardian.js)

export default function Veil({ pulse }) {
  return <Seams pulse={pulse} />;
}
