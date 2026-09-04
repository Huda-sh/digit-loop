import type { ReactNode } from "react";
import { Icon } from "@/ds";

interface Props {
  email?: string | null;
  onSignOut?: () => void;
  children: ReactNode;
}

/** The ink-dark end-to-end shell for the lead view — deliberately not the room the team stands in. */
export function LeadChrome({ email, onSignOut, children }: Props) {
  return (
    <div className="lp-ink" style={{ minHeight: "100vh", background: "var(--ink-900)", color: "var(--white)" }}>
      <header
        style={{
          height: 72,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 clamp(20px, 5vw, 40px)",
          borderBottom: "1px solid rgba(255,255,255,.12)",
          background: "var(--ink-800)",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <img src="/assets/logo-lockup-onDark.png" alt="Digit" style={{ height: 26, objectFit: "contain" }} />
        <span style={{ width: 1, height: 22, background: "rgba(255,255,255,.16)" }} />
        <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "var(--white)" }}>Loop</span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            height: 24,
            padding: "0 10px",
            borderRadius: "var(--radius-pill)",
            background: "rgba(255,197,51,.14)",
            color: "var(--gold-500)",
            fontFamily: "var(--font-display)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".12em",
            textTransform: "uppercase",
          }}
        >
          <Icon name="lock" size={12} strokeWidth={2} />
          Lead view
        </span>
        <div style={{ flex: 1 }} />
        {email && (
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "rgba(255,255,255,.6)" }}>{email}</span>
        )}
        {onSignOut && (
          <button
            onClick={onSignOut}
            style={{
              marginLeft: 12,
              height: 32,
              padding: "0 14px",
              borderRadius: "var(--radius-pill)",
              border: "1px solid rgba(255,255,255,.16)",
              background: "rgba(255,255,255,.05)",
              color: "rgba(255,255,255,.82)",
              fontFamily: "var(--font-display)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        )}
      </header>
      {children}
    </div>
  );
}
