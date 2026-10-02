-- Chal Oye CMS schema. Mirrors lib/cms/types.ts: camelCase fields become snake_case columns,
-- `order` becomes `sort_order`, and the `team` collection lives in `team_members`.

create extension if not exists pgcrypto;

-- ---------- Helpers ----------

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- Collections ----------

create table public.treks (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  name text not null,
  region text not null default '',
  country text not null default '',
  duration_days integer not null default 1,
  price integer not null default 0,
  original_price integer,
  difficulty text not null default 'Moderate' check (difficulty in ('Easy', 'Moderate', 'Challenging', 'Expert')),
  max_altitude text not null default '',
  best_time text not null default '',
  group_size text not null default '',
  summary text not null default '',
  description text not null default '',
  image text not null default '',
  gallery text[] not null default '{}',
  highlights text[] not null default '{}',
  itinerary jsonb not null default '[]',
  inclusions text[] not null default '{}',
  exclusions text[] not null default '{}',
  departures text[] not null default '{}',
  rating numeric(2, 1) not null default 0,
  review_count integer not null default 0,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('published', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bookings (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users (id) on delete set null,
  trek_id text not null,
  trek_name text not null default '',
  customer_name text not null,
  email text not null,
  phone text not null,
  departure_date date not null,
  participants integer not null check (participants between 1 and 20),
  amount integer not null default 0,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index bookings_user_id_idx on public.bookings (user_id);
create index bookings_email_idx on public.bookings (lower(email));

create table public.inquiries (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  email text not null,
  phone text,
  subject text not null default 'General enquiry',
  message text not null,
  trek_interest text,
  status text not null default 'new' check (status in ('new', 'replied', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  location text not null default '',
  trek_name text not null default '',
  rating integer not null default 5 check (rating between 1 and 5),
  quote text not null default '',
  avatar text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.team_members (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  role text not null default '',
  bio text not null default '',
  photo text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.faqs (
  id text primary key default gen_random_uuid()::text,
  question text not null,
  answer text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Singletons: one row per key (home, about, settings).
create table public.site_content (
  key text primary key check (key in ('home', 'about', 'settings')),
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Customer profile, created automatically on sign-up.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null default '',
  first_name text not null default '',
  last_name text not null default '',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['treks', 'bookings', 'inquiries', 'testimonials', 'team_members', 'faqs', 'site_content', 'profiles']
  loop
    execute format('create trigger touch_updated_at before update on public.%I for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ---------- Triggers ----------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, phone)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Public booking requests can't be trusted for price, trek name or status: recompute them.
create or replace function public.prepare_booking()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  t public.treks;
begin
  -- Admins and the seed script (service role) enter bookings as-is.
  if public.is_admin() or (auth.jwt() ->> 'role') = 'service_role' then
    return new;
  end if;

  select * into t from public.treks where id = new.trek_id and status = 'published';
  if not found then
    raise exception 'This trek is not available for booking.';
  end if;
  if not (new.departure_date::text = any (t.departures)) or new.departure_date < current_date then
    raise exception 'Please pick one of the scheduled departure dates.';
  end if;

  new.trek_name := t.name;
  new.amount := t.price * new.participants;
  new.status := 'pending';
  new.user_id := auth.uid();
  new.created_at := now();
  new.updated_at := now();
  return new;
end;
$$;

create trigger prepare_booking
  before insert on public.bookings
  for each row execute function public.prepare_booking();

-- Customers may cancel their own upcoming booking, and change nothing else.
create or replace function public.cancel_booking(booking_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.bookings
     set status = 'cancelled'
   where id = booking_id
     and status in ('pending', 'confirmed')
     and departure_date > current_date
     and (user_id = auth.uid() or lower(email) = lower(auth.jwt() ->> 'email'));
  if not found then
    raise exception 'This booking can no longer be cancelled.';
  end if;
end;
$$;

-- ---------- Row level security ----------

alter table public.admins enable row level security;
alter table public.treks enable row level security;
alter table public.bookings enable row level security;
alter table public.inquiries enable row level security;
alter table public.testimonials enable row level security;
alter table public.team_members enable row level security;
alter table public.faqs enable row level security;
alter table public.site_content enable row level security;
alter table public.profiles enable row level security;

create policy "admins read admins" on public.admins for select using (public.is_admin());

create policy "public reads published treks" on public.treks for select using (status = 'published' or public.is_admin());
create policy "admins manage treks" on public.treks for all using (public.is_admin()) with check (public.is_admin());

create policy "anyone requests a booking" on public.bookings for insert with check (true);
create policy "customers read own bookings" on public.bookings for select using (
  public.is_admin()
  or user_id = auth.uid()
  or (auth.jwt() ->> 'email' is not null and lower(email) = lower(auth.jwt() ->> 'email'))
);
create policy "admins update bookings" on public.bookings for update using (public.is_admin()) with check (public.is_admin());
create policy "admins delete bookings" on public.bookings for delete using (public.is_admin());

create policy "anyone sends an inquiry" on public.inquiries for insert with check (status = 'new' or public.is_admin());
create policy "admins read inquiries" on public.inquiries for select using (public.is_admin());
create policy "admins update inquiries" on public.inquiries for update using (public.is_admin()) with check (public.is_admin());
create policy "admins delete inquiries" on public.inquiries for delete using (public.is_admin());

create policy "public reads published testimonials" on public.testimonials for select using (published or public.is_admin());
create policy "admins manage testimonials" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads team" on public.team_members for select using (true);
create policy "admins manage team" on public.team_members for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads published faqs" on public.faqs for select using (published or public.is_admin());
create policy "admins manage faqs" on public.faqs for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads site content" on public.site_content for select using (true);
create policy "admins manage site content" on public.site_content for all using (public.is_admin()) with check (public.is_admin());

create policy "users read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

grant usage on schema public to anon, authenticated;
grant select on public.treks, public.testimonials, public.team_members, public.faqs, public.site_content to anon, authenticated;
grant insert on public.bookings, public.inquiries to anon, authenticated;
grant select, insert, update, delete on public.treks, public.bookings, public.inquiries, public.testimonials,
  public.team_members, public.faqs, public.site_content to authenticated;
grant select on public.admins to authenticated;
grant select, update on public.profiles to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.cancel_booking(text) to authenticated;

-- ---------- Everything the caller may see, in one round trip ----------
-- security invoker: RLS decides what's included (public content for visitors,
-- own bookings for customers, everything for admins).

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
    'singletons',   coalesce((select jsonb_object_agg(r.key, r.value) from public.site_content r), '{}')
  );
$$;

grant execute on function public.cms_snapshot() to anon, authenticated;

-- ---------- Image uploads ----------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml'])
on conflict (id) do nothing;

create policy "admins upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "admins update media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "admins delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
