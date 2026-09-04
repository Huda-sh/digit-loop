-- Loop — schema
-- Run in the Supabase SQL editor, or `supabase db push` with the CLI.

create extension if not exists pgcrypto;

do $$ begin
  create type public.post_category as enum ('kudos','idea','blocker','process','culture');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.post_visibility as enum ('public','anonymous','private');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.post_status as enum ('new','read','followed_up');
exception when duplicate_object then null; end $$;

create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  author_name   text not null check (char_length(btrim(author_name)) between 1 and 80),
  category      public.post_category not null,
  visibility    public.post_visibility not null,
  body          text not null check (char_length(body) between 1 and 1200),
  votes         integer not null default 0 check (votes >= 0),
  status        public.post_status not null default 'new',
  lead_note     text,
  followed_up_at timestamptz,
  opened_at     timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_visibility_idx on public.posts (visibility);

-- One row per (post, browser) so a visitor can toggle their own upvote without an account.
create table if not exists public.post_votes (
  post_id    uuid not null references public.posts(id) on delete cascade,
  voter_id   text not null check (char_length(voter_id) between 8 and 128),
  created_at timestamptz not null default now(),
  primary key (post_id, voter_id)
);

-- Who is allowed to read the lead view. Add rows by auth user id.
create table if not exists public.leads (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- The note body, category, author and timestamp are immutable once posted.
create or replace function public.posts_guard_immutable()
returns trigger
language plpgsql
as $$
begin
  if new.author_name is distinct from old.author_name
     or new.category is distinct from old.category
     or new.visibility is distinct from old.visibility
     or new.body is distinct from old.body
     or new.created_at is distinct from old.created_at then
    raise exception 'posts: author, category, visibility, body and created_at are immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists posts_guard on public.posts;
create trigger posts_guard
  before update on public.posts
  for each row execute function public.posts_guard_immutable();
