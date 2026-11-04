"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Fades + slides its children in the first time they scroll into view.
 * Wrap any section: <Reveal><section ... /></Reveal>
 */
export function Reveal({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [node, setNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return (
    <div ref={setNode} className={`reveal${visible ? " reveal--visible" : ""}`}>
      {children}
    </div>
  );
}
