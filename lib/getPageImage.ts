// ============================================================
// Server-side page image utility — fetches from Unsplash with
// 24-hour in-memory cache. Use in async Server Components only.
// ============================================================

import { getSearchQuery } from '@/config/imageSearchMapping';

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Fallback images by category (no API needed)
const FALLBACKS: Record<string, string> = {
  breed:     'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&q=80',
  stage:     'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80',
  health:    'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200&q=80',
  behavior:  'https://images.unsplash.com/photo-1534361960057-19f4434a4f0a?w=1200&q=80',
  nutrition: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=1200&q=80',
  blog:      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80',
  default:   'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80',
};

// 24-hour in-memory cache
const cache = new Map<string, { url: string; expires: number }>();

async function fetchFromUnsplash(query: string): Promise<string | null> {
  if (!UNSPLASH_KEY) return null;
  try {
    const url = new URL('https://api.unsplash.com/photos/random');
    url.searchParams.set('query', query);
    url.searchParams.set('orientation', 'landscape');
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.urls?.regular ?? null;
  } catch {
    return null;
  }
}

/**
 * Get an image URL for a page/section.
 * Fetches from Unsplash, caches for 24h, falls back to hardcoded URL.
 *
 * @param query  Unsplash search query, e.g. "golden retriever dog happy"
 * @param type   Content type for fallback selection
 */
export async function getPageImage(
  query: string,
  type: keyof typeof FALLBACKS = 'default'
): Promise<string> {
  const key = query.trim().toLowerCase();

  const cached = cache.get(key);
  if (cached && Date.now() < cached.expires) return cached.url;

  const url = await fetchFromUnsplash(key);
  const result = url ?? FALLBACKS[type] ?? FALLBACKS.default;
  cache.set(key, { url: result, expires: Date.now() + 86_400_000 });
  return result;
}

/**
 * Convenience: get image using the standard content mapping.
 * e.g. getContentImage('breed', 'labrador-retriever')
 */
export async function getContentImage(
  type: Parameters<typeof getSearchQuery>[0],
  slug: string
): Promise<string> {
  const query = getSearchQuery(type, slug);
  return getPageImage(query, type as keyof typeof FALLBACKS);
}
