import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const BASE = 'https://petopiacare.in';

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );
}

function entry(path: string, priority: number, freq: MetadataRoute.Sitemap[0]['changeFrequency'] = 'weekly') {
  return { url: `${BASE}${path}`, lastModified: new Date(), changeFrequency: freq, priority };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages ──────────────────────────────────────────
  const statics: MetadataRoute.Sitemap = [
    entry('/',                    1.0, 'daily'),
    entry('/products',            0.9, 'daily'),
    entry('/blog',                0.9, 'daily'),
    entry('/learn',               0.9, 'weekly'),
    entry('/digital-products',    0.8, 'weekly'),
    entry('/about',               0.6, 'monthly'),
    entry('/contact',             0.5, 'monthly'),
    entry('/faq',                 0.6, 'monthly'),
    entry('/privacy',             0.3, 'yearly'),
    entry('/terms',               0.3, 'yearly'),
    entry('/refund',              0.3, 'yearly'),
    // Companion tools
    entry('/companion',                       0.7, 'monthly'),
    entry('/companion/vaccination-tracker',   0.7, 'monthly'),
    entry('/companion/growth-tracker',        0.7, 'monthly'),
    entry('/companion/health-checklist',      0.7, 'monthly'),
    entry('/companion/feeding-guide',         0.7, 'monthly'),
    // Search
    entry('/search',              0.5, 'daily'),
    // Learn Hub hubs
    entry('/learn/breed-guide',       0.9, 'weekly'),
    entry('/learn/life-stages',       0.8, 'weekly'),
    entry('/learn/nutrition',         0.8, 'weekly'),
    entry('/learn/health-wellness',   0.8, 'weekly'),
    entry('/learn/health/vaccination',0.8, 'monthly'),
    entry('/learn/behavior-training', 0.8, 'weekly'),
  ];

  // ── Dynamic — products ───────────────────────────────────
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const { data } = await db().from('products').select('id,created_at');
    productEntries = (data ?? []).map((p) => ({
      url: `${BASE}/products/${p.id}`,
      lastModified: new Date(p.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {}

  // ── Dynamic — blog posts ─────────────────────────────────
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const { data } = await db()
      .from('blog_posts')
      .select('slug,updated_at')
      .eq('status', 'published');
    blogEntries = (data ?? []).map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {}

  // Fallback blog slugs from mock if DB empty
  if (blogEntries.length === 0) {
    const slugs = [
      'best-dog-food-brands-india','homemade-dog-food-recipe-indian-dogs',
      'stop-dog-pulling-on-leash','summer-dog-care-india',
      'choosing-safe-dog-harness','grooming-tips-indian-dogs',
      'puppy-training-basics','common-dog-health-issues',
    ];
    blogEntries = slugs.map((slug) => entry(`/blog/${slug}`, 0.7, 'monthly'));
  }

  // ── Dynamic — learn hub content ──────────────────────────
  const learnTables = [
    { table: 'dog_breeds',       path: 'breed-guide' },
    { table: 'life_stages',      path: 'life-stages' },
    { table: 'nutritional_guides', path: 'nutrition' },
    { table: 'health_conditions',  path: 'health' },
    { table: 'behavioral_topics',  path: 'behavior' },
  ];

  const learnEntries: MetadataRoute.Sitemap = [];
  for (const { table, path } of learnTables) {
    try {
      const { data } = await db()
        .from(table)
        .select('slug,updated_at')
        .eq('is_published', true);
      (data ?? []).forEach((r) => {
        learnEntries.push({
          url: `${BASE}/learn/${path}/${r.slug}`,
          lastModified: new Date(r.updated_at ?? Date.now()),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      });
    } catch {}
  }

  // ── Dynamic — digital products ───────────────────────────
  let digitalEntries: MetadataRoute.Sitemap = [];
  try {
    const { data } = await db().from('digital_products').select('id,created_at');
    digitalEntries = (data ?? []).map((p) => ({
      url: `${BASE}/digital-products/${p.id}`,
      lastModified: new Date(p.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    }));
  } catch {}

  return [...statics, ...productEntries, ...blogEntries, ...learnEntries, ...digitalEntries];
}
