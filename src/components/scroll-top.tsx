"use client";
export function ScrollTop() {
  return (
    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", font: "inherit" }}>
      BACK TO TOP ↑
    </button>
  );
}