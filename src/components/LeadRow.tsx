import { Link } from "react-router-dom";
import { Icon } from "@/ds";
import { CATEGORIES } from "@/lib/categories";
import { VIS_ROW_STYLE } from "@/lib/visibility";
import { relativeTime } from "@/lib/format";
import type { AdminPost } from "@/lib/types";

const STATUS_STYLE: Record<AdminPost["status"], { bg: string; fg: string; label: string }> = {
  new: { bg: "rgba(255,255,255,.1)", fg: "var(--white)", label: "New" },
  read: { bg: "transparent", fg: "rgba(255,255,255,.35)", label: "Read" },
  followed_up: { bg: "rgba(30,138,95,.18)", fg: "#5fd3a4", label: "Followed up" },
};

const pill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 26,
  borderRadius: "var(--radius-pill)",
  fontFamily: "var(--font-display)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: ".1em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

interface Props {
  post: AdminPost;
  to: string;
  selected: boolean;
  onToggleSelect: (id: string, shiftKey: boolean) => void;
}

export function LeadRow({ post, to, selected, onToggleSelect }: Props) {
  const cat = CATEGORIES[post.category];
  const vis = VIS_ROW_STYLE[post.visibility];
  const status = STATUS_STYLE[post.status];

  return (
    <div
      className="lp-lead-row"
      data-selected={selected || undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 18px",
        borderRadius: "var(--radius-lg)",
        background: selected ? "rgba(155,22,232,.14)" : "var(--ink-800)",
        border: "1px solid " + (selected ? "var(--purple-400)" : "rgba(255,255,255,.12)"),
        transition: "var(--motion-hover)",
      }}
    >
      <button
        role="checkbox"
        aria-checked={selected}
        aria-label={selected ? "Deselect note" : "Select note"}
        onClick={(e) => onToggleSelect(post.id, e.shiftKey)}
        style={{
          width: 20,
          height: 20,
          flex: "none",
          borderRadius: "var(--radius-xs)",
          border: "1px solid " + (selected ? "var(--purple-400)" : "rgba(255,255,255,.28)"),
          background: selected ? "var(--surface-brand)" : "transparent",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--white)",
          transition: "var(--motion-hover)",
        }}
      >
        {selected && <Icon name="check" size={13} strokeWidth={3} />}
      </button>

      <Link
        to={to}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          flex: 1,
          minWidth: 0,
          color: "inherit",
          textDecoration: "none",
        }}
      >
        <span style={{ ...pill, width: 110, flex: "none", padding: "0 10px", background: vis.bg, color: vis.fg }}>
          {vis.label}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            width: 116,
            flex: "none",
            fontFamily: "var(--font-display)",
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,.82)",
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: 3, background: cat.dot }} />
          {cat.label}
        </span>
        <span style={{ width: 92, flex: "none", fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 700, color: "var(--white)" }}>
          {post.author_name}
        </span>
        <span
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily: "var(--font-body)",
            fontSize: 14.5,
            color: "rgba(255,255,255,.62)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {post.body}
        </span>
        <span style={{ width: 84, flex: "none", textAlign: "right", fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,.45)" }}>
          {relativeTime(post.created_at)}
        </span>
        <span style={{ ...pill, width: 104, flex: "none", letterSpacing: ".08em", background: status.bg, color: status.fg }}>
          {status.label}
        </span>
        <Icon name="chevronRight" size={17} strokeWidth={2} style={{ flex: "none", color: "rgba(255,255,255,.4)" }} />
      </Link>
    </div>
  );
}
