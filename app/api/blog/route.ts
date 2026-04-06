import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// High SEO Value Mock Data for MVP Fallback
export const MOCK_BLOGS = [
  {
    id: "b1",
    title: "Best Dog Food Brands in India for 2026",
    slug: "best-dog-food-brands-india",
    excerpt: "Find India’s top dog food brands, nutrition ratings, and matching recipes for every breed and budget.",
    content: "<h2>Choose nutrition that fits your dog</h2><p>When selecting dog food in India, focus on locally available brands with clear protein sources, balanced fats, and added vitamins.</p><h3>Top considerations</h3><ul><li>Age-specific formulas for puppies, adults, and seniors.</li><li>High-quality protein from chicken, fish, or lamb.</li><li>Easy digestion for Indian weather and humidity.</li></ul><p>Mix dry kibble with fresh veggies or home-cooked options to keep your dog excited at meal time.</p>",
    featured_image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80",
    category: "Nutrition",
    author: "PetopiaCare Experts",
    read_time_minutes: 5,
    date: "Apr 01, 2026",
    created_at: new Date().toISOString()
  },
  {
    id: "b2",
    title: "Homemade Dog Food Recipe for Indian Dogs (Budget-Friendly & Healthy)",
    slug: "homemade-dog-food-recipe-indian-dogs",
    excerpt: "Learn how to make nutritious, budget-friendly dog food at home. Step-by-step recipes perfect for Indian dog breeds.",
    content: "<h2>Introduction</h2><p>Your dog deserves healthy, nutritious food. Many Indian pet parents worry about commercial dog food quality or budget constraints. This guide shows you how to prepare homemade dog food that&rsquo;s healthier, cheaper, and just as nutritious.</p><h2>Recipe 1: Basic Chicken & Rice</h2><p>Ingredients: 2 cups cooked chicken (boiled, no salt), 1 cup cooked brown rice, 1/2 cup cooked vegetables (carrots, beans, peas), 1 tbsp coconut oil, 1/2 tsp turmeric.</p><p>Instructions: Boil chicken until tender, cook brown rice separately, boil vegetables until soft, mix all ingredients, store in refrigerator for 3-4 days, and serve at room temperature.</p><h2>Common Mistakes to Avoid</h2><p>Do not use onions or garlic, which are toxic to dogs. Avoid oversalting, uncooked vegetables, and spices other than turmeric.</p>",
    featured_image: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80",
    category: "Nutrition",
    author: "PetopiaCare Experts",
    read_time_minutes: 8,
    date: "Apr 06, 2026",
    created_at: new Date().toISOString()
  },
  {
    id: "b3",
    title: "Stop Dog Pulling on Leash: Training Tips That Work",
    slug: "stop-dog-pulling-on-leash",
    excerpt: "Turn daily walks into a calm experience with proven leash training techniques for Indian dogs.",
    content: "<h2>Why dogs pull</h2><p>Most dogs pull because the walk is too exciting and they want to explore faster than their owner.</p><h3>Try these steps</h3><ul><li>Start with short indoor sessions.</li><li>Reward the dog for walking beside you.</li><li>Use a comfortable harness and consistent verbal cues.</li></ul><p>Patience and consistency are the keys to a stress-free walk.</p>",
    featured_image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80",
    category: "Training",
    author: "PetopiaCare Experts",
    read_time_minutes: 4,
    date: "Mar 28, 2026",
    created_at: new Date().toISOString()
  },
  {
    id: "b4",
    title: "Summer Dog Care in India: Hydration & Heat Safety",
    slug: "summer-dog-care-india",
    excerpt: "Keep your dog cool and safe during India’s hot months with hydration, grooming, and sun protection advice.",
    content: "<h2>The Danger of Heatstroke</h2><p>Unlike humans, dogs do not sweat. They pant to cool down, so staying hydrated is critical during the summer.</p><h3>Summer care essentials</h3><ul><li>Fresh water at all times.</li><li>Light grooming and short walks during cooler hours.</li><li>Shaded resting spots and cooling mats.</li></ul>",
    featured_image: "https://images.unsplash.com/photo-1537151608804-ea6f25dc1005?w=800&q=80",
    category: "Health",
    author: "Dr. Sharma",
    read_time_minutes: 6,
    date: "Mar 20, 2026",
    created_at: new Date().toISOString()
  },
  {
    id: "b5",
    title: "Choosing a Safe Dog Harness for Every Breed",
    slug: "choosing-safe-dog-harness",
    excerpt: "Find the best dog harness for comfort, control, and safety across small, medium, and large breeds.",
    content: "<h2>Why a good harness matters</h2><p>The right harness protects your dog&rsquo;s neck and provides better control without restricting movement.</p><h3>What to look for</h3><ul><li>Soft padded straps that do not rub.</li><li>Adjustable fit for chest and shoulders.</li><li>Strong buckles and D-ring support.</li></ul>",
    featured_image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80",
    category: "Products",
    author: "PetopiaCare Experts",
    read_time_minutes: 5,
    date: "Mar 14, 2026",
    created_at: new Date().toISOString()
  },
  {
    id: "b6",
    title: "Grooming Tips for Indian Dogs: Coat, Nails, and Skin",
    slug: "grooming-tips-indian-dogs",
    excerpt: "Keep your dog looking healthy and comfortable with the right bathing, brushing, and nail care routine.",
    content: "<h2>Daily grooming habits</h2><p>Regular brushing removes loose fur, reduces matting, and improves skin health.</p><h3>Focus areas</h3><ul><li>Brush weekly for medium and long coats.</li><li>Trim nails safely with a guided clipper.</li><li>Check ears and teeth during grooming sessions.</li></ul>",
    featured_image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&q=80",
    category: "Grooming",
    author: "PetopiaCare Experts",
    read_time_minutes: 5,
    date: "Mar 10, 2026",
    created_at: new Date().toISOString()
  },
  {
    id: "b7",
    title: "Puppy Training Basics Every New Owner Needs",
    slug: "puppy-training-basics",
    excerpt: "Start your puppy right with easy-to-follow house training, socialization, and reward-based techniques.",
    content: "<h2>Start early with consistency</h2><p>Puppies learn best through repetition, calm guidance, and positive reinforcement.</p><h3>Essential puppy training steps</h3><ul><li>Use a clear potty schedule.</li><li>Practice simple commands like sit and stay.</li><li>Socialize with people and other dogs gently.</li></ul>",
    featured_image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
    category: "Training",
    author: "PetopiaCare Experts",
    read_time_minutes: 5,
    date: "Mar 05, 2026",
    created_at: new Date().toISOString()
  },
  {
    id: "b8",
    title: "Common Dog Health Issues and When to See a Vet",
    slug: "common-dog-health-issues",
    excerpt: "Recognize early signs of infection, allergies, and joint pain so you can act before problems worsen.",
    content: "<h2>Watch for warning signs</h2><p>Symptoms like frequent scratching, limping, or appetite loss may indicate a health issue.</p><h3>Common concerns in Indian dogs</h3><ul><li>Skin allergies and flea irritation.</li><li>Digestive upset from diet changes.</li><li>Heat-related fatigue and dehydration.</li></ul>",
    featured_image: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=800&q=80",
    category: "Health",
    author: "Dr. Sharma",
    read_time_minutes: 6,
    date: "Feb 28, 2026",
    created_at: new Date().toISOString()
  },
  {
    id: "b9",
    title: "Dog Dental Care Guide: Healthy Teeth for Happy Dogs",
    slug: "dog-dental-care-guide",
    excerpt: "Healthy teeth keep your dog smiling. Learn daily brushing, teething, and dental treat routines.",
    content: "<h2>Why dental care matters</h2><p>Poor oral hygiene can lead to bad breath, gum disease, and more serious infections.</p><h3>Simple daily habits</h3><ul><li>Brush with dog-safe toothpaste.</li><li>Offer dental chews and crunchy treats.</li><li>Schedule regular vet check-ups.</li></ul>",
    featured_image: "https://images.unsplash.com/photo-1517423440428-7a9ea5a07f7f?w=800&q=80",
    category: "Health",
    author: "PetopiaCare Experts",
    read_time_minutes: 5,
    date: "Feb 22, 2026",
    created_at: new Date().toISOString()
  },
  {
    id: "b10",
    title: "Traveling with Your Dog in India: Planning, Safety, and Comfort",
    slug: "traveling-with-dog-india",
    excerpt: "Make dog travel easy with packing lists, transport tips, and destination advice for Indian pet families.",
    content: "<h2>Travel smart with your dog</h2><p>Choose pet-friendly transportation and plan for food, water, and potty breaks.</p><h3>Must-pack essentials</h3><ul><li>Collapsible bowls and fresh water.</li><li>Comfortable collar and leash.</li><li>Health records and vaccination proofs.</li></ul>",
    featured_image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    category: "Lifestyle",
    author: "PetopiaCare Experts",
    read_time_minutes: 6,
    date: "Feb 15, 2026",
    created_at: new Date().toISOString()
  },
  {
    id: "b11",
    title: "Introducing a New Puppy to Your Home",
    slug: "introducing-new-puppy",
    excerpt: "Bring home your puppy with confidence using preparation tips for sleeping, feeding, and family introduction.",
    content: "<h2>Welcome your new family member</h2><p>Set up a calm space with a cozy bed, toys, and a feeding station before the puppy arrives.</p><h3>First week priorities</h3><ul><li>Maintain a consistent feeding schedule.</li><li>Provide gentle social exposure.</li><li>Reward quiet, confident behavior.</li></ul>",
    featured_image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
    category: "Lifestyle",
    author: "PetopiaCare Experts",
    read_time_minutes: 5,
    date: "Feb 08, 2026",
    created_at: new Date().toISOString()
  },
  {
    id: "b12",
    title: "Rainy Season Dog Care: Waterproof Gear & Clean Paws",
    slug: "rainy-season-dog-care",
    excerpt: "Keep your dog dry, clean, and comfortable during monsoon with easy grooming and rain-ready gear.",
    content: "<h2>Monsoon dog care essentials</h2><p>Wet weather can lead to muddy paws, damp fur, and skin irritation if not managed properly.</p><h3>Best rainy season routines</h3><ul><li>Dry paws after every walk.</li><li>Use lightweight raincoats and quick-dry blankets.</li><li>Brush fur gently to remove debris.</li></ul>",
    featured_image: "https://images.unsplash.com/photo-1537151608804-ea6f25dc1005?w=800&q=80",
    category: "Health",
    author: "PetopiaCare Experts",
    read_time_minutes: 5,
    date: "Feb 01, 2026",
    created_at: new Date().toISOString()
  },
  {
    id: "b13",
    title: "Senior Dog Care Tips: Comfort, Diet, and Gentle Exercise",
    slug: "senior-dog-care-tips",
    excerpt: "Support your aging dog with softer diets, joint-friendly exercise, and comfort-focused home changes.",
    content: "<h2>Adjust care for senior dogs</h2><p>Older dogs benefit from softer food, low-impact activity, and warm resting spots.</p><h3>Senior-friendly changes</h3><ul><li>Switch to senior-specific nutrition.</li><li>Use supportive beds and easy ramps.</li><li>Monitor mobility and joint comfort daily.</li></ul>",
    featured_image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80",
    category: "Health",
    author: "PetopiaCare Experts",
    read_time_minutes: 5,
    date: "Jan 25, 2026",
    created_at: new Date().toISOString()
  },
  {
    id: "b14",
    title: "A Practical Dog Breed Guide for Indian Families",
    slug: "dog-breed-guide-indian-families",
    excerpt: "Choose the right dog breed for your lifestyle with this Indian-friendly breed guide and care comparison.",
    content: "<h2>Find the right breed</h2><p>Matching a dog breed with your home, activity level, and family is the first step to long-term happiness.</p><h3>Popular Indian choices</h3><ul><li>Indian Spitz: loyal, adaptable, low maintenance.</li><li>Labrador Retriever: playful, family-friendly, active.</li><li>Pug: compact, affectionate, indoor-friendly.</li></ul>",
    featured_image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80",
    category: "Breed Guide",
    author: "PetopiaCare Experts",
    read_time_minutes: 6,
    date: "Jan 18, 2026",
    created_at: new Date().toISOString()
  },
  {
    id: "b15",
    title: "Natural Dog Treats You Can Make at Home",
    slug: "natural-dog-treats-at-home",
    excerpt: "Create healthy dog treats with simple ingredients and avoid processed snacks with this easy homemade recipe guide.",
    content: "<h2>Homemade treats are healthier</h2><p>DIY dog treats let you control the ingredients and avoid preservatives and fillers.</p><h3>Recipe ideas</h3><ul><li>Peanut butter banana bites</li><li>Sweet potato chips</li><li>Chicken and carrot cubes</li></ul>",
    featured_image: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?w=800&q=80",
    category: "Nutrition",
    author: "PetopiaCare Experts",
    read_time_minutes: 5,
    date: "Jan 10, 2026",
    created_at: new Date().toISOString()
  },
  {
    id: "b16",
    title: "Building a Dog-Friendly Home in India",
    slug: "building-dog-friendly-home-india",
    excerpt: "Make your home safe and comfortable for dogs with smart layout, storage, and care zones.",
    content: "<h2>Small changes make a big difference</h2><p>Designate a feeding area, a cozy bed corner, and an easy-clean play zone.</p><h3>Home setup tips</h3><ul><li>Choose washable floor mats and removable bed covers.</li><li>Use secure gates to block off sensitive areas.</li><li>Store toys and food in labeled bins.</li></ul>",
    featured_image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    category: "Lifestyle",
    author: "PetopiaCare Experts",
    read_time_minutes: 5,
    date: "Jan 03, 2026",
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
