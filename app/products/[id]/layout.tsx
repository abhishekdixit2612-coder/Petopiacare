import { Metadata } from 'next';

const mockProducts = [
  { id: "1", name: "Classic Teal Collar", description: "A comfortable, durable collar in our signature teal. Built to last with reinforced stitching and double-locked buckles.", image_url: "https://images.unsplash.com/photo-1605365859556-9dccdb0e3092?w=800&q=80" },
  { id: "2", name: "Comfort Harness Orange", description: "Our warmest accent color designed into a premium, no-pull harness. Keeps your dog safe and comfortable on long walks.", image_url: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80" },
];

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  
  // Using direct fetch/mock fallback logic
  const product = mockProducts.find(p => p.id === id) || mockProducts[0];

  return {
    title: `${product.name} | PetopiaCare`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: [{ url: product.image_url }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.substring(0, 160),
      images: [product.image_url],
    }
  };
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
