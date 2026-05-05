import { NextResponse } from 'next/server';
import { searchUnsplashImages, isUnsplashConfigured } from '@/lib/unsplash';
import type { UnsplashParams } from '@/types/unsplash';

// Simple per-process rate limit (per IP, 60 req/min)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 60) return true;
  entry.count++;
  return false;
}

export async function POST(req: Request) {
  if (!isUnsplashConfigured()) {
    return NextResponse.json({ success: false, error: 'Unsplash API key not configured. Add UNSPLASH_ACCESS_KEY to .env.local.' }, { status: 503 });
  }

  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ success: false, error: 'Too many requests. Please wait.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { query, count = 9, page = 1, orientation = 'landscape' } = body as {
      query: string;
      count?: number;
      page?: number;
      orientation?: UnsplashParams['orientation'];
    };

    if (!query?.trim()) {
      return NextResponse.json({ success: false, error: 'Search query is required.' }, { status: 400 });
    }

    const result = await searchUnsplashImages(query.trim(), {
      page,
      perPage: Math.min(count, 30), // cap at 30
      orientation,
    });

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, images: result.images, total: result.total, totalPages: result.totalPages },
      { headers: { 'Cache-Control': 'private, max-age=1800' } }
    );
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 });
  }
}
