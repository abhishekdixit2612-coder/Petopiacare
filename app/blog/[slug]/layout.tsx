import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { MOCK_BLOGS } from '@/app/api/blog/route';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  // DB lookup
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  const blogPost = error || !post 
    ? MOCK_BLOGS.find(b => b.slug === slug) 
    : post;

  if (!blogPost) {
    return { title: 'Post Not Found | PetopiaCare' };
  }

  // Handle both mock 'image' and db 'featured_image'
  const imageUrl = blogPost.featured_image || blogPost.image || '/logos/og-image.png';

  return {
    title: blogPost.seo_title || blogPost.title,
    description: blogPost.seo_description || blogPost.excerpt,
    keywords: blogPost.seo_keywords ? blogPost.seo_keywords.split(',') : [blogPost.category, "dog training", "PetopiaCare"],
    authors: [{ name: blogPost.author }],
    openGraph: {
      title: blogPost.title,
      description: blogPost.excerpt,
      images: [{ url: imageUrl }],
      type: "article",
      publishedTime: blogPost.created_at || blogPost.date,
      authors: [blogPost.author],
    },
    twitter: {
      card: "summary_large_image",
      title: blogPost.title,
      description: blogPost.excerpt,
      images: [imageUrl],
    }
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
