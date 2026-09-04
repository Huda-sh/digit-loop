import { useState } from "react";
import { BrandElement, Badge, Icon } from "@/ds";
import { CATEGORIES } from "@/lib/categories";
import { relativeTime, initialOf } from "@/lib/format";
import type { FeedPost } from "@/lib/types";

interface Props {
  post: FeedPost;
  voted: boolean;
  onVote: (post: FeedPost) => void;
}

export function FeedCard({ post, voted, onVote }: Props) {
  const c = CATEGORIES[post.category];
  const [hover, setHover] = useState(false);
  const [bump, setBump] = useState(0);
  const anon = post.visibility === "anonymous";
  const displayName = anon ? "Anonymous" : (post.author_name ?? "");

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: hover ? "translateY(-2px)" : "none",
        padding: "var(--space-6)",
        transition: "var(--motion-hover)",
      }}
    >
      <BrandElement
        index={c.el}
        size={132}
        opacity={0.13}
        style={{ position: "absolute", top: -20, right: -16 }}
      />

      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <Badge tone={c.tone}>{c.label}</Badge>
        {anon && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              height: 22,
              padding: "0 9px",
              borderRadius: "var(--radius-pill)",
              background: "var(--gray-100)",
              color: "var(--ink-600)",
              fontFamily: "var(--font-display)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
            }}
          >
            <Icon name="mask" size={12} />
            Anonymous
          </span>
        )}
      </div>

      <p
        style={{
          position: "relative",
          margin: "14px 0 20px",
          fontFamily: "var(--font-body)",
          fontSize: 17,
          lineHeight: 1.55,
          color: "var(--text-primary)",
          textWrap: "pretty",
        }}
      >
        {post.body}
      </p>

      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontSize: 14,
            fontWeight: 700,
            flex: "none",
            background: anon ? "var(--gray-200)" : c.tint,
            color: anon ? "var(--ink-500)" : c.ink,
            boxShadow: `inset 0 0 0 1px ${anon ? "var(--gray-300)" : c.dot}`,
          }}
        >
          {anon ? "·" : initialOf(post.author_name)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
            {displayName}
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
            {relativeTime(post.created_at)}
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => {
            onVote(post);
            setBump((b) => b + 1);
          }}
          aria-pressed={voted}
          aria-label={voted ? "Remove your upvote" : "Upvote"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            height: 34,
            padding: "0 14px",
            borderRadius: "var(--radius-pill)",
            cursor: "pointer",
            fontFamily: "var(--font-display)",
            fontSize: 13.5,
            fontWeight: 600,
            transition: "var(--motion-hover)",
            background: voted ? "var(--surface-brand-subtle)" : "var(--surface-card)",
            border: "1px solid " + (voted ? "var(--border-brand)" : "var(--border-subtle)"),
            color: voted ? "var(--purple-700)" : "var(--text-secondary)",
          }}
        >
          <span
            key={bump}
            style={{ display: "inline-flex", animation: bump ? "lp-pop 260ms var(--ease-standard)" : "none" }}
          >
            <Icon name="arrowUp" size={15} strokeWidth={2} />
          </span>
          <span>{post.votes}</span>
        </button>
      </div>
    </article>
  );
}
