# Chal Oye (chaloye.in)

Guided Himalayan treks website with a built-in content studio (admin CMS). Next.js 16 (pages router), React 19, Tailwind CSS v4.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

- Public site: `/`, `/trips`, `/trips/[slug]`, `/about`, `/contact`, `/login`, `/account`
- Admin: `/admin`. Demo login: `admin@chaloye.in` / `chaloye123`

## How content works

All content (treks, bookings, inquiries, testimonials, team, FAQs, homepage, about page, settings) goes through one layer:

| File | Role |
| --- | --- |
| `lib/cms/types.ts` | Content model. Each collection maps to a future database table. |
| `lib/cms/seed.ts` | Demo data. "Reset demo data" in Admin → Settings restores it. |
| `lib/cms/adapter.ts` | `CMSAdapter` interface plus the current `localStorage` implementation. |
| `context/CMSContext.tsx` | React provider used by both the site and the admin. |

Right now edits are saved in the **browser's localStorage**, so they only exist in that browser. Use Admin → Settings → Export/Import JSON to move content between browsers.

## Moving to Supabase

1. Create tables matching `lib/cms/types.ts`: `treks`, `bookings`, `inquiries`, `testimonials`, `team`, `faqs` (uuid `id`, `created_at`, `updated_at`), plus a `site_content` table with one JSON row each for `home`, `about` and `settings`.
2. Write `supabaseAdapter` implementing `CMSAdapter` and return it from `getAdapter()` in `lib/cms/adapter.ts`. No UI changes are needed.
3. Replace the demo admin gate in `lib/adminAuth.ts` with Supabase Auth, and protect writes with row-level security (public read for published content; admin-only writes; public insert-only for `bookings` and `inquiries`).
4. Swap the mock customer auth in `context/AuthContext.tsx` for `supabase.auth`.
5. Move image uploads in `components/admin/fields.tsx` (`ImageField`) to Supabase Storage.
6. Optionally fetch published content in `getStaticProps` with ISR for SEO, instead of loading it on the client.

> The current admin login is **not secure**. The credentials ship in the JS bundle. Don't deploy the admin publicly until step 3 is done.
