-- Loop — let leads delete notes (single or bulk).
-- Posts stay immutable for everyone else; the lead is the only role that can remove them.
-- post_votes rows cascade away via the FK (on delete cascade) defined in 0001.

drop policy if exists posts_delete_lead on public.posts;
create policy posts_delete_lead on public.posts
  for delete to authenticated
  using (public.is_lead());

grant delete on public.posts to authenticated;
