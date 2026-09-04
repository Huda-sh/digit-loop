import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Textarea, Icon, BrandElement } from "@/ds";
import { CATEGORIES, CATEGORY_ORDER, CHAR_LIMIT } from "@/lib/categories";
import { STRIP, VISIBILITY_OPTIONS } from "@/lib/visibility";
import { getSavedName, saveName } from "@/lib/voter";
import { createPost } from "@/lib/api";
import type { Category, Visibility } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onPosted: (result: { visibility: Visibility; name: string }) => void;
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--text-primary)",
};
const hintStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 12.5,
  color: "var(--text-muted)",
};

export function SharePanel({ open, onClose, onPosted }: Props) {
  const [name, setName] = useState(getSavedName());
  const [cat, setCat] = useState<Category>("kudos");
  const [vis, setVis] = useState<Visibility>("public");
  const [text, setText] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Reset when the panel is (re)opened.
  useEffect(() => {
    if (open) {
      setName(getSavedName());
      setCat("kudos");
      setVis("public");
      setText("");
      setTouched(false);
      setError(null);
      setTimeout(() => panelRef.current?.querySelector("input")?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const len = text.length;
  const nameError = touched && !name.trim();
  const textError = touched && !text.trim();
  const nearLimit = len > CHAR_LIMIT * 0.9;

  const catNote = useMemo(() => {
    const meta = CATEGORIES[cat];
    return meta.defaultVisibility === "private"
      ? "Blockers default to Private so they reach the lead and nobody else. You can change that below."
      : `${meta.label} notes default to Public. You can change that below.`;
  }, [cat]);

  const strip = STRIP[vis];
  const who = name.trim() || "your name";

  function pickCategory(k: Category) {
    setCat(k);
    setVis(CATEGORIES[k].defaultVisibility);
  }

  async function submit() {
    setTouched(true);
    setError(null);
    if (!name.trim() || !text.trim()) return;
    setSubmitting(true);
    try {
      await createPost({ author_name: name, category: cat, visibility: vis, body: text.slice(0, CHAR_LIMIT) });
      saveName(name);
      onPosted({ visibility: vis, name: name.trim() });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not post. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share feedback"
      style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", justifyContent: "flex-end" }}
    >
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "var(--overlay-scrim)", animation: "lp-fade var(--dur-normal) var(--ease-out)" }}
      />
      <div
        ref={panelRef}
        className="lp-scroll"
        style={{
          position: "relative",
          width: "min(496px, 100vw)",
          background: "var(--surface-card)",
          boxShadow: "-22px 0 64px rgba(26,26,26,.24)",
          display: "flex",
          flexDirection: "column",
          animation: "lp-panel-in var(--dur-normal) var(--ease-out)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "26px 28px 18px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, letterSpacing: "-.01em", color: "var(--ink-800)" }}>
              Share feedback
            </h3>
            <p style={{ margin: "6px 0 0", fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--text-secondary)" }}>
              Posts are permanent. Say it the way you would say it out loud.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 12,
              border: "1px solid var(--border-subtle)",
              background: "var(--surface-card)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              flex: "none",
            }}
          >
            <Icon name="x" size={17} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "auto", padding: "22px 28px 8px", display: "flex", flexDirection: "column", gap: 22 }}>
          {/* Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={labelStyle} htmlFor="lp-name">Your name</label>
            <Input
              id="lp-name"
              placeholder="e.g. Huda"
              value={name}
              invalid={nameError}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError ? (
              <span style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--status-danger)" }}>
                <Icon name="alertCircle" size={15} />
                Add your name. Kudos need somewhere to land.
              </span>
            ) : (
              <span style={hintStyle}>Always stored, so the lead can follow up. Shown on the feed only if you post publicly.</span>
            )}
          </div>

          {/* Category */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={labelStyle}>What kind of note is this?</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CATEGORY_ORDER.map((k) => {
                const on = cat === k;
                return (
                  <button
                    key={k}
                    onClick={() => pickCategory(k)}
                    aria-pressed={on}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      height: 42,
                      padding: "0 14px 0 10px",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      fontFamily: "var(--font-display)",
                      fontSize: 14,
                      fontWeight: 600,
                      transition: "var(--motion-hover)",
                      background: on ? "var(--surface-brand-subtle)" : "var(--surface-card)",
                      border: on ? "2px solid var(--purple-500)" : "1px solid var(--border-default)",
                      color: on ? "var(--purple-700)" : "var(--text-secondary)",
                    }}
                  >
                    <BrandElement index={CATEGORIES[k].el} size={22} />
                    {CATEGORIES[k].label}
                  </button>
                );
              })}
            </div>
            <span style={hintStyle}>{catNote}</span>
          </div>

          {/* Feedback */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={labelStyle} htmlFor="lp-text">Your feedback</label>
            <Textarea
              id="lp-text"
              rows={5}
              placeholder="Be specific. Names, moments, what it changed."
              value={text}
              invalid={textError}
              onChange={(e) => setText(e.target.value.slice(0, CHAR_LIMIT))}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 12 }}>
              <span style={{ fontFamily: "var(--font-body)", color: "var(--status-danger)", visibility: textError ? "visible" : "hidden" }}>
                Nothing to post yet.
              </span>
              <span style={{ color: nearLimit ? "var(--gold-900)" : "var(--text-muted)" }}>
                {len} / {CHAR_LIMIT}
              </span>
            </div>
            {nearLimit && (
              <div style={{ height: 4, borderRadius: 999, background: "var(--gray-200)", overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: `${Math.min(100, (len / CHAR_LIMIT) * 100)}%`, background: "var(--gold-500)" }} />
              </div>
            )}
          </div>

          {/* Visibility */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={labelStyle}>Who sees this?</label>
            {VISIBILITY_OPTIONS.map((v) => {
              const on = vis === v.key;
              const dark = v.dark;
              return (
                <button
                  key={v.key}
                  onClick={() => setVis(v.key)}
                  aria-pressed={on}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    width: "100%",
                    textAlign: "left",
                    padding: 14,
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    transition: "var(--motion-hover)",
                    background: on ? (dark ? "var(--gray-100)" : "var(--surface-brand-subtle)") : "var(--surface-card)",
                    border: on
                      ? "2px solid " + (dark ? "var(--ink-800)" : "var(--purple-500)")
                      : "1px solid var(--border-default)",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 34,
                      height: 34,
                      borderRadius: 11,
                      flex: "none",
                      background: on ? (dark ? "var(--ink-800)" : "var(--purple-500)") : "var(--gray-100)",
                      color: on ? "var(--white)" : "var(--text-secondary)",
                    }}
                  >
                    <Icon name={v.icon} size={17} />
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 700, color: on ? (dark ? "var(--ink-900)" : "var(--purple-700)") : "var(--text-primary)" }}>
                      {v.title}
                    </span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.45, color: "var(--text-secondary)" }}>
                      {v.desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "18px 28px 24px", borderTop: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: 14 }}>
          {error && (
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--status-danger)" }}>{error}</div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 11,
              padding: "13px 15px",
              borderRadius: "var(--radius-md)",
              background: strip.bg,
              border: `1px solid ${strip.border}`,
              color: strip.fg,
            }}
          >
            <span style={{ display: "flex", flex: "none", marginTop: 1 }}>
              <Icon name={strip.icon} size={17} />
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13.5, lineHeight: 1.45 }}>
              <strong style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>{strip.title}</strong> — {strip.text(who)}
            </span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="ghost" size="lg" onClick={onClose}>Cancel</Button>
            <div style={{ flex: 1 }}>
              <Button variant="primary" size="lg" fullWidth onClick={submit} disabled={submitting}>
                {submitting ? "Posting…" : strip.postLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
