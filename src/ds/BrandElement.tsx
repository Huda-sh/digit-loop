import type { CSSProperties } from "react";

interface Props {
  index?: number;
  size?: number;
  opacity?: number;
  rotate?: number;
  style?: CSSProperties;
  className?: string;
}

/** One of the 14 geometric Digit brand marks. Decorative only. */
export function BrandElement({ index = 1, size = 96, opacity = 1, rotate = 0, style, className }: Props) {
  const n = String(Math.min(14, Math.max(1, index))).padStart(2, "0");
  return (
    <img
      src={`/assets/elements/element-${n}.png`}
      alt=""
      aria-hidden="true"
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        opacity,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
