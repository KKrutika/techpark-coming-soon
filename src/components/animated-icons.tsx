"use client";

/**
 * Custom animated SVG icons for the page loader — each has its own motion.
 * All are self-contained inline SVGs animated with CSS (no external libraries).
 */

export function BuildingAnimated({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="anim-icon anim-building" aria-label="Building">
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="12" width="16" height="28" rx="1.5" />
        <path d="M26 20h10a2 2 0 0 1 2 2v18H26" />
        <path d="M18 40V4" opacity="0" />
        <path d="M14 8l8 4v0" opacity="0" />
        <path d="M6 40h36" />
      </g>
      <g className="building-window">
        <rect x="13.5" y="16" width="3.4" height="3.4" rx="0.6" fill="currentColor" stroke="none" />
        <rect x="19.5" y="16" width="3.4" height="3.4" rx="0.6" fill="currentColor" stroke="none" />
      </g>
      <g className="building-window building-window--two">
        <rect x="13.5" y="22.5" width="3.4" height="3.4" rx="0.6" fill="currentColor" stroke="none" />
        <rect x="19.5" y="22.5" width="3.4" height="3.4" rx="0.6" fill="currentColor" stroke="none" />
      </g>
      <g className="building-window building-window--three">
        <rect x="30" y="25" width="3.2" height="3.2" rx="0.6" fill="currentColor" stroke="none" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path className="building-door" d="M16 40v-6a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6" />
      </g>
    </svg>
  );
}

export function MonitorAnimated({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="anim-icon anim-monitor" aria-label="Work-ready setup">
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="9" width="34" height="23" rx="2.5" />
        <path d="M18 40h12M24 32v8" />
      </g>
      <g className="monitor-screen">
        <path d="M13 20h8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.9" />
        <path d="M13 25h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.65" />
        <rect x="27" y="14" width="9" height="13" rx="1.5" stroke="currentColor" strokeWidth="2.4" fill="none" opacity="0.9" />
      </g>
      <path className="monitor-cursor" d="M31 18l4 4-2 .7 1.4 3-1.8.8-1.4-3-2 1.4z" fill="currentColor" />
    </svg>
  );
}

export function CoffeeAnimated({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="anim-icon anim-coffee" aria-label="Coffee & conversations">
      {/* steam */}
      <g className="coffee-steam" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path d="M17 4c-1.6 2.4 1.6 3.6 0 6" />
        <path d="M24 3c-1.6 2.4 1.6 3.6 0 6" />
        <path d="M31 4c-1.6 2.4 1.6 3.6 0 6" />
      </g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M12 14h22v3a1 1 0 0 1-1 1H13a1 1 0 0 1-1-1v-3z" />
        <path d="M12.5 18h21l-1.6 16a4 4 0 0 1-4 3.6H18a4 4 0 0 1-4-3.6L12.5 18z" />
        <path d="M34 18h4a4 4 0 0 1 0 8h-3.4" />
      </g>
      <path className="coffee-slosh" d="M15 24c2.5 1.8 5-1.2 8 .4s5.5-.6 8-.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function ShieldAnimated({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="anim-icon anim-shield" aria-label="Thoughtful environment">
      <path
        className="shield-body"
        d="M24 5c4 2.4 8.4 3.6 13 3.6v11.6c0 10-5.4 15.8-13 18.8-7.6-3-13-8.8-13-18.8V8.6c4.6 0 9-1.2 13-3.6z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
        fill="none"
      />
      <path className="shield-check" d="M17.5 24l4.6 4.6L31 19.5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
