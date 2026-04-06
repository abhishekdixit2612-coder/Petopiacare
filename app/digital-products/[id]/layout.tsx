import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { MOCK_DIGITAL_PRODUCTS } from '@/app/api/digital-products/route';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;

  // Fetch product from DB or fallback to mock
  const { data: product, error } = await supabase
    .from('digital_products')
    .select('*')
    .eq('id', id)
    .single();

  const dp = error || !product 
    ? MOCK_DIGITAL_PRODUCTS.find(p => p.id === id) 
    : product;

  if (!dp) {
    return { title: 'Digital Product Not Found | PetopiaCare' };
  }

  return {
    title: `${dp.title} | Premium Digital Downloads`,
    description: dp.short_description,
    keywords: [dp.category, dp.tier, "dog training ebook", "dog courses online"],
    openGraph: {
      title: dp.title,
      description: dp.short_description,
      images: [{ url: dp.thumbnail_url }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dp.title,
      description: dp.short_description,
      images: [dp.thumbnail_url],
    }
  };
}

export default function DigitalProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
