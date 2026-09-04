import { LEAD_PATH } from "@/lib/env";

export function ConfigNotice() {
  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        padding: "var(--space-8)",
        maxWidth: 620,
      }}
    >
      <div className="eyebrow" style={{ color: "var(--status-danger)" }}>
        Not connected
      </div>
      <h2 style={{ margin: "12px 0 8px", fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink-800)" }}>
        Supabase is not configured
      </h2>
      <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>
        Copy <code>.env.example</code> to <code>.env.local</code> and fill in{" "}
        <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>, then run the SQL in{" "}
        <code>supabase/migrations/</code> and <code>supabase/seed.sql</code>. Full steps are in{" "}
        <code>README.md</code>.
      </p>
      <p style={{ margin: "12px 0 0", fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>
        Lead view lives at <code>{LEAD_PATH}</code>.
      </p>
    </div>
  );
}
