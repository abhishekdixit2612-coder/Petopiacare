import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'digital-downloads';

const admin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const ext = file.name.split('.').pop() ?? 'pdf';
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;

    const buffer = await file.arrayBuffer();
    const db = admin();

    const { error: uploadError } = await db.storage
      .from(BUCKET)
      .upload(filename, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      // Bucket might not exist — provide helpful message
      if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('does not exist')) {
        return NextResponse.json({
          error: `Storage bucket "${BUCKET}" not found. Create it in Supabase → Storage → New bucket → name: "digital-downloads" → Public.`,
          bucketMissing: true,
        }, { status: 400 });
      }
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = db.storage.from(BUCKET).getPublicUrl(filename);

    return NextResponse.json({ ok: true, url: publicUrl, filename });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
