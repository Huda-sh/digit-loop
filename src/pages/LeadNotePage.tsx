import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LeadChrome } from "@/components/LeadChrome";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button, Icon } from "@/ds";
import { useAdminPosts } from "@/hooks/useAdminPosts";
import { deletePosts, markOpened, saveLeadNote, setFollowedUp } from "@/lib/api";
import { CATEGORIES } from "@/lib/categories";
import { VIS_ROW_STYLE } from "@/lib/visibility";
import { fullTimestamp, relativeTime, timeOfDay, initialOf } from "@/lib/format";
import { LEAD_PATH } from "@/lib/env";
import type { Session } from "@supabase/supabase-js";
import type { AdminPost } from "@/lib/types";

interface Props {
  session: Session;
  onSignOut: () => void;
}

const eyebrow: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,.45)",
};

const darkPill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  height: 28,
  padding: "0 12px",
  borderRadius: "var(--radius-pill)",
  fontFamily: "var(--font-display)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: ".1em",
  textTransform: "uppercase",
};

export function LeadNotePage({ session, onSignOut }: Props) {
  const { id } = useParams<{ id: string }>();
  const { posts, loading, error, patch, remove } = useAdminPosts(true);
  const note = useMemo(() => posts.find((p) => p.id === id), [posts, id]);
  const navigate = useNavigate();

  const [draft, setDraft] = useState("");
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const openedRef = useRef<string | null>(null);

  useEffect(() => {
    if (note) setDraft(note.lead_note ?? "");
  }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (note && note.status === "new" && openedRef.current !== note.id) {
      openedRef.current = note.id;
      void markOpened(note.id).then(() =>
        patch(note.id, { status: "read", opened_at: new Date().toISOString() }),
      );
    }
  }, [note, patch]);

  const sidebar = useMemo(() => {
    if (!note) return [];
    return posts.filter((p) => p.visibility === note.visibility);
  }, [posts, note]);

  const awaiting = sidebar.filter((p) => p.status !== "followed_up").length;

  const related = useMemo(() => {
    if (!note) return [];
    const fortnight = 14 * 24 * 60 * 60 * 1000;
    const t = new Date(note.created_at).getTime();
    return posts
      .filter((p) => p.id !== note.id && Math.abs(new Date(p.created_at).getTime() - t) <= fortnight)
      .slice(0, 3);
  }, [posts, note]);

  async function persistNote() {
    if (!note || draft === (note.lead_note ?? "")) return;
    await saveLeadNote(note.id, draft);
    patch(note.id, { lead_note: draft });
    setSavedNote("Saved");
    setTimeout(() => setSavedNote(null), 1600);
  }

  async function toggleFollowedUp() {
    if (!note) return;
    const next = note.status !== "followed_up";
    await setFollowedUp(note.id, next);
    patch(note.id, {
      status: next ? "followed_up" : "read",
      followed_up_at: next ? new Date().toISOString() : null,
    });
  }

  async function confirmDelete() {
    if (!note) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deletePosts([note.id]);
      remove([note.id]);
      navigate(LEAD_PATH, { replace: true });
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Could not delete. Try again.");
      setDeleting(false);
    }
  }

  const cat = note ? CATEGORIES[note.category] : null;
  const vis = note ? VIS_ROW_STYLE[note.visibility] : null;

  return (
    <LeadChrome email={session.user.email} onSignOut={onSignOut}>
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "18px clamp(12px, 3vw, 24px) 0" }}>
        <Link to={LEAD_PATH} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.6)", fontFamily: "var(--font-body)", fontSize: 13.5 }}>
          <Icon name="chevronRight" size={14} strokeWidth={2} style={{ transform: "rotate(180deg)" }} />
          All feedback
        </Link>
      </div>

      <div className="lp-note-split" style={{ maxWidth: "var(--container-max)", margin: "12px auto 0", padding: "0 clamp(12px, 3vw, 24px) 56px" }}>
        {/* Rail */}
        <aside
          className="lp-scroll"
          style={{
            borderRight: "1px solid rgba(255,255,255,.12)",
            padding: "8px 14px 8px 0",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ ...eyebrow, padding: "0 6px 6px" }}>
            {note ? `${vis?.label} · ${awaiting} awaiting reply` : "Notes"}
          </div>
          {sidebar.map((p) => {
            const on = p.id === id;
            return (
              <Link
                key={p.id}
                to={`${LEAD_PATH}/n/${p.id}`}
                style={{
                  padding: "15px 16px",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  color: "inherit",
                  background: on ? "rgba(255,255,255,.08)" : "var(--ink-800)",
                  border: on ? "1px solid rgba(255,197,51,.5)" : "1px solid rgba(255,255,255,.12)",
                  transition: "var(--motion-hover)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ ...darkPill, height: 22, padding: "0 9px", background: VIS_ROW_STYLE[p.visibility].bg, color: VIS_ROW_STYLE[p.visibility].fg }}>
                    {VIS_ROW_STYLE[p.visibility].label}
                  </span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--white)" }}>{p.author_name}</span>
                  <div style={{ flex: 1 }} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,.4)" }}>{relativeTime(p.created_at)}</span>
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: "var(--font-body)",
                    fontSize: 13.5,
                    lineHeight: 1.45,
                    color: "rgba(255,255,255,.66)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {p.body}
                </div>
              </Link>
            );
          })}
        </aside>

        {/* Detail */}
        <section style={{ padding: "26px clamp(16px, 3vw, 40px) 40px", position: "relative", overflow: "hidden" }}>
          {loading && !note ? (
            <p style={{ color: "rgba(255,255,255,.5)" }}>Loading…</p>
          ) : error ? (
            <p style={{ color: "#ffb4b4" }}>{error}</p>
          ) : !note ? (
            <p style={{ color: "rgba(255,255,255,.6)" }}>
              That note is not here. <Link to={LEAD_PATH} style={{ color: "var(--gold-500)" }}>Back to the list</Link>.
            </p>
          ) : (
            <NoteDetail
              note={note}
              catLabel={cat!.label}
              visLabel={vis!.label}
              draft={draft}
              setDraft={setDraft}
              onBlurSave={persistNote}
              savedNote={savedNote}
              onToggleFollowedUp={toggleFollowedUp}
              onDelete={() => {
                setDeleteError(null);
                setConfirmingDelete(true);
              }}
              related={related}
            />
          )}
        </section>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this note?"
        body={
          (deleteError ? `${deleteError}\n\n` : "") +
          (note?.visibility === "public"
            ? "This removes the note and its upvotes for good, and it disappears from the team feed. This cannot be undone."
            : "This removes the note and its upvotes for good. This cannot be undone.")
        }
        confirmLabel="Delete note"
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setConfirmingDelete(false)}
      />
    </LeadChrome>
  );
}

function NoteDetail({
  note,
  catLabel,
  visLabel,
  draft,
  setDraft,
  onBlurSave,
  savedNote,
  onToggleFollowedUp,
  onDelete,
  related,
}: {
  note: AdminPost;
  catLabel: string;
  visLabel: string;
  draft: string;
  setDraft: (v: string) => void;
  onBlurSave: () => void;
  savedNote: string | null;
  onToggleFollowedUp: () => void;
  onDelete: () => void;
  related: AdminPost[];
}) {
  const followedUp = note.status === "followed_up";
  const mailto = `mailto:?subject=${encodeURIComponent("Re: your note on Loop")}&body=${encodeURIComponent(
    `Hi ${note.author_name},\n\nAbout what you shared:\n\n> ${note.body}\n\n`,
  )}`;

  return (
    <>
      <BrandCorner index={CATEGORIES[note.category].el} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ ...darkPill, background: "rgba(255,197,51,.14)", color: "var(--gold-500)" }}>
          <Icon name="lock" size={12} strokeWidth={2} /> {visLabel}
        </span>
        <span style={{ ...darkPill, background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.8)" }}>{catLabel}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,.45)" }}>
          {fullTimestamp(note.created_at)}
        </span>
        <button
          onClick={onDelete}
          title="Delete note"
          aria-label="Delete note"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            height: 30,
            padding: "0 12px",
            borderRadius: "var(--radius-pill)",
            border: "1px solid rgba(198,40,40,.4)",
            background: "rgba(198,40,40,.12)",
            color: "#ff9b9b",
            fontFamily: "var(--font-display)",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Icon name="x" size={13} strokeWidth={2.5} />
          Delete
        </button>
      </div>

      <p
        style={{
          position: "relative",
          margin: "26px 0 0",
          maxWidth: 760,
          fontFamily: "var(--font-body)",
          fontSize: 22,
          lineHeight: 1.55,
          color: "var(--white)",
          textWrap: "pretty",
        }}
      >
        {note.body}
      </p>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: 28,
          padding: "16px 18px",
          borderRadius: "var(--radius-lg)",
          background: "var(--ink-800)",
          border: "1px solid rgba(255,255,255,.12)",
          maxWidth: 760,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 13,
            background: "rgba(255,255,255,.08)",
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--white)",
          }}
        >
          {initialOf(note.author_name)}
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--white)" }}>
            {note.author_name}
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,.55)" }}>
            {note.visibility === "public"
              ? "Posted publicly, name on the feed."
              : note.visibility === "anonymous"
                ? `Name visible to you only. ${note.author_name} chose Anonymous, so the feed shows no name.`
                : `Name visible to you only. ${note.author_name} chose Private, so nothing about this is on the feed.`}
          </span>
        </div>
      </div>

      {/* Follow-up */}
      <div style={{ position: "relative", marginTop: 32, maxWidth: 760 }}>
        <div style={eyebrow}>Your follow-up</div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={onBlurSave}
          placeholder="Add a note for yourself. Only you will ever read this."
          rows={4}
          style={{
            marginTop: 12,
            width: "100%",
            minHeight: 96,
            padding: "14px 16px",
            borderRadius: "var(--radius-md)",
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.16)",
            color: "var(--white)",
            font: "inherit",
            fontSize: 15,
            lineHeight: 1.5,
            outline: "none",
            resize: "vertical",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <Button variant={followedUp ? "outline" : "primary"} size="md" onClick={onToggleFollowedUp}>
            {followedUp ? "Reopen" : "Mark as followed up"}
          </Button>
          <a href={mailto}>
            <Button variant="onInk" size="md" leadingIcon={<Icon name="mail" size={16} strokeWidth={2} />}>
              Reply by email
            </Button>
          </a>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,.4)" }}>
            {savedNote
              ? savedNote
              : note.opened_at
                ? `Received ${timeOfDay(note.created_at)} · opened by you ${timeOfDay(note.opened_at)}`
                : `Received ${timeOfDay(note.created_at)}`}
          </span>
        </div>
        {followedUp && note.followed_up_at && (
          <p style={{ marginTop: 10, fontFamily: "var(--font-body)", fontSize: 13, color: "#5fd3a4" }}>
            Followed up {fullTimestamp(note.followed_up_at)}.
          </p>
        )}
      </div>

      {related.length > 0 && (
        <div style={{ position: "relative", marginTop: 34, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,.12)", maxWidth: 760 }}>
          <div style={{ ...eyebrow, marginBottom: 14 }}>Related, same fortnight</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {related.map((r) => (
              <Link
                key={r.id}
                to={`${LEAD_PATH}/n/${r.id}`}
                style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(255,255,255,.62)", textDecoration: "none" }}
              >
                <span style={{ width: 9, height: 9, borderRadius: 3, background: CATEGORIES[r.category].dot, flex: "none" }} />
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--white)" }}>{r.author_name}</span>
                <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.body}</span>
                <span style={{ color: "rgba(255,255,255,.4)", flex: "none" }}>{relativeTime(r.created_at)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function BrandCorner({ index }: { index: number }) {
  const n = String(Math.min(14, Math.max(1, index))).padStart(2, "0");
  return (
    <img
      src={`/assets/elements/element-${n}.png`}
      alt=""
      aria-hidden
      style={{ position: "absolute", top: -30, right: -24, width: 220, height: 220, objectFit: "contain", opacity: 0.06 }}
    />
  );
}
