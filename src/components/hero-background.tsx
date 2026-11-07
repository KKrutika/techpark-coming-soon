"use client";

import { useEffect, useState } from "react";

const images = ["/images/Reception.png", "/images/FE.png", "/images/gallery-focus.avif", "/images/IFT.png", "/images/WWAP.png"];

export function HeroBackground() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hero-bg" aria-hidden="true">
      {images.map((src, i) => (
        <div key={src} className={`hero-bg-slide${i === index ? " hero-bg-slide--active" : ""}`} style={{ backgroundImage: `url(${src})` }} />
      ))}
      <div className="hero-bg-overlay" />
    </div>
  );
}