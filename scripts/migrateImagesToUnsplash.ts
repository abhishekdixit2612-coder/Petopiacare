/**
 * Unsplash Image Migration Script
 *
 * Updates image_url columns across all content tables using Unsplash API.
 * Only updates rows where image_url is NULL or empty.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json scripts/migrateImagesToUnsplash.ts
 *   -- or with bun --
 *   bun scripts/migrateImagesToUnsplash.ts
 *
 * Required: UNSPLASH_ACCESS_KEY and Supabase keys in .env.local
 */

import { createClient } from '@supabase/supabase-js';

// Load .env.local manually (no dotenv dependency needed)
import { readFileSync } from 'fs';
try {
  const env = readFileSync('.env.local', 'utf-8');
  env.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key?.trim() && !key.startsWith('#')) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  });
} catch { /* file not found */ }

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!UNSPLASH_KEY) {
  console.error('❌ UNSPLASH_ACCESS_KEY not found in .env.local');
  process.exit(1);
}

// ── Image mappings (same as config/imageSearchMapping.ts) ──────

const BREED_QUERIES: Record<string, string> = {
  'labrador-retriever':  'labrador retriever dog friendly',
  'golden-retriever':    'golden retriever dog happy',
  'german-shepherd':     'german shepherd dog alert',
  'indian-pariah-dog':   'indian street dog desi',
  'beagle':              'beagle dog curious',
  'pomeranian':          'pomeranian fluffy small dog',
  'rottweiler':          'rottweiler dog powerful',
  'shih-tzu':            'shih tzu dog cute',
  'doberman-pinscher':   'doberman dog sleek',
  'boxer':               'boxer dog playful',
};

const STAGE_QUERIES: Record<string, string> = {
  'neonatal':              'newborn puppy tiny sleeping',
  'puppy-early':           'baby puppy small adorable',
  'puppy-socialisation':   'puppy playing happy',
  'puppy-juvenile':        'puppy growing juvenile',
  'adolescent':            'young dog energetic',
  'young-adult':           'young adult dog active',
  'adult':                 'adult dog healthy happy',
  'senior-small':          'senior old small dog resting',
  'senior-large':          'senior old large dog grey',
  'geriatric':             'old elderly dog calm',
};

const HEALTH_QUERIES: Record<string, string> = {
  'parvovirus':            'puppy vet clinic treatment',
  'tick-fever-ehrlichiosis':'tick prevention dog',
  'mange-sarcoptic':       'dog skin condition',
  'hip-dysplasia':         'dog joint pain mobility',
  'skin-allergies-atopy':  'dog scratching itching',
  'dental-disease':        'dog teeth dental care',
  'heat-stroke':           'dog hot summer water',
  'leptospirosis':         'dog vet examination',
  'bloat-gdv':             'dog stomach vet emergency',
  'ear-infection-otitis':  'dog ear cleaning',
};

const BEHAVIOR_QUERIES: Record<string, string> = {
  'excessive-barking':           'dog barking vocal',
  'leash-pulling':               'dog pulling leash walk',
  'separation-anxiety':          'dog alone anxious',
  'aggression-toward-strangers': 'dog training calm',
  'potty-training':              'puppy training indoor',
  'destructive-chewing':         'dog chewing toy',
  'jumping-on-people':           'dog jumping excited',
  'resource-guarding':           'dog bowl food protective',
  'fear-and-phobias':            'dog scared hiding',
  'basic-obedience-commands':    'dog training sit command treat',
};

const NUTRITION_QUERIES: Record<string, string> = {
  'dry-kibble-guide':         'dry dog food kibble bowl',
  'homemade-indian-dog-food': 'homemade dog food cooking',
  'raw-barf-diet':            'raw dog food meat',
  'puppy-feeding-schedule':   'puppy eating food bowl',
  'adult-feeding-schedule':   'dog eating food bowl',
  'foods-to-avoid-india':     'toxic food dog danger',
  'weight-management-diet':   'dog diet healthy weight',
  'senior-dog-nutrition':     'senior dog eating meal',
  'supplements-guide':        'dog vitamins supplements',
  'vegetarian-dog-diet':      'vegetarian dog food vegetables',
};

// ── Fetch from Unsplash ────────────────────────────────────────

async function fetchImage(query: string): Promise<string | null> {
  await new Promise(r => setTimeout(r, 200)); // 200ms throttle (stay under 50 req/hr limit)
  try {
    const url = new URL('https://api.unsplash.com/photos/random');
    url.searchParams.set('query', query);
    url.searchParams.set('orientation', 'landscape');

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
    });

    if (res.status === 429) {
      console.warn('⚠️  Rate limited. Waiting 60s...');
      await new Promise(r => setTimeout(r, 60_000));
      return fetchImage(query);
    }
    if (!res.ok) { console.warn(`⚠️  Unsplash error ${res.status} for "${query}"`); return null; }

    const data = await res.json();
    return data.urls?.regular ?? null;
  } catch (err) {
    console.warn(`❌ Failed: ${query}`, err);
    return null;
  }
}

// ── Migrate a table ────────────────────────────────────────────

async function migrateTable(
  table: string,
  queries: Record<string, string>,
  slugColumn = 'slug'
) {
  console.log(`\n📋 Migrating ${table}...`);

  const { data: rows } = await supabase
    .from(table)
    .select(`id,${slugColumn},image_url`)
    .or('image_url.is.null,image_url.eq.');

  if (!rows?.length) { console.log(`  ✓ No rows to update`); return; }

  let updated = 0;
  for (const row of (rows as unknown as Record<string, unknown>[])) {
    const slug = row[slugColumn] as string;
    const query = queries[slug] ?? `dog ${slug.replace(/-/g, ' ')}`;
    const imageUrl = await fetchImage(query);
    if (!imageUrl) continue;

    const { error } = await supabase.from(table).update({ image_url: imageUrl }).eq('id', row.id);
    if (error) { console.warn(`  ❌ Update failed for ${slug}:`, error.message); }
    else { console.log(`  ✓ ${slug}`); updated++; }
  }

  console.log(`  Done: ${updated}/${rows.length} rows updated`);
}

// ── Migrate blog posts ─────────────────────────────────────────

async function migrateBlogPosts() {
  console.log(`\n📋 Migrating blog_posts...`);

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id,title,category,featured_image')
    .or('featured_image.is.null,featured_image.eq.');

  if (!posts?.length) { console.log(`  ✓ No posts to update`); return; }

  let updated = 0;
  for (const post of posts) {
    // Generate query from title words
    const words = (post.title as string).toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ').slice(0, 5);
    const query = `${words.join(' ')} dog`;
    const imageUrl = await fetchImage(query);
    if (!imageUrl) continue;

    const { error } = await supabase.from('blog_posts').update({ featured_image: imageUrl }).eq('id', post.id);
    if (error) { console.warn(`  ❌ Update failed:`, error.message); }
    else { console.log(`  ✓ "${post.title}"`); updated++; }
  }

  console.log(`  Done: ${updated}/${posts.length} posts updated`);
}

// ── Main ───────────────────────────────────────────────────────

async function main() {
  console.log('🐾 PetopiaCare — Unsplash Image Migration');
  console.log('==========================================');
  console.log('Only updates rows where image_url is NULL or empty.\n');

  await migrateTable('dog_breeds',       BREED_QUERIES);
  await migrateTable('life_stages',      STAGE_QUERIES);
  await migrateTable('health_conditions', HEALTH_QUERIES);
  await migrateTable('behavioral_topics', BEHAVIOR_QUERIES);
  await migrateTable('nutritional_guides', NUTRITION_QUERIES);
  await migrateBlogPosts();

  console.log('\n✅ Migration complete!');
}

main().catch(console.error);
