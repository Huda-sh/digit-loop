# Supabase setup for Loop

## 1. Create a project

At [supabase.com](https://supabase.com) → New project. Copy the **Project URL** and the
**anon public** key from Project Settings → API into the app's `.env.local`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_LEAD_TOKEN=<a-random-string-only-the-lead-knows>
```

## 2. Run the SQL

Either paste each file into the SQL editor in order, or use the CLI:

```bash
supabase link --project-ref <ref>
supabase db push          # applies migrations/0001_schema.sql, 0002_policies.sql
psql "$(supabase db url)" -f supabase/seed.sql   # optional demo data
```

Order matters: `0001_schema.sql` → `0002_policies.sql` → `0003_lead_delete.sql` → `seed.sql`.

## 3. Auth

- Auth → Providers → **Email**: enable it. Magic-link (OTP) is used, no password.
- Auth → URL Configuration → add your site URL (e.g. `http://localhost:5173`) to
  **Redirect URLs**.

## 4. Make yourself a lead

Sign in once through the app at `/lead-<token>` so your user exists, then:

```sql
insert into public.leads (user_id, email)
select id, email from auth.users where email = 'you@digit.sa';
```

Reload the lead view — you now see every note, including anonymous authors and private
notes.

## What the policies do

| Who | `posts` (raw table) | `feed_posts` (view) | `toggle_vote` RPC |
| --- | --- | --- | --- |
| anonymous visitor | insert only (clean rows) | select — name shown **only** when `visibility = 'public'` | execute |
| signed-in non-lead | insert only | select | execute |
| lead (`leads` row) | select + update (follow-up fields only, enforced by trigger) + **delete** (single or bulk) | select | execute |

Private notes never appear in `feed_posts`. Anonymous authors' names live only in the
raw `posts` table, which non-leads cannot select.
