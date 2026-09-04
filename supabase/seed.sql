-- Loop — sample data. Safe to run more than once (clears posts first).
-- Mirrors the mockup's example feed.

truncate table public.post_votes, public.posts restart identity cascade;

insert into public.posts (author_name, category, visibility, body, votes, status, lead_note, followed_up_at, opened_at, created_at) values
  ('Omar',  'kudos',   'public',    'Jafar rewrote the intake script at 11pm on Thursday so the Friday clinic run would not slip. Nobody asked him to. The volunteers noticed.', 7, 'read', null, null, now() - interval '2 hours',  now() - interval '2 hours'),
  ('Omar',  'idea',    'anonymous', 'Could we keep a shared changelog? Half of SLA finds out about Core changes when something breaks in front of a partner.', 11, 'new', null, null, null, now() - interval '1 day'),
  ('Samir', 'kudos',   'public',    'Huda walked me through the deploy checklist twice without once making me feel slow about it.', 9, 'read', null, null, now() - interval '2 days', now() - interval '2 days'),
  ('Laila', 'culture', 'public',    'The Wednesday standup running 15 minutes instead of 30 has done more for my week than any tool we added this year.', 4, 'read', null, null, now() - interval '5 hours', now() - interval '5 hours'),
  ('Huda',  'process', 'public',    'Handover notes between the interns and the volunteers are getting lost in direct messages. One doc, one place, and I will keep it tidy.', 6, 'new', null, null, null, now() - interval '1 day'),
  ('Ribal', 'idea',    'public',    'A five-minute demo slot at the end of Thursday call. Show the thing, no slides.', 3, 'read', null, null, now() - interval '3 days', now() - interval '3 days'),
  ('Ribal', 'blocker', 'private',   'The SLA ticket queue has nobody owning it on Fridays. Two weeks running, tickets sat until Sunday and the volunteers took the complaints. I do not think anyone decided this — it just fell through when the rota changed.', 0, 'new', null, null, null, now() - interval '1 hour'),
  ('Jafar', 'process', 'private',   'Onboarding a new volunteer takes me a full day of direct messages and nobody else can cover it.', 0, 'new', null, null, null, now() - interval '2 days'),
  ('Huda',  'blocker', 'private',   'I have been covering two roles since the last volunteer rotation and I am starting to drop things.', 0, 'followed_up', 'Talked 1:1 on the 2nd. Reassigning the SLA triage rota from Monday; check back end of month.', now() - interval '2 days', now() - interval '3 days 20 hours', now() - interval '4 days'),
  ('Jafar', 'process', 'anonymous', 'Onboarding a new volunteer takes a full day of direct messages. Same as last cohort.', 2, 'read', null, null, now() - interval '3 days', now() - interval '3 days'),
  ('Omar',  'idea',    'public',    'Could we keep a shared changelog? Half of SLA finds out when something breaks.', 5, 'read', null, null, now() - interval '3 days', now() - interval '3 days');
