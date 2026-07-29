"use client";

// The camera barely moves. It drifts a breath toward the cursor so the
// visitor senses depth — and, as the guardian is revealed, leans in a
// slow 5-8% (pulse.push), like someone unconsciously moving closer.

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function CameraRig({ pulse, amount = 0.6 }) {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const tx = pointer.x * amount;
    const ty = pointer.y * amount * 0.6;
    const push = pulse ? pulse.push || 0 : 0;
    const tz = 12 - push * 0.8; // a slow lean-in as the Witness is revealed

    camera.position.x += (tx - camera.position.x) * 0.015;
    camera.position.y += (ty - camera.position.y) * 0.015;
    camera.position.z += (tz - camera.position.z) * 0.02;
    camera.lookAt(target.current);
  });

  return null;
}
