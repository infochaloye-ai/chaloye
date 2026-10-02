// Loads the starter content into Supabase and creates the first admin.
// Usage: npx tsx --env-file=.env scripts/seed-supabase.ts [admin-email]
// Safe to re-run: rows are upserted by id, and an existing admin user is kept as-is.

import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { COLLECTION_KEYS, SINGLETON_KEYS, TABLES, toRow } from '../lib/cms/rows';
import { seed } from './seed-data';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');

const db = createClient(url, serviceKey, { auth: { persistSession: false } });
const adminEmail = process.argv[2] ?? 'admin@chaloye.in';

function check<T>({ data, error }: { data: T; error: { message: string } | null }, what: string): T {
  if (error) throw new Error(`${what}: ${error.message}`);
  return data;
}

async function seedContent() {
  for (const key of COLLECTION_KEYS) {
    // Lists are shown newest first, so stagger timestamps to keep the seed file's order.
    const rows = seed[key].map((item, i) => {
      const row = toRow(item as unknown as Record<string, unknown>);
      const created = new Date(Date.parse(item.createdAt) - i * 1000).toISOString();
      return { ...row, created_at: created, updated_at: created };
    });
    check(await db.from(TABLES[key]).upsert(rows), key);
    console.log(`  ${TABLES[key]}: ${rows.length}`);
  }
  const singletons = SINGLETON_KEYS.map((key) => ({ key, value: seed[key] }));
  check(await db.from('site_content').upsert(singletons), 'site_content');
  console.log(`  site_content: ${singletons.length}`);
}

async function seedAdmin() {
  const listed = await db.auth.admin.listUsers({ perPage: 1000 });
  if (listed.error) throw new Error(`list users: ${listed.error.message}`);
  let user = listed.data.users.find((u) => u.email?.toLowerCase() === adminEmail.toLowerCase());
  let password: string | null = null;

  if (!user) {
    password = randomBytes(12).toString('base64url');
    const created = await db.auth.admin.createUser({ email: adminEmail, password, email_confirm: true, user_metadata: { first_name: 'Chal Oye', last_name: 'Admin' } });
    if (created.error) throw new Error(`create admin: ${created.error.message}`);
    user = created.data.user;
  }
  check(await db.from('admins').upsert({ user_id: user.id }), 'grant admin');
  console.log(password ? `  admin created: ${adminEmail} / ${password}` : `  admin access granted to existing user ${adminEmail}`);
}

async function main() {
  console.log('Seeding content…');
  await seedContent();
  console.log('Setting up admin…');
  await seedAdmin();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
