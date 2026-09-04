import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  element = 8,
  compact = false,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  element?: number;
  compact?: boolean;
}) {
  const n = String(Math.min(14, Math.max(1, element))).padStart(2, "0");
  return (
    <div
      style={{
        textAlign: "center",
        padding: compact ? "var(--space-6)" : "var(--space-12) var(--space-6)",
        background: compact ? "var(--surface-sunken)" : "transparent",
        borderRadius: compact ? "var(--radius-md)" : undefined,
      }}
    >
      <img
        src={`/assets/elements/element-${n}.png`}
        alt=""
        aria-hidden="true"
        style={{ width: compact ? 56 : 72, height: compact ? 56 : 72, objectFit: "contain", opacity: 0.85 }}
      />
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: compact ? "var(--fs-h4)" : "var(--fs-h3)",
          fontWeight: "var(--fw-bold)" as unknown as number,
          marginTop: "var(--space-4)",
          color: "var(--ink-800)",
        }}
      >
        {title}
      </div>
      {description && (
        <p
          style={{
            fontSize: compact ? "var(--fs-body-sm)" : "var(--fs-body)",
            color: "var(--text-secondary)",
            marginTop: "var(--space-2)",
            maxWidth: 420,
            marginInline: "auto",
            lineHeight: "var(--lh-normal)",
          }}
        >
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: "var(--space-6)" }}>{action}</div>}
    </div>
  );
}
