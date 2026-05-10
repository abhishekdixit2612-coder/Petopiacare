import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MOCK_BLOGS } from '../route';

const db = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { data: post, error } = await db()
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !post) {
      const mockPost = MOCK_BLOGS.find(b => b.slug === slug);
      if (mockPost) {
        return NextResponse.json({ post: mockPost }, { status: 200 });
      }
      throw error || new Error("Post not found");
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("Fetch Blog Details Error:", error);
    return NextResponse.json(
      { error: "Blog post not found" },
      { status: 404 }
    );
  }
}
