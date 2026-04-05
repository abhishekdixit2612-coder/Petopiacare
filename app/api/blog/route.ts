import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// High SEO Value Mock Data for MVP Fallback
export const MOCK_BLOGS = [
  { 
    id: "b1", 
    title: "Best Dog Food Brands in India (2025 Review)", 
    slug: "best-dog-food-brands-india",
    excerpt: "Discover the top-rated dog foods perfectly suited for Indian climates and breeds. We review the nutritional value, cost, and availability.",
    content: "<h2>Why Nutrition Matters in India</h2><p>Feeding your dog a balanced diet in India requires understanding our unique climate constraints...</p><h2>Top 5 Brands</h2><ol><li>Brand A</li><li>Brand B</li></ol>",
    featured_image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&q=80",
    category: "Nutrition",
    author: "PetopiaCare Experts",
    read_time_minutes: 5,
    date: "Mar 15, 2025",
    created_at: new Date().toISOString()
  },
  { 
    id: "b2", 
    title: "Stop Dog Pulling on Leash: Training Tips", 
    slug: "stop-dog-pulling-leash",
    excerpt: "Is your daily walk turning into a stressful tug-of-war? Learn the 3 proven techniques to stop your dog from pulling on the leash.",
    content: "<h2>Understanding the Pull</h2><p>Dogs pull because they walk faster than us, and the environment is highly stimulating...</p>",
    featured_image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
    category: "Training",
    author: "PetopiaCare Experts",
    read_time_minutes: 4,
    date: "Mar 10, 2025",
    created_at: new Date().toISOString()
  },
  { 
    id: "b3", 
    title: "Summer Dog Care in India: Hydration Guide", 
    slug: "summer-dog-care-india",
    excerpt: "Indian summers can be brutally hot for our furry friends. Here is how you can keep them perfectly hydrated and safe from heatstrokes.",
    content: "<h2>The Danger of Heatstroke</h2><p>Unlike humans, dogs do not sweat. They pant to cool down...</p>",
    featured_image: "https://images.unsplash.com/photo-1537151608804-ea6f25dc1005?w=800&q=80",
    category: "Health",
    author: "Dr. Sharma",
    read_time_minutes: 6,
    date: "Mar 05, 2025",
    created_at: new Date().toISOString()
  }
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    let query = supabase.from('blog_posts').select('*').eq('status', 'published');
    
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data: posts, error } = await query.order('created_at', { ascending: false });

    // Fallback if DB is not populated yet
    if (error || !posts || posts.length === 0) {
      let fallback = MOCK_BLOGS;
      if(category && category !== 'All') {
        fallback = fallback.filter(b => b.category === category);
      }
      return NextResponse.json({ posts: fallback }, { status: 200 });
    }

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Fetch Blogs Error:", error);
    // Return mock data reliably on error
    return NextResponse.json({ posts: MOCK_BLOGS }, { status: 200 });
  }
}
