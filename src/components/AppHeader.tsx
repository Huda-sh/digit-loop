import type { ReactNode } from "react";

export function AppHeader({ action }: { action?: ReactNode }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        height: 68,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "0 clamp(20px, 5vw, 40px)",
        background: "var(--overlay-glass)",
        backdropFilter: "var(--blur-glass)",
        WebkitBackdropFilter: "var(--blur-glass)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <img src="/assets/logo-mark.png" alt="Digit" style={{ width: 28, height: 28, objectFit: "contain" }} />
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 20,
          fontWeight: 800,
          color: "var(--ink-800)",
          letterSpacing: "-.01em",
        }}
      >
        Loop
      </span>
      <span style={{ width: 1, height: 20, background: "var(--border-subtle)" }} className="hide-sm" />
      <span
        className="hide-sm"
        style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--text-secondary)" }}
      >
        Digit software team
      </span>
      <div style={{ flex: 1 }} />
      {action}
    </header>
  );
}
