"use client";

// Client-only loader for the real-time scene. Keeping the dynamic
// import (ssr:false) in a client component satisfies the App Router,
// while the server page still owns <metadata>.
import dynamic from "next/dynamic";
import styles from "./enter.module.css";

const Chapter0 = dynamic(() => import("./scene/Chapter0"), {
  ssr: false,
  loading: () => <div className={styles.fallback} />, // pure black, never "Loading…"
});

export default function SceneLoader() {
  return <Chapter0 />;
}
