import { useState, type TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function Textarea({ rows = 4, invalid, disabled, style, ...rest }: Props) {
  const [f, setF] = useState(false);
  return (
    <textarea
      rows={rows}
      disabled={disabled}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
      style={{
        width: "100%",
        padding: "var(--space-3) var(--space-4)",
        font: "inherit",
        fontSize: "var(--fs-body)",
        color: "var(--text-primary)",
        background: disabled ? "var(--surface-sunken)" : "var(--surface-card)",
        border:
          "1px solid " +
          (invalid ? "var(--status-danger)" : f ? "var(--border-focus)" : "var(--border-default)"),
        borderRadius: "var(--radius-md)",
        boxShadow: f ? "var(--ring-focus)" : "none",
        outline: "none",
        resize: "vertical",
        lineHeight: "var(--lh-normal)",
        transition: "var(--motion-hover)",
        opacity: disabled ? 0.55 : 1,
        ...style,
      }}
      {...rest}
    />
  );
}
