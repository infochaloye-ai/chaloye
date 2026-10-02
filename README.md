# Chal Oye (chaloye.in)

Guided Himalayan treks website with a built-in content studio (admin CMS). Next.js 16 (pages router), React 19, Tailwind CSS v4, Supabase.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Create `.env` (never committed) with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
# Only for scripts/seed-supabase.ts and psql. Never add these to Vercel.
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_DB_URL=postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres
```

Only the two `NEXT_PUBLIC_` variables are needed on Vercel.

- Public site: `/`, `/trips`, `/trips/[slug]`, `/about`, `/contact`, `/login`, `/signup`, `/account`
- Admin: `/admin`. Admins are Supabase Auth users listed in the `admins` table.

## How content works

Everything the site shows lives in Supabase. Nothing is hardcoded or stored in the browser.

| File | Role |
| --- | --- |
| `supabase/migrations/` | Tables, row level security, triggers and the `cms_snapshot()` function. Apply in order with `psql "$SUPABASE_DB_URL" -f <file>`. |
| `lib/cms/types.ts` | Content model. Collections map to tables (camelCase fields → snake_case columns); homepage, about, other pages and settings are JSON rows in `site_content`. |
| `lib/cms/adapter.ts` | Reads and writes Supabase through the public key. RLS decides what each visitor, customer or admin may do. |
| `context/CMSContext.tsx` | React provider used by the site and the admin. `pages/_app.tsx` loads content on the server so pages render with real data. |
| `context/AuthContext.tsx` | Customer accounts: email/password and Google via Supabase Auth, with names in `profiles`. |
| `scripts/seed-supabase.ts` | Loads the starter content in `scripts/seed-data.ts` and creates the first admin. |

Security rules worth knowing:

- Visitors can read published content and can only *insert* bookings, inquiries and newsletter sign-ups.
- A booking's price, trek name and status are recomputed in the database, so they can't be tampered with from the browser.
- Customers see their own bookings and can cancel them through `cancel_booking()`; admins can do everything.
- Admin image uploads go to the public `media` Storage bucket; only admins can write to it.

## First-time Supabase setup

1. Apply every file in `supabase/migrations/` in order.
2. Seed content and create an admin: `npx tsx --env-file=.env scripts/seed-supabase.ts [admin-email]`. It prints the new admin's password once.
3. In Supabase → Authentication → URL Configuration, set the Site URL to the live domain and add `http://localhost:3000/**` and the live domain to the redirect URLs.
4. For Google sign-in, enable the Google provider (Authentication → Sign In / Providers) with an OAuth client from Google Cloud Console.

To make another user an admin: `insert into public.admins (user_id) select id from auth.users where email = 'someone@example.com';`
