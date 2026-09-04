import type { ReactNode } from "react";

type Tone = "brand" | "ink" | "gold" | "plum" | "success" | "warning" | "danger" | "info";

const T: Record<Tone, [string, string]> = {
  brand: ["var(--surface-brand-subtle)", "var(--purple-700)"],
  ink: ["var(--gray-100)", "var(--ink-700)"],
  gold: ["var(--gold-50)", "var(--gold-900)"],
  plum: ["var(--plum-50)", "var(--plum-700)"],
  success: ["var(--status-success-subtle)", "var(--status-success)"],
  warning: ["var(--status-warning-subtle)", "var(--gold-900)"],
  danger: ["var(--status-danger-subtle)", "var(--status-danger)"],
  info: ["var(--status-info-subtle)", "var(--status-info)"],
};

export function Badge({
  tone = "brand",
  solid = false,
  dot = false,
  children,
}: {
  tone?: Tone;
  solid?: boolean;
  dot?: boolean;
  children: ReactNode;
}) {
  const [bg, fg] = T[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        background: solid ? fg : bg,
        color: solid ? "var(--white)" : fg,
        fontFamily: "var(--font-display)",
        fontSize: "var(--fs-micro)",
        fontWeight: "var(--fw-bold)" as unknown as number,
        letterSpacing: "var(--ls-eyebrow)",
        textTransform: "uppercase",
        padding: "5px 10px",
        borderRadius: "var(--radius-pill)",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {dot && (
        <span
          style={{ width: 6, height: 6, borderRadius: 999, background: solid ? "var(--white)" : fg }}
        />
      )}
      {children}
    </span>
  );
}
