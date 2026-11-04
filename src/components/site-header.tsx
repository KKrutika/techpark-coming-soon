"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, MoveUpRight } from "lucide-react";

type SiteHeaderProps = {
  projectName: string;
};

export function SiteHeader({ projectName }: SiteHeaderProps) {
  const [showInterest, setShowInterest] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hideHeader, setHideHeader] = useState(true);

  useEffect(() => {
    let frame = 0;

    const updateVisibility = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hero = document.getElementById("home");
        const enquiry = document.getElementById("enquire");
        if (!hero || !enquiry) return;

        const heroBounds = hero.getBoundingClientRect();
        const enquiryBounds = enquiry.getBoundingClientRect();
        const headerHasPassedHero = heroBounds.bottom <= 100;
        const enquiryIsVisible = enquiryBounds.top < window.innerHeight && enquiryBounds.bottom > 0;
        const atHero = window.scrollY < 50;

        setScrolled(headerHasPassedHero);
        setShowInterest(headerHasPassedHero && !enquiryIsVisible);
        setHideHeader(atHero);
      });
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return (
    <header className={`site-header${hideHeader ? " site-header--hidden" : ""}`}>
      <a className="brand" href="#home" aria-label={`${projectName} home`}>
        <Image className="brand-logo" src="/images/logo-color.png" alt="Corner Coworks" width={140} height={44} priority />
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#vision">The vision</a>
        <a href="#highlights">Highlights</a>
        <a href="#location">Location</a>
      </nav>
      <a className="header-cta header-cta--visible" href="#enquire">
        Enquire now <MoveUpRight size={15} />
      </a>
      <a className="mobile-menu" href="#enquire" aria-label="Go to enquiry form"><Menu /></a>
    </header>
  );
}
