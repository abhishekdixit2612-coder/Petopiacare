import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'digital-downloads';

const admin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// GET /api/admin/upload?filename=foo.pdf
// Returns a signed upload URL so the browser can upload directly to Supabase Storage,
// bypassing Next.js body size limits entirely.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawName = searchParams.get('filename') ?? `file-${Date.now()}`;
  const storedName = `${Date.now()}-${rawName.replace(/[^a-zA-Z0-9._-]/g, '-')}`;

  const db = admin();

  const { data, error } = await db.storage
    .from(BUCKET)
    .createSignedUploadUrl(storedName);

  if (error) {
    const isMissing = error.message?.toLowerCase().includes('not found') ||
                      error.message?.toLowerCase().includes('does not exist') ||
                      error.message?.toLowerCase().includes('bucket');
    return NextResponse.json({
      error: isMissing
        ? `Storage bucket "${BUCKET}" not found. Go to Supabase → Storage → New bucket → name "digital-downloads" → set Public.`
        : error.message,
      bucketMissing: isMissing,
    }, { status: 400 });
  }

  const { data: { publicUrl } } = db.storage.from(BUCKET).getPublicUrl(storedName);

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path: data.path,
    publicUrl,
  });
}
