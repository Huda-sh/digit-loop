import { useState, type ReactNode } from "react";

export function Tag({
  children,
  selected,
  onClick,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  const [h, setH] = useState(false);
  const interactive = !!onClick;
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        height: "var(--control-h-sm)",
        padding: "0 var(--space-4)",
        borderRadius: "var(--radius-pill)",
        fontSize: "var(--fs-body-sm)",
        fontWeight: "var(--fw-medium)" as unknown as number,
        border: "1px solid " + (selected ? "var(--border-brand)" : "var(--border-subtle)"),
        background: selected
          ? "var(--surface-brand-subtle)"
          : h && interactive
            ? "var(--gray-100)"
            : "var(--surface-card)",
        color: selected ? "var(--purple-700)" : "var(--text-secondary)",
        cursor: interactive ? "pointer" : "default",
        transition: "var(--motion-hover)",
        userSelect: "none",
      }}
    >
      {children}
    </span>
  );
}
