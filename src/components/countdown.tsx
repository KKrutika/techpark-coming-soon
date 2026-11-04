"use client";

import { useEffect, useState } from "react";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };
const launchDate = process.env.NEXT_PUBLIC_LAUNCH_DATE
  ? new Date(process.env.NEXT_PUBLIC_LAUNCH_DATE).getTime()
  : new Date("2026-12-03T00:00:00+05:30").getTime();

function calculate(): TimeLeft {
  const distance = Math.max(0, launchDate - Date.now());
  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance / 3600000) % 24),
    minutes: Math.floor((distance / 60000) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

export function Countdown() {
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setTime(calculate());
    const timer = window.setInterval(() => setTime(calculate()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="countdown-wrap" aria-label="Countdown to our planned launch">
      <div className="countdown-label"><span className="live-dot" /> OUR DOORS OPEN IN</div>
      <div className="countdown-grid">
        {([["days", "Days"], ["hours", "Hours"], ["minutes", "Minutes"], ["seconds", "Seconds"]] as const).map(([key, label]) => (
          <div className="countdown-cell" key={key}>
            <strong>{String(time[key]).padStart(2, "0")}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <p className="countdown-note">Planned launch date · update this date when your opening schedule is confirmed</p>
    </div>
  );
}
