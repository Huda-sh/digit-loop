import { useMemo } from "react";
import { medianReplyDays } from "@/lib/format";
import type { AdminPost } from "@/lib/types";

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
}

export function LeadStats({ posts }: { posts: AdminPost[] }) {
  const stats = useMemo(() => {
    const monthStart = startOfMonth();
    const thisMonth = posts.filter((p) => new Date(p.created_at).getTime() >= monthStart).length;
    const awaiting = posts.filter((p) => p.visibility === "private" && p.status !== "followed_up").length;
    const median = medianReplyDays(posts);
    const publicPct = posts.length
      ? Math.round((posts.filter((p) => p.visibility === "public").length / posts.length) * 100)
      : 0;
    return { total: posts.length, thisMonth, awaiting, median, publicPct };
  }, [posts]);

  const items: { value: string; label: string; accent?: boolean }[] = [
    { value: String(stats.thisMonth), label: "notes this month" },
    { value: String(stats.awaiting), label: "private, awaiting your reply", accent: true },
    {
      value: stats.median == null ? "—" : `${stats.median.toFixed(1)} days`,
      label: "median time to reply",
    },
    { value: `${stats.publicPct}%`, label: "posted publicly" },
  ];

  return (
    <div style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
      {items.map((it) => (
        <div
          key={it.label}
          style={{
            flex: "1 1 180px",
            padding: "18px 20px",
            borderRadius: "var(--radius-lg)",
            background: "var(--ink-800)",
            border: `1px solid ${it.accent ? "rgba(255,197,51,.35)" : "rgba(255,255,255,.12)"}`,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 30,
              fontWeight: 800,
              color: it.accent ? "var(--gold-500)" : "var(--white)",
            }}
          >
            {it.value}
          </div>
          <div style={{ marginTop: 4, fontFamily: "var(--font-body)", fontSize: 13.5, color: "rgba(255,255,255,.6)" }}>
            {it.label}
          </div>
        </div>
      ))}
    </div>
  );
}
