import { useCallback, useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { FeedCard } from "@/components/FeedCard";
import { SharePanel } from "@/components/SharePanel";
import { SuccessView } from "@/components/SuccessView";
import { Button, Tag, Icon, EmptyState } from "@/ds";
import { CATEGORIES, CATEGORY_ORDER } from "@/lib/categories";
import { fetchFeed, fetchMyVotes, toggleVote } from "@/lib/api";
import { SUPABASE_CONFIGURED } from "@/lib/env";
import type { Category, FeedPost, Visibility } from "@/lib/types";
import { ConfigNotice } from "@/components/ConfigNotice";

type Filter = "everything" | Category;

export function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [myVotes, setMyVotes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("everything");
  const [panelOpen, setPanelOpen] = useState(false);
  const [success, setSuccess] = useState<{ visibility: Visibility; name: string } | null>(null);

  const load = useCallback(async (opts?: { background?: boolean }) => {
    if (!opts?.background) setLoading(true);
    setError(null);
    try {
      const [feed, votes] = await Promise.all([fetchFeed(), fetchMyVotes()]);
      setPosts(feed);
      setMyVotes(votes);
    } catch (e) {
      if (!opts?.background) setError(e instanceof Error ? e.message : "Could not load the feed.");
    } finally {
      if (!opts?.background) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) {
      setLoading(false);
      return;
    }
    void load();
    // Keep the feed current when the tab is brought back into focus.
    const onFocus = () => {
      if (document.visibilityState === "visible") void load({ background: true });
    };
    document.addEventListener("visibilitychange", onFocus);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  const onVote = useCallback(
    async (post: FeedPost) => {
      const wasVoted = myVotes.has(post.id);
      // optimistic
      setMyVotes((prev) => {
        const next = new Set(prev);
        wasVoted ? next.delete(post.id) : next.add(post.id);
        return next;
      });
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, votes: p.votes + (wasVoted ? -1 : 1) } : p)));
      try {
        const count = await toggleVote(post.id);
        setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, votes: count } : p)));
      } catch {
        void load({ background: true }); // reconcile on failure
      }
    },
    [myVotes, load],
  );

  const filtered = useMemo(
    () => (filter === "everything" ? posts : posts.filter((p) => p.category === filter)),
    [posts, filter],
  );

  const columns = useMemo(() => {
    const a: FeedPost[] = [];
    const b: FeedPost[] = [];
    filtered.forEach((p, i) => (i % 2 === 0 ? a : b).push(p));
    return [a, b];
  }, [filtered]);

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
        <AppHeader />
        <SuccessView
          visibility={success.visibility}
          name={success.name}
          onWriteAnother={() => {
            setSuccess(null);
            setPanelOpen(true);
            void load({ background: true });
          }}
          onBackToFeed={() => {
            setSuccess(null);
            void load({ background: true });
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      <AppHeader
        action={
          <Button size="md" onClick={() => setPanelOpen(true)}>
            Share feedback
          </Button>
        }
      />

      <main style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 clamp(20px, 5vw, 40px)" }}>
        {/* Hero */}
        <section style={{ padding: "46px 0 6px" }}>
          <div className="eyebrow">Continuous retro</div>
          <h1
            style={{
              margin: "12px 0 0",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-.02em",
              lineHeight: 1.05,
              color: "var(--ink-800)",
            }}
          >
            Say it while it is still fresh
          </h1>
          <p style={{ margin: "14px 0 0", maxWidth: 600, fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.55, color: "var(--text-secondary)" }}>
            Kudos, ideas and process notes from the whole team — Core and SLA, interns and volunteers.
            No account, no meeting, no waiting for the next retro.
          </p>
        </section>
      </main>

      <div
        aria-hidden
        style={{
          height: 44,
          margin: "34px 0 0",
          backgroundImage: "url(/assets/pattern-tile.png)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 44px",
          opacity: 0.16,
        }}
      />

      <main style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 clamp(20px, 5vw, 40px)" }}>
        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "28px 0 0" }}>
          <Tag selected={filter === "everything"} onClick={() => setFilter("everything")}>
            Everything
          </Tag>
          {CATEGORY_ORDER.map((k) => (
            <Tag key={k} selected={filter === k} onClick={() => setFilter(k)}>
              {CATEGORIES[k].label}
            </Tag>
          ))}
          <div style={{ flex: 1 }} />
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            <Icon name="lock" size={14} />
            Concerns go straight to the lead. They never appear here.
          </span>
        </div>

        {/* Feed */}
        <section style={{ padding: "24px 0 64px" }}>
          {!SUPABASE_CONFIGURED ? (
            <ConfigNotice />
          ) : error ? (
            <EmptyState
              element={1}
              title="The feed did not load"
              description={error}
              action={<Button variant="outline" onClick={() => void load()}>Try again</Button>}
            />
          ) : loading ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading the feed…</p>
          ) : filtered.length === 0 ? (
            <EmptyState
              element={8}
              title="Nothing here yet"
              description="Someone has to go first. A specific thank-you is the easiest one to write."
              action={<Button onClick={() => setPanelOpen(true)}>Share feedback</Button>}
            />
          ) : (
            <div className="lp-feed-grid">
              {columns.map((col, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {col.map((p) => (
                    <FeedCard key={p.id} post={p} voted={myVotes.has(p.id)} onVote={onVote} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <SharePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onPosted={(result) => {
          setPanelOpen(false);
          setSuccess(result);
          // Pull the new post into the feed in the background so it is there
          // the moment the poster returns from the success screen.
          void load({ background: true });
        }}
      />
    </div>
  );
}
