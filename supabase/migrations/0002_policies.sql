-- Loop — RLS, the public feed view, and RPCs.

alter table public.posts       enable row level security;
alter table public.post_votes  enable row level security;
alter table public.leads       enable row level security;

-- ---------------------------------------------------------------------------
-- is_lead(): is the current auth user on the allowlist?
-- ---------------------------------------------------------------------------
create or replace function public.is_lead()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.leads where user_id = auth.uid());
$$;
grant execute on function public.is_lead() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- posts policies
-- ---------------------------------------------------------------------------

-- Anyone may post, but only a "clean" row: no pre-set votes/status/lead fields.
drop policy if exists posts_insert_any on public.posts;
create policy posts_insert_any on public.posts
  for insert to anon, authenticated
  with check (
    votes = 0
    and status = 'new'
    and lead_note is null
    and followed_up_at is null
    and opened_at is null
  );

-- Only leads can read the raw table (names on anonymous/private notes live here).
drop policy if exists posts_select_lead on public.posts;
create policy posts_select_lead on public.posts
  for select to authenticated
  using (public.is_lead());

-- Only leads can update, and the trigger restricts them to the follow-up fields.
drop policy if exists posts_update_lead on public.posts;
create policy posts_update_lead on public.posts
  for update to authenticated
  using (public.is_lead())
  with check (public.is_lead());

-- Column-level insert grant (defaults fill the rest).
grant insert (author_name, category, visibility, body) on public.posts to anon, authenticated;
grant select, update on public.posts to authenticated;

-- ---------------------------------------------------------------------------
-- post_votes: no direct client access; the RPC (security definer) owns it.
-- ---------------------------------------------------------------------------
-- (RLS enabled, no policies => deny all for anon/authenticated.)

-- ---------------------------------------------------------------------------
-- leads: a lead may see their own row; no client writes.
-- ---------------------------------------------------------------------------
drop policy if exists leads_select_self on public.leads;
create policy leads_select_self on public.leads
  for select to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Public feed view — safe columns only, name hidden unless truly public.
-- ---------------------------------------------------------------------------
create or replace view public.feed_posts
with (security_invoker = off) as
  select
    id,
    category,
    visibility,
    case when visibility = 'public' then author_name else null end as author_name,
    body,
    votes,
    created_at
  from public.posts
  where visibility in ('public', 'anonymous');

grant select on public.feed_posts to anon, authenticated;

-- ---------------------------------------------------------------------------
-- toggle_vote(post, voter) -> new count
-- ---------------------------------------------------------------------------
create or replace function public.toggle_vote(p_post_id uuid, p_voter_id text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_exists boolean;
  v_count  integer;
begin
  if p_voter_id is null or char_length(p_voter_id) < 8 then
    raise exception 'invalid voter id';
  end if;

  if not exists (
    select 1 from public.posts
    where id = p_post_id and visibility in ('public','anonymous')
  ) then
    raise exception 'post is not votable';
  end if;

  select exists (
    select 1 from public.post_votes where post_id = p_post_id and voter_id = p_voter_id
  ) into v_exists;

  if v_exists then
    delete from public.post_votes where post_id = p_post_id and voter_id = p_voter_id;
  else
    insert into public.post_votes (post_id, voter_id) values (p_post_id, p_voter_id);
  end if;

  select count(*)::int from public.post_votes where post_id = p_post_id into v_count;
  update public.posts set votes = v_count where id = p_post_id;
  return v_count;
end;
$$;
grant execute on function public.toggle_vote(uuid, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- my_votes(voter) -> set of post ids this browser has upvoted
-- ---------------------------------------------------------------------------
create or replace function public.my_votes(p_voter_id text)
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select post_id from public.post_votes where voter_id = p_voter_id;
$$;
grant execute on function public.my_votes(text) to anon, authenticated;
-- Note: posts.votes stays a denormalised mirror of count(post_votes), written
-- only by toggle_vote(). The immutability trigger (0001) intentionally leaves
-- `votes` out of its check so that path can update it.
