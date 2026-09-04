import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "accent" | "onInk";
type Size = "sm" | "md" | "lg";

const V: Record<Variant, React.CSSProperties> = {
  primary: { background: "var(--surface-brand)", color: "var(--text-on-brand)", border: "1px solid transparent", boxShadow: "var(--shadow-brand)" },
  secondary: { background: "var(--surface-ink)", color: "var(--text-inverse)", border: "1px solid transparent", boxShadow: "var(--shadow-sm)" },
  outline: { background: "transparent", color: "var(--text-brand)", border: "1px solid var(--border-brand)", boxShadow: "none" },
  ghost: { background: "transparent", color: "var(--text-primary)", border: "1px solid transparent", boxShadow: "none" },
  accent: { background: "var(--surface-accent)", color: "var(--ink-900)", border: "1px solid transparent", boxShadow: "var(--shadow-sm)" },
  onInk: { background: "var(--white)", color: "var(--ink-900)", border: "1px solid transparent", boxShadow: "none" },
};

const S: Record<Size, React.CSSProperties> = {
  sm: { height: "var(--control-h-sm)", padding: "0 var(--space-4)", fontSize: "var(--fs-body-sm)" },
  md: { height: "var(--control-h)", padding: "0 var(--space-6)", fontSize: "var(--fs-body)" },
  lg: { height: "var(--control-h-lg)", padding: "0 var(--space-8)", fontSize: "var(--fs-body-lg)" },
};

const HOVER: Record<Variant, string> = {
  primary: "var(--brand-hover)",
  secondary: "var(--ink-hover)",
  outline: "var(--surface-brand-subtle)",
  ghost: "var(--gray-100)",
  accent: "var(--gold-300)",
  onInk: "var(--gray-100)",
};
const ACTIVE: Record<Variant, string> = {
  primary: "var(--brand-active)",
  secondary: "var(--ink-900)",
  outline: "var(--purple-100)",
  ghost: "var(--gray-200)",
  accent: "var(--gold-500)",
  onInk: "var(--gray-200)",
};

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: Variant;
  size?: Size;
  shape?: "pill" | "rounded";
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  type?: "button" | "submit" | "reset";
}

export function Button({
  variant = "primary",
  size = "md",
  shape = "pill",
  disabled,
  fullWidth,
  leadingIcon,
  trailingIcon,
  children,
  type = "button",
  style,
  ...rest
}: Props) {
  const [h, setH] = useState(false);
  const [a, setA] = useState(false);
  const v = V[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => {
        setH(false);
        setA(false);
      }}
      onMouseDown={() => setA(true)}
      onMouseUp={() => setA(false)}
      style={{
        ...v,
        ...S[size],
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-2)",
        width: fullWidth ? "100%" : undefined,
        fontFamily: "var(--font-display)",
        fontWeight: "var(--fw-semibold)" as unknown as number,
        letterSpacing: "var(--ls-button)",
        borderRadius: shape === "pill" ? "var(--radius-pill)" : "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "var(--motion-hover)",
        whiteSpace: "nowrap",
        background: !disabled && a ? ACTIVE[variant] : !disabled && h ? HOVER[variant] : v.background,
        transform: !disabled && a ? "scale(.98)" : "none",
        ...style,
      }}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}
