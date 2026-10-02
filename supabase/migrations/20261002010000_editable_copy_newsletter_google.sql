-- Moves the remaining hardcoded page copy into site_content, stores newsletter
-- sign-ups, and fills customer profiles from Google sign-ins.

-- ---------- Newsletter ----------

create table public.newsletter_subscribers (
  id text primary key default gen_random_uuid()::text,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index newsletter_subscribers_email_key on public.newsletter_subscribers (lower(email));
create trigger touch_updated_at before update on public.newsletter_subscribers
  for each row execute function public.touch_updated_at();

alter table public.newsletter_subscribers enable row level security;
create policy "anyone subscribes" on public.newsletter_subscribers for insert with check (true);
create policy "admins read subscribers" on public.newsletter_subscribers for select using (public.is_admin());
create policy "admins delete subscribers" on public.newsletter_subscribers for delete using (public.is_admin());
grant insert on public.newsletter_subscribers to anon, authenticated;
grant select, delete on public.newsletter_subscribers to authenticated;

create or replace function public.cms_snapshot()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'treks',        coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc) from public.treks r), '[]'),
    'bookings',     coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc) from public.bookings r), '[]'),
    'inquiries',    coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc) from public.inquiries r), '[]'),
    'testimonials', coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc) from public.testimonials r), '[]'),
    'team',         coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc) from public.team_members r), '[]'),
    'faqs',         coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc) from public.faqs r), '[]'),
    'subscribers',  coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc) from public.newsletter_subscribers r), '[]'),
    'singletons',   coalesce((select jsonb_object_agg(r.key, r.value) from public.site_content r), '{}')
  );
$$;

-- ---------- Editable copy ----------

alter table public.site_content drop constraint site_content_key_check;
alter table public.site_content add constraint site_content_key_check check (key in ('home', 'about', 'pages', 'settings'));

insert into public.site_content (key, value) values ('pages', '{
  "trips": {
    "eyebrow": "handpicked trails",
    "title": "Find the trek that''s calling you.",
    "highlight": "calling you.",
    "image": "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1600"
  },
  "contact": {
    "eyebrow": "Get in touch",
    "title": "Let''s plan your next climb.",
    "highlight": "next climb.",
    "subtitle": "Questions about fitness, gear or which trek suits you? Our trek experts usually reply within the hour.",
    "image": "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "formTitle": "Send us a message",
    "formSubtitle": "Fill in the form and we''ll be in touch."
  },
  "auth": {
    "image": "https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=1600"
  }
}')
on conflict (key) do nothing;

-- `defaults || value`: new keys are added, anything already edited is kept.
update public.site_content set value = '{
  "sections": {
    "featured": { "eyebrow": "Featured trails", "title": "Treks our trekkers can''t stop talking about", "highlight": "can''t stop", "subtitle": "" },
    "levels": { "eyebrow": "Find your level", "title": "Every summit starts with the right trail", "highlight": "", "subtitle": "Pick the challenge that suits you. Every trek includes a training plan and a pre-departure call with your trek leader." },
    "testimonials": { "eyebrow": "Trail stories", "title": "Heard around the campfire", "highlight": "", "subtitle": "" },
    "faq": { "eyebrow": "Good questions", "title": "Before you lace up", "highlight": "", "subtitle": "Still unsure? Our trek experts are a message away." }
  },
  "levelBlurbs": {
    "Easy": "Gentle trails and comfortable camps. Perfect for your first Himalayan trek.",
    "Moderate": "Longer days and a summit push. Needs a few weeks of training.",
    "Challenging": "High passes and big altitude gains for trekkers with some experience.",
    "Expert": "Remote, demanding expeditions for seasoned high-altitude trekkers."
  }
}'::jsonb || value where key = 'home';

update public.site_content set value = '{
  "heroEyebrow": "Our story",
  "storyEyebrow": "How it began",
  "sections": {
    "values": { "eyebrow": "What we stand for", "title": "Values we carry up every mountain", "highlight": "", "subtitle": "" },
    "team": { "eyebrow": "The crew", "title": "People who''ll walk beside you", "highlight": "", "subtitle": "" },
    "cta": { "eyebrow": "", "title": "Ready to walk with us?", "highlight": "", "subtitle": "" }
  }
}'::jsonb || value where key = 'about';

update public.site_content set value = '{
  "newsletter": {
    "title": "Trail notes, once a month.",
    "subtitle": "New departures, early-bird prices and the occasional mountain story. No spam, ever."
  }
}'::jsonb || value where key = 'settings';

-- ---------- Google sign-in profiles ----------
-- Email sign-up sends first_name/last_name; Google sends given_name/family_name/full_name.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}');
  full_name text := coalesce(meta ->> 'full_name', meta ->> 'name', '');
begin
  insert into public.profiles (id, email, first_name, last_name, phone)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(nullif(meta ->> 'first_name', ''), nullif(meta ->> 'given_name', ''), split_part(full_name, ' ', 1)),
    coalesce(nullif(meta ->> 'last_name', ''), nullif(meta ->> 'family_name', ''), nullif(substr(full_name, length(split_part(full_name, ' ', 1)) + 2), ''), ''),
    nullif(meta ->> 'phone', '')
  );
  return new;
end;
$$;
