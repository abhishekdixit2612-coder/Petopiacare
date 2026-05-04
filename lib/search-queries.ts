// ============================================================
// Global search — queries across all content tables
// ============================================================

import { createClient } from '@supabase/supabase-js';

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );
}

export type ContentType = 'breed' | 'health' | 'nutrition' | 'behavior' | 'blog' | 'product';

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: ContentType;
  slug: string;
  url: string;
  image_url?: string;
  meta?: string; // e.g. category, severity, size
}

function safe(q: string) {
  return q.replace(/[%_]/g, '\\$&').slice(0, 100);
}

async function searchBreeds(q: string, limit: number): Promise<SearchResult[]> {
  const { data } = await db()
    .from('dog_breeds')
    .select('id,name,slug,full_description,image_url,size,exercise_level')
    .or(`name.ilike.%${safe(q)}%,full_description.ilike.%${safe(q)}%,behavioral_traits.ilike.%${safe(q)}%`)
    .eq('is_published', true)
    .limit(limit);

  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.name,
    excerpt: (r.full_description ?? '').slice(0, 140),
    type: 'breed',
    slug: r.slug,
    url: `/learn/breed-guide/${r.slug}`,
    image_url: r.image_url ?? undefined,
    meta: `${r.size} · ${r.exercise_level} exercise`,
  }));
}

async function searchHealth(q: string, limit: number): Promise<SearchResult[]> {
  const { data } = await db()
    .from('health_conditions')
    .select('id,name,slug,description,severity')
    .or(`name.ilike.%${safe(q)}%,description.ilike.%${safe(q)}%`)
    .eq('is_published', true)
    .limit(limit);

  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.name,
    excerpt: (r.description ?? '').slice(0, 140),
    type: 'health',
    slug: r.slug,
    url: `/learn/health/${r.slug}`,
    meta: r.severity,
  }));
}

async function searchNutrition(q: string, limit: number): Promise<SearchResult[]> {
  const { data } = await db()
    .from('nutritional_guides')
    .select('id,title,slug,description,category')
    .or(`title.ilike.%${safe(q)}%,description.ilike.%${safe(q)}%`)
    .eq('is_published', true)
    .limit(limit);

  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    excerpt: (r.description ?? '').slice(0, 140),
    type: 'nutrition',
    slug: r.slug,
    url: `/learn/nutrition/${r.slug}`,
    meta: r.category.replace(/_/g, ' '),
  }));
}

async function searchBehavior(q: string, limit: number): Promise<SearchResult[]> {
  const { data } = await db()
    .from('behavioral_topics')
    .select('id,name,slug,issue_description,applicable_stages')
    .or(`name.ilike.%${safe(q)}%,issue_description.ilike.%${safe(q)}%,solutions.ilike.%${safe(q)}%`)
    .eq('is_published', true)
    .limit(limit);

  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.name,
    excerpt: (r.issue_description ?? '').slice(0, 140),
    type: 'behavior',
    slug: r.slug,
    url: `/learn/behavior/${r.slug}`,
    meta: (r.applicable_stages ?? []).join(' · '),
  }));
}

async function searchBlog(q: string, limit: number): Promise<SearchResult[]> {
  const { data } = await db()
    .from('blog_posts')
    .select('id,title,slug,excerpt,featured_image,category')
    .or(`title.ilike.%${safe(q)}%,excerpt.ilike.%${safe(q)}%`)
    .eq('status', 'published')
    .limit(limit);

  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    excerpt: (r.excerpt ?? '').slice(0, 140),
    type: 'blog',
    slug: r.slug,
    url: `/blog/${r.slug}`,
    image_url: r.featured_image ?? undefined,
    meta: r.category ?? 'Blog',
  }));
}

async function searchProducts(q: string, limit: number): Promise<SearchResult[]> {
  const { data } = await db()
    .from('products')
    .select('id,name,description,image_url,category')
    .or(`name.ilike.%${safe(q)}%,description.ilike.%${safe(q)}%,category.ilike.%${safe(q)}%`)
    .limit(limit);

  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.name,
    excerpt: (r.description ?? '').slice(0, 140),
    type: 'product',
    slug: r.id,
    url: `/products/${r.id}`,
    image_url: r.image_url ?? undefined,
    meta: r.category ?? 'Product',
  }));
}

export interface SearchOptions {
  type?: ContentType | 'all';
  limit?: number;
  offset?: number;
}

export interface GroupedResults {
  breed: SearchResult[];
  health: SearchResult[];
  nutrition: SearchResult[];
  behavior: SearchResult[];
  blog: SearchResult[];
  product: SearchResult[];
  total: number;
}

export async function searchAll(query: string, opts: SearchOptions = {}): Promise<GroupedResults> {
  const q = query.trim();
  if (!q) return { breed: [], health: [], nutrition: [], behavior: [], blog: [], product: [], total: 0 };

  const { type = 'all', limit = 5 } = opts;
  const perType = type === 'all' ? Math.ceil(limit / 6) + 1 : limit;

  const [breeds, health, nutrition, behavior, blog, products] = await Promise.all([
    (type === 'all' || type === 'breed')     ? searchBreeds(q, perType)    : [],
    (type === 'all' || type === 'health')    ? searchHealth(q, perType)    : [],
    (type === 'all' || type === 'nutrition') ? searchNutrition(q, perType) : [],
    (type === 'all' || type === 'behavior')  ? searchBehavior(q, perType)  : [],
    (type === 'all' || type === 'blog')      ? searchBlog(q, perType)      : [],
    (type === 'all' || type === 'product')   ? searchProducts(q, perType)  : [],
  ]);

  return {
    breed: breeds,
    health,
    nutrition,
    behavior,
    blog,
    product: products,
    total: breeds.length + health.length + nutrition.length + behavior.length + blog.length + products.length,
  };
}

// Track search query in analytics table
export async function trackSearch(query: string, resultCount: number) {
  if (!query.trim()) return;
  await db().from('search_analytics').insert({ query: query.trim().toLowerCase(), results: resultCount });
}

// Get trending search terms from analytics
export async function getTrendingSearches(limit = 8): Promise<string[]> {
  const { data } = await db()
    .from('search_analytics')
    .select('query')
    .order('created_at', { ascending: false })
    .limit(100);

  if (!data?.length) return DEFAULT_TRENDING;

  const counts: Record<string, number> = {};
  data.forEach((r) => { counts[r.query] = (counts[r.query] ?? 0) + 1; });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([q]) => q);
}

const DEFAULT_TRENDING = [
  'Labrador Retriever', 'Tick fever', 'Puppy feeding',
  'Leash pulling', 'Separation anxiety', 'Hip dysplasia',
  'Homemade dog food', 'Vaccination schedule',
];

// Suggest corrections for zero-result queries
const CORRECTIONS: Record<string, string> = {
  'labrador': 'Labrador Retriever', 'lab': 'Labrador Retriever',
  'gsd': 'German Shepherd', 'german shepperd': 'German Shepherd',
  'golden': 'Golden Retriever', 'goldie': 'Golden Retriever',
  'tick': 'Tick fever', 'parvo': 'Parvovirus',
  'poo': 'Potty training', 'potty': 'Potty training',
  'bark': 'Excessive barking', 'food': 'Homemade dog food',
};

export function suggestCorrection(q: string): string | null {
  const lower = q.toLowerCase().trim();
  return CORRECTIONS[lower] ?? null;
}
