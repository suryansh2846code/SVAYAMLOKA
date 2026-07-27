"use client";

// The camera barely moves. It drifts a breath toward the cursor so the
// visitor senses depth — nothing more. The world comes to them.

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function CameraRig({ amount = 0.6 }) {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const tx = pointer.x * amount;
    const ty = pointer.y * amount * 0.6;
    camera.position.x += (tx - camera.position.x) * 0.015;
    camera.position.y += (ty - camera.position.y) * 0.015;
    camera.lookAt(target.current);
  });

  return null;
}
