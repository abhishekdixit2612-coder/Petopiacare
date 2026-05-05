// ============================================================
// Unsplash API client — PetopiaCare
// Add UNSPLASH_ACCESS_KEY to .env.local to enable live images
// ============================================================

import type {
  UnsplashImage,
  UnsplashSearchResponse,
  UnsplashParams,
  UnsplashSearchResult,
} from '@/types/unsplash';

const BASE_URL = 'https://api.unsplash.com';

// Simple in-memory cache (per-process, cleared on restart)
const cache = new Map<string, { data: UnsplashSearchResult; expires: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getAccessKey(): string {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) throw new Error('UNSPLASH_ACCESS_KEY not set in environment variables.');
  return key;
}

function cacheKey(query: string, params: UnsplashParams): string {
  return `${query}::${JSON.stringify(params)}`;
}

function fromCache(key: string): UnsplashSearchResult | null {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function toCache(key: string, data: UnsplashSearchResult): void {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

// ── Core search ───────────────────────────────────────────────

export async function searchUnsplashImages(
  query: string,
  params: UnsplashParams = {}
): Promise<UnsplashSearchResult> {
  const { page = 1, perPage = 9, orderBy = 'relevant', orientation = 'landscape' } = params;

  const ck = cacheKey(query, { page, perPage, orderBy, orientation });
  const cached = fromCache(ck);
  if (cached) return cached;

  try {
    const url = new URL(`${BASE_URL}/search/photos`);
    url.searchParams.set('query', query);
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(perPage));
    url.searchParams.set('order_by', orderBy);
    url.searchParams.set('orientation', orientation);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${getAccessKey()}` },
      next: { revalidate: 1800 }, // ISR cache 30 min
    });

    if (res.status === 403) throw new Error('Invalid Unsplash access key.');
    if (res.status === 429) throw new Error('Unsplash rate limit reached. Please wait a moment.');
    if (!res.ok) throw new Error(`Unsplash API error: ${res.status}`);

    const json: UnsplashSearchResponse = await res.json();
    const result: UnsplashSearchResult = {
      images: json.results,
      total: json.total,
      totalPages: json.total_pages,
    };

    toCache(ck, result);
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch images';
    return { images: [], total: 0, totalPages: 0, error: message };
  }
}

// ── Get a single random image ─────────────────────────────────

export async function getRandomUnsplashImage(query: string): Promise<UnsplashImage | null> {
  try {
    const url = new URL(`${BASE_URL}/photos/random`);
    url.searchParams.set('query', query);
    url.searchParams.set('orientation', 'landscape');

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${getAccessKey()}` },
    });

    if (!res.ok) return null;
    return (await res.json()) as UnsplashImage;
  } catch {
    return null;
  }
}

// ── Get multiple images ────────────────────────────────────────

export async function getMultipleUnsplashImages(
  query: string,
  count: number = 6
): Promise<UnsplashImage[]> {
  const result = await searchUnsplashImages(query, { perPage: count });
  return result.images;
}

// ── Build optimized image URL ──────────────────────────────────

export function getUnsplashImageUrl(
  image: UnsplashImage,
  quality: 'low' | 'medium' | 'high' = 'medium'
): string {
  const sizes = { low: image.urls.small, medium: image.urls.regular, high: image.urls.full };
  return sizes[quality];
}

// ── Track download (required by Unsplash ToS) ─────────────────

export async function triggerUnsplashDownload(downloadLocation: string): Promise<void> {
  try {
    await fetch(`${downloadLocation}?client_id=${getAccessKey()}`);
  } catch {
    // Non-critical — best effort
  }
}

// ── Attribution helper ────────────────────────────────────────

export function getAttribution(image: UnsplashImage): {
  name: string;
  username: string;
  profileUrl: string;
  unsplashUrl: string;
} {
  return {
    name: image.user.name,
    username: image.user.username,
    profileUrl: `https://unsplash.com/@${image.user.username}?utm_source=petopiacare&utm_medium=referral`,
    unsplashUrl: 'https://unsplash.com/?utm_source=petopiacare&utm_medium=referral',
  };
}

// ── Check if the key is configured ───────────────────────────

export function isUnsplashConfigured(): boolean {
  return Boolean(process.env.UNSPLASH_ACCESS_KEY);
}
