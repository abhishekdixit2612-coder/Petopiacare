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
    short_description: 'Learn what your dog’s behavior means with simple body language cues.',
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
  {
    id: 'dp7',
    title: 'Dog First Aid Guide',
    slug: 'dog-first-aid-guide',
    price: 0,
    category: 'Checklist',
    tier: 'FREE',
    short_description: 'A free dog first aid checklist for immediate home care.',
    thumbnail_url: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80',
    rating: 4.7,
    review_count: 210,
    badge: 'Free',
    features: [
      'Emergency care steps',
      'Wound cleaning tips',
      'Heat stroke actions',
      'Poison response checklist',
    ],
    download_url: 'https://petopiacare.in/downloads/dog-first-aid-guide.pdf',
  },
  {
    id: 'dp8',
    title: 'Dog Travel Preparation Kit',
    slug: 'dog-travel-preparation-kit',
    price: 99,
    category: 'Guide',
    tier: 'PAID',
    short_description: 'Prepare your dog for safe travel with the ultimate packing checklist.',
    thumbnail_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    rating: 4.8,
    review_count: 130,
    badge: 'Best Value',
    features: [
      'Pre-travel health checklist',
      'Travel-friendly feeding plan',
      'Comfort and safety tips',
      'Pet documentation guide',
    ],
    download_url: 'https://petopiacare.in/downloads/dog-travel-preparation-kit.pdf',
  },
  {
    id: 'dp9',
    title: 'Potty Training Blueprint',
    slug: 'potty-training-blueprint',
    price: 0,
    category: 'Guide',
    tier: 'FREE',
    short_description: 'Potty training made easy with routine, rewards, and step-by-step practice.',
    thumbnail_url: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=800&q=80',
    rating: 4.6,
    review_count: 190,
    badge: 'Free',
    features: [
      'Daily house training schedule',
      'Positive reward system',
      'Accident handling tips',
      'Crate training support',
    ],
    download_url: 'https://petopiacare.in/downloads/potty-training-blueprint.pdf',
  },
  {
    id: 'dp10',
    title: 'Advanced Dog Nutrition Planner',
    slug: 'advanced-dog-nutrition-planner',
    price: 299,
    category: 'eBook',
    tier: 'PAID',
    short_description: 'Balanced meal planning for dogs with allergies, weight goals, and active lifestyles.',
    thumbnail_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&q=80',
    rating: 4.9,
    review_count: 76,
    badge: 'Premium',
    features: [
      'Allergy-safe meal plans',
      'Weight management recipes',
      'Seasonal ingredient guide',
      'Weekly shopping lists',
    ],
    download_url: 'https://petopiacare.in/downloads/advanced-dog-nutrition-planner.pdf',
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
