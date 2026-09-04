# Loop

A continuous-retro feedback tool for the Digit software team. Kudos, ideas, blockers,
process and culture notes — public, anonymous, or private to the team lead. Built from
the Claude Design mockup in [`project/`](project/) against the Digit Innovation Hub
design system.

- **Stack:** Vite + React 18 + TypeScript, React Router, Supabase (Postgres + Auth + RLS).
- **Design source:** [`project/Loop - Feedback Tool Mockups.dc.html`](project/Loop%20-%20Feedback%20Tool%20Mockups.dc.html)
  and the token bundle under `project/_ds/…`. Tokens are copied verbatim into
  [`src/styles/`](src/styles/).

## Screens

| Route | Screen | Mockup |
| --- | --- | --- |
| `/` | Public feed — two-column cards, category filter, live upvotes | S1 |
| `/` → "Share feedback" | Slide-over: name, category, char-limited body, 3-card visibility picker, live confirmation strip | S2 / S3 |
| `/` after posting | Success state — repeats the visibility decision back, three endings | S4 |
| `/lead-<token>` | Lead view — ink-dark, stats, search, category/visibility/date filters, CSV export, note list, row selection + **bulk delete** | S5 |
| `/lead-<token>/n/:id` | Note detail beside the list — read-only note, lead-only follow-up record, **delete note**, related notes | S6 |

The `<token>` comes from `VITE_LEAD_TOKEN`. The unlisted URL is convenience only —
**access is enforced by Supabase Auth + the `leads` allowlist** (see `supabase/README.md`).
Anonymous authors' names and private notes are never sent to non-leads: the public feed
reads a view (`feed_posts`) that drops them.

## Getting started

```bash
npm install
cp .env.example .env.local     # fill in Supabase URL + anon key + a lead token
# then set up the database — see supabase/README.md
npm run dev
```

Without Supabase configured the UI still renders and tells you what is missing.

### Database

SQL lives in [`supabase/`](supabase/). Apply in order:

1. `migrations/0001_schema.sql` — tables, enums, immutability trigger
2. `migrations/0002_policies.sql` — RLS, the `feed_posts` view, `toggle_vote` / `my_votes` / `is_lead` RPCs
3. `seed.sql` — optional demo data matching the mockup

Then enable Email auth, add your redirect URL, and add yourself to `public.leads`.
Full walkthrough: [`supabase/README.md`](supabase/README.md).

## Scripts

| Command | What |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | `tsc` only |

## Project layout

```
src/
  ds/            design-system primitives ported from the bundle (Button, Tag, Badge, Input, …)
  components/    app components (FeedCard, SharePanel, LeadChrome, LeadRow, …)
  pages/         FeedPage, LeadLoginPage, LeadPage, LeadNotePage
  hooks/         useLeadAuth, useAdminPosts
  lib/           supabase client, api calls, categories/visibility metadata, formatting
  styles/        Digit tokens (verbatim) + app layout CSS
supabase/        migrations + seed + setup notes
project/         the original Claude Design handoff bundle (reference, not built)
```

## Deliberate design decisions

- **Visibility is three cards, never a dropdown**, and the panel ends with a plain-language
  strip stating exactly what will happen and who sees the name.
- **Posts are permanent to their author.** No edit, no delete from the feed side — the UI
  says so before you submit, and a Postgres trigger enforces it (the only author-mutable
  fields are none; the lead's follow-up record is the sole exception). The **lead** can
  remove a note (single from the detail view, or bulk-select from the list) — a
  `posts_delete_lead` RLS policy scoped to the `leads` allowlist, always behind a
  confirm.
- **Blockers default to Private.** Category selection sets a sensible visibility default you
  can still override.
- **The lead view is ink-dark end to end** so it never looks like the room the team is
  standing in.
- **No points, no streaks.** The only motion is the upvote pop and the panel slide;
  `prefers-reduced-motion` drops both.

## Substitutions carried over from the design system

Flagged in the bundle, still true here: **Outfit / IBM Plex Sans Arabic / IBM Plex Mono**
stand in for the licensed brand faces, and **Lucide-geometry inline icons** stand in for a
real icon set. Swap both when Digit provides the originals.
