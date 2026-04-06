import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const MOCK_DIGITAL_PRODUCTS = [
  {
    id: 'dp1',
    title: '7-Day Dog Care Checklist',
    slug: '7-day-dog-care-checklist',
    price: 0,
    category: 'Checklist',
    tier: 'FREE',
    short_description: 'Daily checklist for new dog parents. Print it out and follow.',
    thumbnail_url: 'https://images.unsplash.com/photo-1544568100-847a9ec5d878?w=800&q=80',
    rating: 4.9,
    review_count: 510,
    badge: 'Free',
    features: [
      'Morning routine checklist',
      'Evening care reminders',
      'Health tracking and paw checks',
      'Training session prompts',
    ],
    download_url: 'https://petopiacare.in/downloads/7-day-dog-care-checklist.pdf',
  },
  {
    id: 'dp2',
    title: 'Understanding Dog Behavior (Free Guide)',
    slug: 'understanding-dog-behavior-free-guide',
    price: 0,
    category: 'Guide',
    tier: 'FREE',
    short_description: 'Learn what your dogâ€™s behavior means with simple body language cues.',
    thumbnail_url: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?w=800&q=80',
    rating: 4.8,
    review_count: 420,
    badge: 'Free',
    features: [
      'Tail and ear language explained',
      'Body posture signals',
      'Vocalization meanings',
      'Calm dog training tips',
    ],
    download_url: 'https://petopiacare.in/downloads/understanding-dog-behavior.pdf',
  },
  {
    id: 'dp3',
    title: '5 Basic Dog Training Exercises',
    slug: '5-basic-dog-training-exercises',
    price: 0,
    category: 'Guide',
    tier: 'FREE',
    short_description: 'Learn 5 exercises you can teach your dog in 10 minutes.',
    thumbnail_url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    rating: 4.7,
    review_count: 320,
    badge: 'Free',
    features: [
      'Sit and stay basics',
      'Come when called',
      'Loose leash walking',
      'Positive reward systems',
    ],
    download_url: 'https://petopiacare.in/downloads/5-basic-dog-training-exercises.pdf',
  },
  {
    id: 'dp4',
    title: 'The Complete Dog Care Handbook',
    slug: 'the-complete-dog-care-handbook',
    price: 149,
    category: 'eBook',
    tier: 'PAID',
    short_description: 'Everything you need to know about dog care in India.',
    thumbnail_url: 'https://images.unsplash.com/photo-1537151608804-ea6f25dc1005?w=800&q=80',
    rating: 4.9,
    review_count: 180,
    badge: 'Bestseller',
    features: [
      'Nutrition & meal planning',
      'Health and wellness care',
      'Training basics',
      'Emergency first aid',
    ],
    download_url: 'https://petopiacare.in/downloads/complete-dog-care-handbook.pdf',
  },
  {
    id: 'dp5',
    title: '6-Week Dog Training Masterclass',
    slug: '6-week-dog-training-masterclass',
    price: 499,
    category: 'Course',
    tier: 'PAID',
    short_description: 'Professional dog training adapted for Indian homes.',
    thumbnail_url: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&q=80',
    rating: 4.9,
    review_count: 88,
    badge: 'Premium',
    features: [
      '12 training modules',
      'Weekly progress plans',
      'Behavior troubleshooting',
      'Lifetime access',
    ],
    download_url: 'https://petopiacare.in/downloads/6-week-dog-training-masterclass.zip',
  },
  {
    id: 'dp6',
    title: 'Dog Nutrition Masterclass',
    slug: 'dog-nutrition-masterclass',
    price: 349,
    category: 'eBook',
    tier: 'PAID',
    short_description: 'Create balanced meal plans with Indian ingredients.',
    thumbnail_url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&q=80',
    rating: 4.8,
    review_count: 102,
    badge: 'New',
    features: [
      '30+ homemade recipes',
      'Budget meal plans',
      'Special diets for allergies',
      'Shopping lists in INR',
    ],
    download_url: 'https://petopiacare.in/downloads/dog-nutrition-masterclass.pdf',
  },
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
