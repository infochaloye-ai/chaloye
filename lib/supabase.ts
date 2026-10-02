import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Add them to .env (and to Netlify for deploys).');
}

// One browser/server client using the public key. Row level security in
// supabase/migrations decides what each visitor, customer or admin can touch.
export const supabase = createClient(url, key, {
  auth: { persistSession: typeof window !== 'undefined' },
});
