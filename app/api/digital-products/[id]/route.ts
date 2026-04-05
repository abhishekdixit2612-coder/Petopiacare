import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MOCK_DIGITAL_PRODUCTS } from '../route';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: product, error } = await supabase
      .from('digital_products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !product) {
      const mockProduct = MOCK_DIGITAL_PRODUCTS.find(p => p.id === id);
      if (mockProduct) {
        // Hydrate mock data with "features" for detail page
        return NextResponse.json({ product: {
          ...mockProduct,
          features: [
            "Lifetime access to content updates",
            "30-day money-back guarantee",
            "Instant digital download",
            "Accessible on Mobile, Tablet, and Desktop"
          ]
        } }, { status: 200 });
      }
      throw error || new Error("Digital Product not found");
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Fetch Digital Product Details Error:", error);
    return NextResponse.json(
      { error: "Digital Product not found" },
      { status: 404 }
    );
  }
}
