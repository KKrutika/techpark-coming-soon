"use client";

import { useEffect, useState } from "react";
import { BuildingAnimated, CoffeeAnimated, MonitorAnimated, ShieldAnimated } from "./animated-icons";

/**
 * Full-screen loader overlay shown while the page loads.
 * Fades out once the browser has finished loading (window "load"),
 * with a safety timeout so it can never get stuck.
 * Each icon is an animated SVG (steam rising, screen flicker, windows lighting,
 * shield check pulse) and pops in/out of a colored badge.
 */
export function PageLoader({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [gone, setGone] = useState(false);
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  // TEST MODE: hold the loader open for a fixed time so you can watch the
  // icons cycle. Set DEBUG_LOADER_SECONDS to 0 (or remove) for production.
  const DEBUG_LOADER_SECONDS = 0;

  useEffect(() => {
    if (DEBUG_LOADER_SECONDS > 0) {
      const test = window.setTimeout(() => setLoaded(true), DEBUG_LOADER_SECONDS * 1000);
      return () => window.clearTimeout(test);
    }
    if (document.readyState === "complete") {
      setLoaded(true);
    } else {
      window.addEventListener("load", () => setLoaded(true), { once: true });
    }
    // Never block longer than 5s, even if something stalls.
    const safety = window.setTimeout(() => setLoaded(true), 5000);
    return () => window.clearTimeout(safety);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const fade = window.setTimeout(() => setGone(true), 600); // wait for fade-out
    return () => window.clearTimeout(fade);
  }, [loaded]);

  const icons = [
    { Icon: BuildingAnimated, label: "Building", color: "#10224f" },
    { Icon: MonitorAnimated, label: "Work-ready setup", color: "#10224f" },
    { Icon: CoffeeAnimated, label: "Coffee & conversations", color: "#10224f" },
    { Icon: ShieldAnimated, label: "Thoughtful environment", color: "#10224f" },
  ];

  // Cross-fade: hold each icon, then softly morph to the next (no hard pop).
  useEffect(() => {
    const outTimer = window.setTimeout(() => setPhase("out"), 950);
    const swapTimer = window.setTimeout(() => {
      setActive((n) => (n + 1) % icons.length);
      setPhase("in");
    }, 1300);
    return () => {
      window.clearTimeout(outTimer);
      window.clearTimeout(swapTimer);
    };
  });

  const current = icons[active];

  return (
    <>
      {!gone && (
        <div className={`page-loader${loaded ? " page-loader--done" : ""}`} aria-hidden={loaded}>
          {/* Green spinner ring with the animated icon centered inside it. */}
          <div className="loader-ring-wrap" title={current.label}>
            <span className="loader-ring" />
            <div className={`loader-icon-center loader-fade--${phase}`}>
              <current.Icon size={30} />
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
