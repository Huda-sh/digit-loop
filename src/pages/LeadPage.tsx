import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LeadChrome } from "@/components/LeadChrome";
import { LeadStats } from "@/components/LeadStats";
import { LeadRow } from "@/components/LeadRow";
import { LeadFilters, DEFAULT_FILTERS, type FilterState } from "@/components/LeadFilters";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Icon } from "@/ds";
import { useAdminPosts } from "@/hooks/useAdminPosts";
import { filterPosts } from "@/lib/filterPosts";
import { postsToCsv, downloadCsv } from "@/lib/format";
import { deletePosts } from "@/lib/api";
import { LEAD_PATH } from "@/lib/env";
import type { Session } from "@supabase/supabase-js";

interface Props {
  session: Session;
  onSignOut: () => void;
}

export function LeadPage({ session, onSignOut }: Props) {
  const { posts, loading, error, reload, remove } = useAdminPosts(true);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const anchorRef = useRef<string | null>(null);

  const visible = useMemo(() => filterPosts(posts, filters), [posts, filters]);
  const visibleIds = useMemo(() => visible.map((p) => p.id), [visible]);

  // Drop any selection that the current filters have hidden.
  useEffect(() => {
    setSelected((prev) => {
      const keep = new Set(visibleIds);
      const next = new Set([...prev].filter((id) => keep.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [visibleIds]);

  const toggleSelect = useCallback(
    (id: string, shiftKey: boolean) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (shiftKey && anchorRef.current) {
          const a = visibleIds.indexOf(anchorRef.current);
          const b = visibleIds.indexOf(id);
          if (a !== -1 && b !== -1) {
            const [lo, hi] = a < b ? [a, b] : [b, a];
            for (let i = lo; i <= hi; i++) next.add(visibleIds[i]);
            return next;
          }
        }
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
      anchorRef.current = id;
    },
    [visibleIds],
  );

  const allSelected = visible.length > 0 && selected.size === visible.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(visibleIds));
  }

  async function confirmDelete() {
    setDeleting(true);
    setDeleteError(null);
    const ids = [...selected];
    try {
      await deletePosts(ids);
      remove(ids);
      setSelected(new Set());
      setConfirming(false);
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Could not delete. Try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <LeadChrome email={session.user.email} onSignOut={onSignOut}>
      <main style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "34px clamp(20px, 5vw, 40px) 64px" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 800, letterSpacing: "-.02em", color: "var(--white)" }}>
          Everything the team has said
        </h1>
        <p style={{ margin: "10px 0 0", fontFamily: "var(--font-body)", fontSize: 15, color: "rgba(255,255,255,.6)" }}>
          Public, anonymous and private — {posts.length} note{posts.length === 1 ? "" : "s"} since the tool went up.
        </p>

        <LeadStats posts={posts} />

        <LeadFilters
          value={filters}
          onChange={setFilters}
          onExport={() =>
            downloadCsv(
              `loop-feedback-${new Date().toISOString().slice(0, 10)}.csv`,
              postsToCsv(visible),
            )
          }
        />

        {/* Selection / bulk-action bar */}
        {selected.size > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
              marginTop: 18,
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              background: "rgba(155,22,232,.12)",
              border: "1px solid var(--purple-400)",
            }}
          >
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--white)" }}>
              {selected.size} selected
            </span>
            <button
              onClick={toggleAll}
              style={linkBtn}
            >
              {allSelected ? "Clear all" : `Select all ${visible.length}`}
            </button>
            {!allSelected && (
              <button onClick={() => setSelected(new Set())} style={linkBtn}>
                Clear
              </button>
            )}
            <div style={{ flex: 1 }} />
            <button
              onClick={() => {
                setDeleteError(null);
                setConfirming(true);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 40,
                padding: "0 16px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid transparent",
                background: "var(--status-danger)",
                color: "var(--white)",
                fontFamily: "var(--font-display)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Icon name="x" size={16} strokeWidth={2.5} />
              Delete {selected.size} note{selected.size === 1 ? "" : "s"}
            </button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
          {error ? (
            <p style={{ color: "#ffb4b4", fontFamily: "var(--font-body)" }}>
              {error}{" "}
              <button onClick={() => void reload()} style={{ color: "var(--gold-500)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                retry
              </button>
            </p>
          ) : loading ? (
            <p style={{ color: "rgba(255,255,255,.5)", fontFamily: "var(--font-body)" }}>Loading feedback…</p>
          ) : visible.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,.5)", fontFamily: "var(--font-body)", padding: "24px 0" }}>
              No notes match these filters.
            </p>
          ) : (
            visible.map((p) => (
              <LeadRow
                key={p.id}
                post={p}
                to={`${LEAD_PATH}/n/${p.id}`}
                selected={selected.has(p.id)}
                onToggleSelect={toggleSelect}
              />
            ))
          )}
        </div>
      </main>

      <ConfirmDialog
        open={confirming}
        title={`Delete ${selected.size} note${selected.size === 1 ? "" : "s"}?`}
        body={
          (deleteError ? `${deleteError}\n\n` : "") +
          "This removes the note and its upvotes for good. If it was public, it disappears from the team feed too. This cannot be undone."
        }
        confirmLabel={`Delete ${selected.size}`}
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setConfirming(false)}
      />
    </LeadChrome>
  );
}

const linkBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-display)",
  fontSize: 13,
  fontWeight: 600,
  color: "rgba(255,255,255,.7)",
  textDecoration: "underline",
  textUnderlineOffset: 3,
};
