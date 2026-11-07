"use client";
import { useEffect } from "react";
export function HeroHide() {
  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero) return;
    const onScroll = () => {
      const next = document.getElementById("vision");
      const hide = next ? next.getBoundingClientRect().top <= window.innerHeight * 0.8 : window.scrollY > 50;
      if (hide) hero.classList.add("hero--hidden");
      else hero.classList.remove("hero--hidden");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}