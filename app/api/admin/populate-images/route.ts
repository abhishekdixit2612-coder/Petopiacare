import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

const db = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// Throttle: 1 request every 1.5s to stay well within Unsplash's 50 req/hr
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchUnsplashImage(query: string): Promise<string | null> {
  if (!UNSPLASH_KEY) return null;
  await delay(1500);
  try {
    const url = new URL('https://api.unsplash.com/photos/random');
    url.searchParams.set('query', query);
    url.searchParams.set('orientation', 'landscape');
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
    });
    if (res.status === 429) return null; // rate limited
    if (!res.ok) return null;
    const data = await res.json();
    return data?.urls?.regular ?? null;
  } catch {
    return null;
  }
}

const BREED_QUERIES: Record<string, string> = {
  'labrador-retriever': 'labrador retriever dog friendly outdoor',
  'german-shepherd': 'german shepherd dog alert park',
  'golden-retriever': 'golden retriever dog happy sunny',
  'indian-pariah-dog': 'indian street dog brown tan',
  'beagle': 'beagle dog curious sniffing',
  'pomeranian': 'pomeranian fluffy small dog',
  'rottweiler': 'rottweiler dog powerful breed',
  'shih-tzu': 'shih tzu dog cute groomed',
  'doberman-pinscher': 'doberman dog sleek alert',
  'boxer': 'boxer dog playful breed',
};

const STAGE_QUERIES: Record<string, string> = {
  'neonatal': 'newborn puppy tiny sleeping mother',
  'puppy-early': 'baby puppy small adorable eyes open',
  'puppy-socialisation': 'puppy playing happy grass',
  'puppy-juvenile': 'puppy juvenile growing dog',
  'adolescent': 'young adolescent dog energetic',
  'young-adult': 'young adult dog active running',
  'adult': 'adult dog healthy happy outdoor',
  'senior-small': 'senior old small dog resting calm',
  'senior-large': 'senior old large dog grey muzzle',
  'geriatric': 'old elderly dog peaceful sleeping',
};

const HEALTH_QUERIES: Record<string, string> = {
  'parvovirus': 'puppy vet clinic treatment care',
  'tick-fever-ehrlichiosis': 'dog tick prevention outdoor treatment',
  'mange-sarcoptic': 'dog skin condition vet examination',
  'hip-dysplasia': 'dog walking mobility joint care',
  'skin-allergies-atopy': 'dog scratching itchy skin',
  'dental-disease': 'dog teeth dental cleaning care',
  'heat-stroke': 'dog hot summer cooling water',
  'leptospirosis': 'dog vet examination clinic',
  'bloat-gdv': 'dog vet emergency care',
  'ear-infection-otitis': 'dog ear cleaning grooming',
};

const BEHAVIOR_QUERIES: Record<string, string> = {
  'excessive-barking': 'dog barking vocal alert',
  'leash-pulling': 'dog pulling leash walk training',
  'separation-anxiety': 'dog alone anxious window waiting',
  'aggression-toward-strangers': 'dog training calm positive',
  'potty-training': 'puppy training indoor positive',
  'destructive-chewing': 'dog chewing toy play',
  'jumping-on-people': 'dog jumping excited greeting person',
  'resource-guarding': 'dog protective bowl food',
  'fear-and-phobias': 'dog scared hiding fearful',
  'basic-obedience-commands': 'dog training sit command reward treat',
};

const NUTRITION_QUERIES: Record<string, string> = {
  'dry-kibble-guide': 'dry dog food kibble bowl',
  'homemade-indian-dog-food': 'homemade dog food cooking kitchen',
  'raw-barf-diet': 'raw dog food meat natural',
  'puppy-feeding-schedule': 'puppy eating food bowl meal',
  'adult-feeding-schedule': 'dog eating food bowl meal',
  'foods-to-avoid-india': 'toxic food dog warning',
  'weight-management-diet': 'dog healthy weight diet',
  'senior-dog-nutrition': 'senior dog eating meal',
  'supplements-guide': 'dog vitamins supplements health',
  'vegetarian-dog-diet': 'dog vegetables healthy food',
};

interface UpdateResult {
  table: string;
  updated: number;
  skipped: number;
  errors: number;
}

async function populateTable(
  table: string,
  queries: Record<string, string>,
  slugCol = 'slug',
  imageCol = 'image_url'
): Promise<UpdateResult> {
  const result: UpdateResult = { table, updated: 0, skipped: 0, errors: 0 };

  const { data: rows } = await db()
    .from(table)
    .select(`id,${slugCol},${imageCol}`)
    .is(imageCol, null);

  if (!rows?.length) return result;

  for (const row of rows as any[]) {
    const slug = row[slugCol] as string;
    const query = queries[slug] ?? `dog ${slug.replace(/-/g, ' ')}`;
    const imageUrl = await fetchUnsplashImage(query);

    if (!imageUrl) { result.skipped++; continue; }

    const { error } = await db().from(table).update({ [imageCol]: imageUrl }).eq('id', row.id);
    if (error) result.errors++;
    else result.updated++;
  }

  return result;
}

async function populateBlogs(): Promise<UpdateResult> {
  const result: UpdateResult = { table: 'blog_posts', updated: 0, skipped: 0, errors: 0 };

  const { data: posts } = await db()
    .from('blog_posts')
    .select('id,title,category')
    .is('featured_image', null);

  if (!posts?.length) return result;

  for (const post of posts as any[]) {
    const words = (post.title as string).toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ').slice(0, 5);
    const query = words.join(' ') + ' dog';
    const imageUrl = await fetchUnsplashImage(query);

    if (!imageUrl) { result.skipped++; continue; }

    const { error } = await db().from('blog_posts').update({ featured_image: imageUrl }).eq('id', post.id);
    if (error) result.errors++;
    else result.updated++;
  }

  return result;
}

export async function POST() {
  if (!UNSPLASH_KEY) {
    return NextResponse.json({ error: 'UNSPLASH_ACCESS_KEY not configured in .env.local' }, { status: 503 });
  }

  try {
    const results = await Promise.allSettled([
      populateTable('dog_breeds', BREED_QUERIES),
      populateTable('life_stages', STAGE_QUERIES),
      populateTable('health_conditions', HEALTH_QUERIES),
      populateTable('behavioral_topics', BEHAVIOR_QUERIES),
      populateTable('nutritional_guides', NUTRITION_QUERIES),
      populateBlogs(),
    ]);

    const summary = results.map((r) =>
      r.status === 'fulfilled' ? r.value : { table: 'unknown', updated: 0, skipped: 0, errors: 1 }
    );

    const totalUpdated = summary.reduce((a, b) => a + b.updated, 0);
    return NextResponse.json({ success: true, totalUpdated, summary });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
