import { useState } from "react";
import { LeadChrome } from "@/components/LeadChrome";
import { Icon } from "@/ds";
import { SUPABASE_CONFIGURED } from "@/lib/env";

interface Props {
  signInWithEmail: (email: string) => Promise<{ error: string | null }>;
  /** true when there is a session but the user is not on the leads allowlist */
  signedInNotLead: boolean;
  onSignOut: () => void;
}

export function LeadLoginPage({ signInWithEmail, signedInNotLead, onSignOut }: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError(null);
    const { error } = await signInWithEmail(email);
    setBusy(false);
    if (error) setError(error);
    else setSent(true);
  }

  return (
    <LeadChrome>
      <div style={{ display: "flex", justifyContent: "center", padding: "clamp(40px, 12vh, 120px) 20px" }}>
        <div
          className="lp-rise"
          style={{
            width: "min(440px, 100%)",
            background: "var(--ink-800)",
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: "var(--radius-lg)",
            padding: "32px 30px",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              height: 26,
              padding: "0 11px",
              borderRadius: "var(--radius-pill)",
              background: "rgba(255,197,51,.14)",
              color: "var(--gold-500)",
              fontFamily: "var(--font-display)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".12em",
              textTransform: "uppercase",
            }}
          >
            <Icon name="lock" size={12} strokeWidth={2} /> Lead view
          </span>
          <h1 style={{ margin: "18px 0 8px", fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", color: "var(--white)" }}>
            Sign in to read everything
          </h1>
          <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,.6)" }}>
            The unlisted URL gets you to this door. Your email has to be on the lead allowlist to open it —
            that is what protects the anonymous and private notes.
          </p>

          {!SUPABASE_CONFIGURED ? (
            <p style={{ marginTop: 20, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--gold-500)" }}>
              Supabase is not configured yet. See <code>README.md</code>.
            </p>
          ) : signedInNotLead ? (
            <div style={{ marginTop: 20 }}>
              <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 14, color: "#ffb4b4" }}>
                You are signed in, but this account is not on the lead allowlist. Ask an admin to add your
                user id to the <code>leads</code> table.
              </p>
              <button
                onClick={onSignOut}
                style={{
                  marginTop: 16,
                  height: 40,
                  padding: "0 18px",
                  borderRadius: "var(--radius-pill)",
                  border: "1px solid rgba(255,255,255,.18)",
                  background: "rgba(255,255,255,.06)",
                  color: "var(--white)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </div>
          ) : sent ? (
            <p style={{ marginTop: 20, fontFamily: "var(--font-body)", fontSize: 14, color: "var(--gold-500)" }}>
              Check your inbox — there is a magic link to <strong>{email}</strong>. Opening it brings you
              straight back here.
            </p>
          ) : (
            <form onSubmit={submit} style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="email"
                required
                placeholder="you@digit.sa"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  height: 44,
                  padding: "0 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(255,255,255,.18)",
                  background: "rgba(255,255,255,.05)",
                  color: "var(--white)",
                  font: "inherit",
                  fontSize: 15,
                  outline: "none",
                }}
              />
              {error && <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#ffb4b4" }}>{error}</span>}
              <button
                type="submit"
                disabled={busy}
                style={{
                  height: 44,
                  borderRadius: "var(--radius-pill)",
                  border: "none",
                  background: "var(--surface-brand)",
                  color: "var(--white)",
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: busy ? "wait" : "pointer",
                  boxShadow: "var(--shadow-brand)",
                }}
              >
                {busy ? "Sending…" : "Email me a magic link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </LeadChrome>
  );
}
