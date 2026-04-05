import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MOCK_BLOGS } from '../route';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { data: post, error } = await supabase
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
