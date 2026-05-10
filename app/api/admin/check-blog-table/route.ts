import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt VARCHAR(500),
  content TEXT NOT NULL,
  featured_image VARCHAR(500),
  category VARCHAR(50),
  author VARCHAR(100) DEFAULT 'PetopiaCare',
  read_time_minutes INT,
  status VARCHAR(20) DEFAULT 'published',
  seo_title VARCHAR(60),
  seo_description VARCHAR(160),
  seo_keywords VARCHAR(200),
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
`.trim();

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET() {
  const { error } = await adminClient()
    .from('blog_posts')
    .select('id', { count: 'exact', head: true });

  const exists = !error || error.code !== '42P01';
  return NextResponse.json({ exists, sql: CREATE_TABLE_SQL });
}

export async function POST() {
  const supabase = adminClient();

  // Attempt creation via a helper RPC if it exists, otherwise return the SQL for manual execution
  const { error: rpcErr } = await supabase.rpc('exec_sql', { query: CREATE_TABLE_SQL });

  if (!rpcErr) {
    return NextResponse.json({ ok: true, message: 'Table created via exec_sql.' });
  }

  // exec_sql doesn't exist — try creating it first, then retry
  const createFnSql = `
    CREATE OR REPLACE FUNCTION exec_sql(query text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER AS $$BEGIN EXECUTE query; END;$$;
  `;

  // If exec_sql doesn't exist we can't proceed automatically —
  // return the SQL for the user to run manually in Supabase SQL Editor
  return NextResponse.json({
    ok: false,
    manual: true,
    sql: CREATE_TABLE_SQL,
    createFnSql,
    editorUrl: `https://supabase.com/dashboard/project/${
      (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace('https://', '').split('.')[0]
    }/sql/new`,
  });
}
