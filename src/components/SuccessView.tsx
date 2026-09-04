import { Button, BrandElement } from "@/ds";
import { SUCCESS } from "@/lib/visibility";
import type { Visibility } from "@/lib/types";

interface Props {
  visibility: Visibility;
  name: string;
  onWriteAnother: () => void;
  onBackToFeed: () => void;
}

export function SuccessView({ visibility, name, onWriteAnother, onBackToFeed }: Props) {
  const s = SUCCESS[visibility];
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "clamp(24px, 8vh, 96px) 20px" }}>
      <div
        className="lp-rise"
        style={{
          width: "min(460px, 100%)",
          background: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          padding: "34px 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 14,
        }}
      >
        <BrandElement index={s.el} size={76} />
        <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, letterSpacing: "-.01em", color: "var(--ink-800)" }}>
          {s.title}
        </h3>
        <p style={{ margin: 0, maxWidth: 330, fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.55, color: "var(--text-secondary)" }}>
          {s.body}
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: "var(--radius-pill)",
            background: s.pillBg,
            border: `1px solid ${s.pillBorder}`,
            color: s.pillFg,
            fontFamily: "var(--font-display)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {s.pill(name)}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
          <Button variant="outline" size="md" onClick={onWriteAnother}>Write another</Button>
          <Button variant="primary" size="md" onClick={onBackToFeed}>Back to the feed</Button>
        </div>
      </div>
    </div>
  );
}
