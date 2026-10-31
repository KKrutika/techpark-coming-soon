"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";

export function HeroScrollGate() {
  const locked = useRef(true);
  const leavingHero = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    const lockClass = "hero-scroll-locked";
    const scrollKeys = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);

    const preventScroll = (event: Event) => {
      if (locked.current) event.preventDefault();
    };
    const preventScrollKeys = (event: KeyboardEvent) => {
      if (locked.current && scrollKeys.has(event.key) && !event.altKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
      }
    };
    const preventAnchorNavigation = (event: MouseEvent) => {
      if (!locked.current) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || link.hash === "#home") return;
      event.preventDefault();
      if (link.hash === "#enquire") unlockAndScroll("enquire");
    };
    const relockAtHero = () => {
      if (leavingHero.current && window.scrollY > 0) {
        leavingHero.current = false;
      } else if (!locked.current && !leavingHero.current && window.scrollY <= 0) {
        locked.current = true;
        root.classList.add(lockClass);
      }
    };

    root.classList.add(lockClass);
    window.scrollTo(0, 0);
    document.addEventListener("wheel", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });
    document.addEventListener("keydown", preventScrollKeys);
    document.addEventListener("click", preventAnchorNavigation, true);
    window.addEventListener("scroll", relockAtHero, { passive: true });

    return () => {
      root.classList.remove(lockClass);
      document.removeEventListener("wheel", preventScroll);
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("keydown", preventScrollKeys);
      document.removeEventListener("click", preventAnchorNavigation, true);
      window.removeEventListener("scroll", relockAtHero);
    };
  }, []);

  function unlockAndScroll(targetId: "vision" | "enquire" = "vision") {
    if (!locked.current) return;
    locked.current = false;
    leavingHero.current = true;
    document.documentElement.classList.remove("hero-scroll-locked");

    const target = document.getElementById(targetId);
    if (!target) return;
    window.history.replaceState(null, "", `#${targetId}`);
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  return (
    <a className="hero-scroll" href="#vision" onClick={(event) => { event.preventDefault(); unlockAndScroll("vision"); }} aria-label="Unlock scrolling and explore the website">
      <ArrowDown size={18} />
    </a>
  );
}
