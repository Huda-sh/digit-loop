import { useState, type CSSProperties, type InputHTMLAttributes, type ReactNode } from "react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  wrapperStyle?: CSSProperties;
}

export function Input({
  size = "md",
  invalid,
  disabled,
  leadingIcon,
  trailingIcon,
  wrapperStyle,
  style,
  ...rest
}: Props) {
  const [f, setF] = useState(false);
  const h = { sm: "var(--control-h-sm)", md: "var(--control-h)", lg: "var(--control-h-lg)" }[size];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        height: h,
        padding: "0 var(--space-4)",
        background: disabled ? "var(--surface-sunken)" : "var(--surface-card)",
        border:
          "1px solid " +
          (invalid ? "var(--status-danger)" : f ? "var(--border-focus)" : "var(--border-default)"),
        borderRadius: "var(--radius-md)",
        boxShadow: f ? "var(--ring-focus)" : "none",
        transition: "var(--motion-hover)",
        opacity: disabled ? 0.55 : 1,
        ...wrapperStyle,
      }}
    >
      {leadingIcon && <span style={{ display: "flex", color: "var(--text-muted)" }}>{leadingIcon}</span>}
      <input
        disabled={disabled}
        onFocus={() => setF(true)}
        onBlur={() => setF(false)}
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          font: "inherit",
          fontSize: "var(--fs-body)",
          color: "var(--text-primary)",
          ...style,
        }}
        {...rest}
      />
      {trailingIcon && (
        <span style={{ display: "flex", color: "var(--text-muted)" }}>{trailingIcon}</span>
      )}
    </div>
  );
}
