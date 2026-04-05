import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const MOCK_DIGITAL_PRODUCTS = [
  { id: "dp1", title: "7-Day Dog Care Checklist", slug: "7-day-dog-care-checklist", price: 0, category: "Checklist", tier: "FREE", short_description: "The perfect starter checklist for new dog parents.", thumbnail_url: "https://images.unsplash.com/photo-1544568100-847a9ec5d878?w=800&q=80", rating: 4.8, review_count: 120, badge: "Free" },
  { id: "dp2", title: "Complete Dog Care Handbook", slug: "complete-dog-care-handbook", price: 149, category: "eBook", tier: "TIER2", short_description: "40 pages of dense, practical knowledge for Indian dog breeds.", thumbnail_url: "https://images.unsplash.com/photo-1537151608804-ea6f25dc1005?w=800&q=80", rating: 4.9, review_count: 54, badge: "Bestseller" },
  { id: "dp3", title: "Homemade Dog Food Recipes", slug: "homemade-dog-food-recipes", price: 199, category: "eBook", tier: "TIER2", short_description: "30 vet-approved recipes you can cook with Indian ingredients.", thumbnail_url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&q=80", rating: 5.0, review_count: 32, badge: "New" },
  { id: "dp4", title: "Puppy Parent Bootcamp", slug: "puppy-parent-bootcamp", price: 1999, category: "Course", tier: "TIER3", short_description: "4-week video course going from zero to obedient puppy.", thumbnail_url: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&q=80", rating: 4.9, review_count: 11, badge: "Premium" },
  { id: "dp5", title: "Complete Dog Parent Bundle", slug: "complete-dog-parent-bundle", price: 5999, category: "Course", tier: "TIER4", short_description: "All courses and handbooks combined for the ultimate value.", thumbnail_url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80", rating: 5.0, review_count: 5, badge: "Best Value" },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    let query = supabase.from('digital_products').select('*');
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    const { data: products, error } = await query.order('created_at', { ascending: false });

    if (error || !products || products.length === 0) {
      let fallback = MOCK_DIGITAL_PRODUCTS;
      if(category && category !== 'All') {
        fallback = fallback.filter(p => p.category === category);
      }
      return NextResponse.json({ products: fallback }, { status: 200 });
    }

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Fetch Digital Products Error:", error);
    return NextResponse.json({ products: MOCK_DIGITAL_PRODUCTS }, { status: 200 });
  }
}
