import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function adminDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const ALL_PRODUCTS = [
  { title: '7-Day Dog Care Checklist', slug: '7-day-dog-care-checklist', price: 0, category: 'Checklist', tier: 'FREE', badge: 'Free', short_description: 'Daily checklist for new dog parents. Print it out and follow.', features: ['Morning routine checklist', 'Evening care reminders', 'Health tracking and paw checks', 'Training session prompts'], thumbnail_url: 'https://images.unsplash.com/photo-1544568100-847a9ec5d878?w=800&q=80', download_url: 'https://petopiacare.in/downloads/7-day-dog-care-checklist.pdf', rating: 4.9, review_count: 510 },
  { title: 'Understanding Dog Behavior (Free Guide)', slug: 'understanding-dog-behavior-free-guide', price: 0, category: 'Guide', tier: 'FREE', badge: 'Free', short_description: "Learn what your dog's behavior means with simple body language cues.", features: ['Tail and ear language explained', 'Body posture signals', 'Vocalization meanings', 'Calm dog training tips'], thumbnail_url: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?w=800&q=80', download_url: 'https://petopiacare.in/downloads/understanding-dog-behavior.pdf', rating: 4.8, review_count: 420 },
  { title: '5 Basic Dog Training Exercises', slug: '5-basic-dog-training-exercises', price: 0, category: 'Guide', tier: 'FREE', badge: 'Free', short_description: 'Learn 5 exercises you can teach your dog in 10 minutes.', features: ['Sit and stay basics', 'Come when called', 'Loose leash walking', 'Positive reward systems'], thumbnail_url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80', download_url: 'https://petopiacare.in/downloads/5-basic-dog-training-exercises.pdf', rating: 4.7, review_count: 320 },
  { title: 'Dog First Aid Guide', slug: 'dog-first-aid-guide', price: 0, category: 'Checklist', tier: 'FREE', badge: 'Free', short_description: 'A free dog first aid checklist for immediate home care.', features: ['Emergency care steps', 'Wound cleaning tips', 'Heat stroke actions', 'Poison response checklist'], thumbnail_url: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80', download_url: 'https://petopiacare.in/downloads/dog-first-aid-guide.pdf', rating: 4.7, review_count: 210 },
  { title: 'Potty Training Blueprint', slug: 'potty-training-blueprint', price: 0, category: 'Guide', tier: 'FREE', badge: 'Free', short_description: 'Potty training made easy with routine, rewards, and step-by-step practice.', features: ['Daily house training schedule', 'Positive reward system', 'Accident handling tips', 'Crate training support'], thumbnail_url: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=800&q=80', download_url: 'https://petopiacare.in/downloads/potty-training-blueprint.pdf', rating: 4.6, review_count: 190 },
  { title: 'The Complete Dog Care Handbook', slug: 'the-complete-dog-care-handbook', price: 149, category: 'eBook', tier: 'PAID', badge: 'Bestseller', short_description: 'Everything you need to know about dog care in India.', features: ['Nutrition & meal planning', 'Health and wellness care', 'Training basics', 'Emergency first aid'], thumbnail_url: 'https://images.unsplash.com/photo-1537151608804-ea6f25dc1005?w=800&q=80', download_url: 'https://petopiacare.in/downloads/complete-dog-care-handbook.pdf', rating: 4.9, review_count: 180 },
  { title: '6-Week Dog Training Masterclass', slug: '6-week-dog-training-masterclass', price: 499, category: 'Course', tier: 'PAID', badge: 'Premium', short_description: 'Professional dog training adapted for Indian homes.', features: ['12 training modules', 'Weekly progress plans', 'Behavior troubleshooting', 'Lifetime access'], thumbnail_url: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&q=80', download_url: 'https://petopiacare.in/downloads/6-week-dog-training-masterclass.zip', rating: 4.9, review_count: 88 },
  { title: 'Dog Nutrition Masterclass', slug: 'dog-nutrition-masterclass', price: 349, category: 'eBook', tier: 'PAID', badge: 'New', short_description: 'Create balanced meal plans with Indian ingredients.', features: ['30+ homemade recipes', 'Budget meal plans', 'Special diets for allergies', 'Shopping lists in INR'], thumbnail_url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&q=80', download_url: 'https://petopiacare.in/downloads/dog-nutrition-masterclass.pdf', rating: 4.8, review_count: 102 },
  { title: 'Dog Travel Preparation Kit', slug: 'dog-travel-preparation-kit', price: 99, category: 'Guide', tier: 'PAID', badge: 'Best Value', short_description: 'Prepare your dog for safe travel with the ultimate packing checklist.', features: ['Pre-travel health checklist', 'Travel-friendly feeding plan', 'Comfort and safety tips', 'Pet documentation guide'], thumbnail_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', download_url: 'https://petopiacare.in/downloads/dog-travel-preparation-kit.pdf', rating: 4.8, review_count: 130 },
  { title: 'Advanced Dog Nutrition Planner', slug: 'advanced-dog-nutrition-planner', price: 299, category: 'eBook', tier: 'PAID', badge: 'Premium', short_description: 'Balanced meal planning for dogs with allergies, weight goals, and active lifestyles.', features: ['Allergy-safe meal plans', 'Weight management recipes', 'Seasonal ingredient guide', 'Weekly shopping lists'], thumbnail_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&q=80', download_url: 'https://petopiacare.in/downloads/advanced-dog-nutrition-planner.pdf', rating: 4.9, review_count: 76 },
];

export async function POST() {
  try {
    const { error, count } = await adminDb()
      .from('digital_products')
      .upsert(ALL_PRODUCTS, { onConflict: 'slug', count: 'exact' });

    if (error) {
      console.error('Seed digital products error:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, count: count ?? ALL_PRODUCTS.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
