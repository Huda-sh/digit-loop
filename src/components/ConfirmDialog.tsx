import { useEffect } from "react";
import { Icon } from "@/ds";

interface Props {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Ink-dark destructive confirm, used inside the lead view. */
export function ConfirmDialog({ open, title, body, confirmLabel, busy, onConfirm, onCancel }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "var(--overlay-scrim)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-6)",
        animation: "lp-fade var(--dur-fast) var(--ease-out)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(420px, 100%)",
          background: "var(--ink-800)",
          border: "1px solid rgba(255,255,255,.14)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          padding: "26px 26px 22px",
          color: "var(--white)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: 12,
              flex: "none",
              background: "var(--status-danger-subtle)",
              color: "var(--status-danger)",
            }}
          >
            <Icon name="alertCircle" size={20} strokeWidth={2} />
          </span>
          <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800, letterSpacing: "-.01em" }}>
            {title}
          </h3>
        </div>
        <p style={{ margin: "14px 0 0", fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,.72)", whiteSpace: "pre-line" }}>
          {body}
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            disabled={busy}
            style={{
              height: 40,
              padding: "0 16px",
              borderRadius: "var(--radius-pill)",
              border: "1px solid rgba(255,255,255,.18)",
              background: "transparent",
              color: "rgba(255,255,255,.82)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            style={{
              height: 40,
              padding: "0 18px",
              borderRadius: "var(--radius-pill)",
              border: "1px solid transparent",
              background: "var(--status-danger)",
              color: "var(--white)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 14,
              cursor: busy ? "wait" : "pointer",
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
