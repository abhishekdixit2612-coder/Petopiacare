'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Check, AlertCircle, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { BLOG_CONTENT } from '@/lib/blog-content';

interface SeedPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  author: string;
  read_time_minutes: number;
  status: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
}

const staticPosts: SeedPost[] = [
  // ── Rich-content posts (content overridden from BLOG_CONTENT on seed) ──
  {
    title: 'Best Dog Food Brands in India for 2026',
    slug: 'best-dog-food-brands-india',
    excerpt: "India's top dog food brands, nutrition ratings, and matching recipes for every breed and budget.",
    content: '',
    featured_image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=1600&q=85&auto=format&fit=crop',
    category: 'Nutrition', author: 'PetopiaCare Experts', read_time_minutes: 8, status: 'published',
    seo_title: 'Best Dog Food Brands in India | 2026 Pet Nutrition Guide',
    seo_description: 'Discover top dog food brands in India for 2026, with nutrition tips, price comparisons, and feeding advice for every breed.',
    seo_keywords: 'dog food india, best dog food, dog nutrition, pet food brands',
  },
  {
    title: 'Homemade Dog Food Recipe for Indian Dogs',
    slug: 'homemade-dog-food-recipe-indian-dogs',
    excerpt: 'Nutritious, budget-friendly dog food recipes using Indian kitchen ingredients.',
    content: '',
    featured_image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=1600&q=85&auto=format&fit=crop',
    category: 'Nutrition', author: 'PetopiaCare Experts', read_time_minutes: 10, status: 'published',
    seo_title: 'Homemade Dog Food Recipe for Indian Dogs (Budget & Healthy)',
    seo_description: 'Step-by-step homemade dog food recipes for Indian dogs. Budget-friendly, healthy ingredients.',
    seo_keywords: 'homemade dog food recipe, dog food recipes india, budget dog food',
  },
  {
    title: 'Stop Dog Pulling on Leash: Training Tips That Work',
    slug: 'stop-dog-pulling-on-leash',
    excerpt: 'Turn daily walks into a calm experience with proven positive-reinforcement leash training techniques.',
    content: '',
    featured_image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1600&q=85&auto=format&fit=crop',
    category: 'Training', author: 'PetopiaCare Experts', read_time_minutes: 7, status: 'published',
    seo_title: 'How to Stop Dog Pulling on Leash | Training Guide',
    seo_description: 'Learn leash training tips to stop your dog from pulling, with step-by-step guidance for Indian pet parents.',
    seo_keywords: 'dog pulling leash, leash training, dog walking tips, pet training india',
  },
  {
    title: 'Summer Dog Care in India: Hydration & Heat Safety',
    slug: 'summer-dog-care-india',
    excerpt: "Keep your dog safe during India's hot months. Heatstroke prevention, hydration tips, and summer grooming.",
    content: '',
    featured_image: 'https://images.unsplash.com/photo-1537151608804-ea6f25dc1005?w=1600&q=85&auto=format&fit=crop',
    category: 'Health', author: 'PetopiaCare Experts', read_time_minutes: 8, status: 'published',
    seo_title: 'Summer Dog Care India | Hydration & Heat Safety Tips',
    seo_description: 'Protect your dog from Indian summer heat with hydration tips, grooming advice, and sun safety strategies.',
    seo_keywords: 'summer dog care, heat safety for dogs, hydration tips, Indian pet care',
  },
  {
    title: 'How to Choose the Right Dog Harness',
    slug: 'choosing-safe-dog-harness',
    excerpt: 'A complete buying guide — comparing no-pull, padded, and polymer harnesses for Indian breeds.',
    content: '',
    featured_image: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=1600&q=85&auto=format&fit=crop',
    category: 'Products', author: 'PetopiaCare Experts', read_time_minutes: 6, status: 'published',
    seo_title: 'Safe Dog Harness Guide | Best Harnesses for Dogs',
    seo_description: 'Discover how to choose the safest dog harness for your pet, with tips for fit, design, and breed-specific comfort.',
    seo_keywords: 'dog harness india, safe harness, dog walking gear, pet products',
  },
  {
    title: 'Dog Grooming Guide for Indian Breeds',
    slug: 'grooming-tips-indian-dogs',
    excerpt: 'Coat care, nail trimming, ear cleaning and skin health routines tailored for Indian weather and breeds.',
    content: '',
    featured_image: 'https://images.unsplash.com/photo-1625213327543-b24c2fc0d6ee?w=1600&q=85&auto=format&fit=crop',
    category: 'Grooming', author: 'PetopiaCare Experts', read_time_minutes: 7, status: 'published',
    seo_title: 'Indian Dog Grooming Tips | Coat, Nails & Skin Care',
    seo_description: 'Master dog grooming in India with expert tips for coat care, nail trimming, and skin health.',
    seo_keywords: 'dog grooming india, pet grooming tips, dog skin care, nail trimming',
  },
  {
    title: 'Puppy Training Basics Every New Owner Needs',
    slug: 'puppy-training-basics',
    excerpt: 'Start your puppy right — house training, socialisation, bite inhibition, and reward-based first commands.',
    content: '',
    featured_image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1600&q=85&auto=format&fit=crop',
    category: 'Training', author: 'PetopiaCare Experts', read_time_minutes: 9, status: 'published',
    seo_title: 'Puppy Training Basics | New Dog Owner Guide',
    seo_description: 'Learn puppy training basics for Indian homes, including house training, socialisation, and gentle rewards.',
    seo_keywords: 'puppy training, new dog owner, dog socialization, positive reinforcement',
  },
  {
    title: 'Common Dog Health Issues in India & When to See a Vet',
    slug: 'common-dog-health-issues',
    excerpt: "Tick fever, mange, parvovirus and more — symptoms to watch for and when it's a vet emergency.",
    content: '',
    featured_image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1600&q=85&auto=format&fit=crop',
    category: 'Health', author: 'Dr. Priya Sharma', read_time_minutes: 10, status: 'published',
    seo_title: 'Common Dog Health Issues | Vet Advice for Indian Pets',
    seo_description: 'Identify common dog health issues early and learn when to seek veterinary care for your pet.',
    seo_keywords: 'dog health issues, vet advice, pet illness signs, dog allergies',
  },
  {
    title: 'Indian Pariah Dog: The Complete Breed Guide',
    slug: 'indian-pariah-dog-guide',
    excerpt: 'Everything about the Desi dog — temperament, care, training, and why adopting an INDog is the best decision.',
    content: '',
    featured_image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&q=85&auto=format&fit=crop',
    category: 'Breeds', author: 'PetopiaCare Experts', read_time_minutes: 9, status: 'published',
    seo_title: 'Indian Pariah Dog Breed Guide | INDog Complete Care',
    seo_description: 'Complete guide to the Indian Pariah Dog — temperament, care, training, and why adopting a Desi dog is the right choice.',
    seo_keywords: 'indian pariah dog, INDog, desi dog, adopt indian dog, indian dog breed',
  },
  {
    title: 'Vaccination Schedule for Dogs in India — 2026 Guide',
    slug: 'dog-vaccination-schedule-india',
    excerpt: 'Core vaccines, timing, cost, and what to expect — the complete guide for Indian dog owners.',
    content: '',
    featured_image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1600&q=85&auto=format&fit=crop',
    category: 'Health', author: 'Dr. Priya Sharma', read_time_minutes: 8, status: 'published',
    seo_title: 'Dog Vaccination Schedule India 2026 | Complete Guide',
    seo_description: 'Complete dog vaccination schedule for India — core vaccines, timing, boosters, and cost guide.',
    seo_keywords: 'dog vaccination india, vaccine schedule, puppy shots, rabies vaccine dog',
  },
  {
    title: 'Tick Prevention for Dogs in India: Year-Round Guide',
    slug: 'tick-prevention-dogs-india',
    excerpt: 'Spot-on treatments, tick collars, and environmental control — comprehensive tick prevention for Indian conditions.',
    content: '',
    featured_image: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=1600&q=85&auto=format&fit=crop',
    category: 'Health', author: 'PetopiaCare Experts', read_time_minutes: 7, status: 'published',
    seo_title: 'Tick Prevention for Dogs India | Year-Round Guide',
    seo_description: 'Protect your dog from ticks year-round in India with spot-on treatments, collars, and environmental control tips.',
    seo_keywords: 'tick prevention dogs india, frontline, seresto collar, tick fever dog',
  },
  {
    title: "Labrador Retriever in India: Owner's Complete Care Guide",
    slug: 'labrador-care-guide-india',
    excerpt: "Labs are India's most popular breed. Here's everything you need to raise one well in the Indian climate.",
    content: '',
    featured_image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=1600&q=85&auto=format&fit=crop',
    category: 'Breeds', author: 'PetopiaCare Experts', read_time_minutes: 11, status: 'published',
    seo_title: 'Labrador Retriever Care Guide India | Lab Owner Tips',
    seo_description: "Complete care guide for Labrador Retrievers in India — diet, exercise, grooming, and health tips.",
    seo_keywords: 'labrador care india, lab retriever guide, labrador food, lab exercise india',
  },

  // ── Additional posts ──
  {
    title: 'Dog Dental Care Guide: Healthy Teeth for Happy Dogs',
    slug: 'dog-dental-care-guide',
    excerpt: 'Healthy teeth keep your dog smiling. Learn daily brushing, teething, and dental treat routines.',
    content: '<h2>Why dental care matters</h2><p>Poor oral hygiene can lead to bad breath, gum disease, and more serious infections. By age 3, over 80% of dogs in India show signs of dental disease — yet it remains the most neglected part of pet care.</p><h2>Simple daily habits</h2><ul><li>Brush with dog-safe toothpaste — never use human toothpaste, which contains fluoride toxic to dogs.</li><li>Offer dental chews and crunchy treats to reduce tartar build-up.</li><li>Schedule annual vet dental check-ups starting at age 2.</li></ul><h2>Signs of dental problems</h2><p>Bad breath is the first sign. Also watch for yellow-brown tartar on teeth, swollen or bleeding gums, pawing at the mouth, and reluctance to eat hard food.</p><h2>Brushing technique</h2><p>Use a finger brush or soft toothbrush designed for dogs. Work in small circles along the gum line. Start with just 30 seconds daily, gradually building to 2 minutes. Most dogs accept brushing once they associate it with a post-brush treat.</p>',
    featured_image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&q=85&auto=format&fit=crop',
    category: 'Health', author: 'PetopiaCare Experts', read_time_minutes: 5, status: 'published',
    seo_title: 'Dog Dental Care Guide | Healthy Teeth for Dogs',
    seo_description: "Keep your dog's teeth clean with practical dental care tips, brushing routines, and preventive habits.",
    seo_keywords: 'dog dental care, dog teeth cleaning, pet oral hygiene, dental chews',
  },
  {
    title: 'Traveling with Your Dog in India: Planning, Safety, and Comfort',
    slug: 'traveling-with-dog-india',
    excerpt: 'Make dog travel easy with packing lists, transport tips, and destination advice for Indian pet families.',
    content: '<h2>Planning your trip</h2><p>Research pet policies before booking — most Indian trains allow dogs in the luggage van with prior booking, while airlines have strict carrier size and breed restrictions. Road trips remain the most flexible option.</p><h2>Essential packing list</h2><ul><li>Collapsible bowls and a 2-litre water bottle</li><li>Current vaccination booklet and vet certificate</li><li>Sufficient food for the journey plus 2 extra days</li><li>Comfort item from home (favourite toy or blanket)</li><li>First aid kit including tick remover and antihistamines</li></ul><h2>During the journey</h2><p>Stop every 2-3 hours for water, toilet breaks, and short stretches. Never leave your dog in a parked car — even 5 minutes in Indian heat can be dangerous. Keep your dog secured with a travel harness or crate to prevent distraction while driving.</p><h2>At your destination</h2><p>Give your dog 24 hours to settle before exploring. Bring familiar bedding. Check for local tick and disease risks — different regions of India have different health concerns.</p>',
    featured_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=85&auto=format&fit=crop',
    category: 'Lifestyle', author: 'PetopiaCare Experts', read_time_minutes: 6, status: 'published',
    seo_title: 'Traveling with Dogs in India | Pet Travel Tips',
    seo_description: 'Prepare for safe and comfortable dog travel in India with packing tips, transport advice, and destination planning.',
    seo_keywords: 'traveling with dog, pet travel india, dog safety travel, dog travel essentials',
  },
  {
    title: 'Introducing a New Puppy to Your Home',
    slug: 'introducing-new-puppy',
    excerpt: 'Bring home your puppy with confidence using preparation tips for sleeping, feeding, and family introduction.',
    content: '<h2>Before arrival</h2><p>Set up the puppy\'s space before you bring them home: a comfortable bed in a quiet corner, a water bowl, and a food station. Puppy-proof the area by removing cables, small objects, and anything the puppy could chew or swallow.</p><h2>The first 24 hours</h2><p>Keep the environment calm. Limit visitors — your family is enough stimulation for the first day. Show the puppy the toilet area immediately after arriving and every 30 minutes thereafter. Expect accidents and react calmly.</p><h2>Introducing family members</h2><p>Introduce one person at a time, at the puppy\'s level, letting the puppy approach rather than being grabbed. Children should be supervised and taught to sit quietly rather than chase. Other pets should be introduced through a baby gate first — one sniff session per day, gradually increasing.</p><h2>Sleep setup</h2><p>A crate or pen next to your bed is ideal for the first week. Puppies cry because they miss their littermates. A warm water bottle wrapped in a towel and a ticking clock can mimic the warmth and heartbeat of siblings.</p>',
    featured_image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1600&q=85&auto=format&fit=crop',
    category: 'Lifestyle', author: 'PetopiaCare Experts', read_time_minutes: 5, status: 'published',
    seo_title: 'Introducing a New Puppy | Home Preparation Guide',
    seo_description: 'Learn how to welcome a new puppy with the right setup, feeding routine, and social introduction.',
    seo_keywords: 'new puppy guide, puppy introduction, dog home setup, puppy care',
  },
  {
    title: 'Rainy Season Dog Care: Waterproof Gear & Clean Paws',
    slug: 'rainy-season-dog-care',
    excerpt: 'Keep your dog dry, clean, and comfortable during monsoon with easy grooming and rain-ready gear.',
    content: '<h2>Monsoon health risks</h2><p>The rainy season brings specific dangers for Indian dogs: leptospirosis from contaminated floodwater, fungal skin infections from damp fur, and a dramatic increase in tick and flea activity as vegetation stays wet.</p><h2>Paw care routine</h2><p>Wipe paws after every walk with a clean damp cloth, paying attention to the spaces between the toes. Dry thoroughly — moisture between the toes causes fungal infections within 48 hours in India\'s humidity. Check for embedded stones or thorns, and inspect for ticks.</p><h2>Coat care</h2><p>Brush more frequently during monsoon — damp fur mats faster. If your dog gets soaked, dry with a towel and if possible a hair dryer on cool setting before they rest. Damp fur left to dry on its own develops a characteristic "wet dog" smell from bacterial growth.</p><h2>Gear recommendations</h2><ul><li>Lightweight nylon raincoat for walks</li><li>Quick-dry microfibre towel kept at the door</li><li>Absorbent doormat for paw drying</li><li>Increase tick prevention frequency during peak monsoon</li></ul>',
    featured_image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1600&q=85&auto=format&fit=crop',
    category: 'Health', author: 'PetopiaCare Experts', read_time_minutes: 5, status: 'published',
    seo_title: 'Rainy Season Dog Care | Monsoon Pet Tips India',
    seo_description: 'Manage monsoon pet care with rain-ready gear, paw cleaning tips, and skin protection for dogs in India.',
    seo_keywords: 'rainy season dog care, monsoon pet care, dog paw cleaning, waterproof dog gear',
  },
  {
    title: 'Senior Dog Care Tips: Comfort, Diet, and Gentle Exercise',
    slug: 'senior-dog-care-tips',
    excerpt: 'Support your aging dog with softer diets, joint-friendly exercise, and comfort-focused home changes.',
    content: '<h2>When is a dog "senior"?</h2><p>Large breeds age faster: a Labrador or German Shepherd is considered senior at 7 years. Small breeds like Pugs or Shih Tzus typically reach senior status at 10-11 years. Indian Pariah Dogs tend to age more gracefully, often not showing senior signs until 9-10 years.</p><h2>Nutrition changes</h2><p>Senior dogs need fewer calories but more protein to maintain muscle mass. Switch to a senior-formulated food or ask your vet about supplements — glucosamine for joints, Omega-3s for coat and cognition. Serve food at room temperature or slightly warm to enhance aroma and palatability.</p><h2>Exercise modifications</h2><p>Shorten walks but keep them daily — routine is important for aging dogs\' mental health. Avoid high-impact activities like jumping or stairs. Swimming is excellent if accessible. Watch for limping or stiffness that suggests discomfort during or after activity.</p><h2>Home comfort</h2><ul><li>Orthopaedic or memory foam bed to support joints</li><li>Ramps or low-rise steps for furniture access</li><li>Non-slip mats on hard floors</li><li>More frequent vet check-ups — every 6 months instead of annually</li></ul>',
    featured_image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1600&q=85&auto=format&fit=crop',
    category: 'Health', author: 'PetopiaCare Experts', read_time_minutes: 6, status: 'published',
    seo_title: 'Senior Dog Care Tips | Comfort & Nutrition India',
    seo_description: 'Care for aging dogs in India with diet adjustments, gentle exercise, and comfort-focused home changes.',
    seo_keywords: 'senior dog care, older dog tips, dog joint care, senior pet nutrition india',
  },
  {
    title: 'A Practical Dog Breed Guide for Indian Families',
    slug: 'dog-breed-guide-indian-families',
    excerpt: 'Choose the right dog breed for your lifestyle with this Indian-friendly breed guide and care comparison.',
    content: '<h2>Matching breed to lifestyle</h2><p>The most important question is not "which breed is most popular?" but "which breed suits your space, activity level, and climate?" A wrong match leads to stress for both dog and family.</p><h2>Best breeds for Indian apartments</h2><ul><li><strong>Indian Pariah Dog</strong>: The most climate-adapted, healthiest, lowest-maintenance dog available in India. Highly underrated.</li><li><strong>Beagle</strong>: Compact, friendly, manageable energy. Can develop separation anxiety if left alone too long.</li><li><strong>Pug</strong>: Small and affectionate, but brachycephalic — struggles in Indian heat. Requires air-conditioned environment in summer.</li></ul><h2>Best breeds for active families with space</h2><ul><li><strong>Labrador Retriever</strong>: India\'s most popular breed for good reason. Trainable, gentle, family-friendly. Needs 90+ minutes daily exercise.</li><li><strong>German Shepherd</strong>: Loyal, protective, very trainable. High energy and high intelligence — needs a job to do.</li><li><strong>Golden Retriever</strong>: Excellent temperament but struggles more than Labs in Indian heat due to heavier coat.</li></ul><h2>Breeds to avoid for first-time Indian owners</h2><p>Huskies, Malamutes, and Saint Bernards are unsuited to Indian climate and suffer year-round. High-drive working breeds like Belgian Malinois require expert handling. Brachycephalic breeds (Bulldogs, French Bulldogs) have serious health issues in heat and humidity.</p>',
    featured_image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&q=85&auto=format&fit=crop',
    category: 'Breeds', author: 'PetopiaCare Experts', read_time_minutes: 7, status: 'published',
    seo_title: 'Dog Breed Guide India | Best Breeds for Indian Families',
    seo_description: 'Explore the best dog breeds for Indian homes, including family-friendly, apartment-suitable, and climate-adapted options.',
    seo_keywords: 'dog breed guide india, best pets india, family dog breeds, apartment dog india',
  },
  {
    title: 'Natural Dog Treats You Can Make at Home',
    slug: 'natural-dog-treats-at-home',
    excerpt: 'Create healthy dog treats with simple ingredients and avoid processed snacks with this easy homemade recipe guide.',
    content: '<h2>Why make your own treats?</h2><p>Commercial dog treats in India often contain preservatives, artificial colours, and high salt content. Homemade treats let you control every ingredient and are significantly cheaper — a month\'s supply costs ₹200-400 versus ₹800-1500 for premium store treats.</p><h2>Recipe 1: Chicken & Sweet Potato Bites</h2><p>Boil 200g chicken (no salt). Boil 100g sweet potato until soft. Mash sweet potato, shred chicken, combine. Form into small balls. Bake at 160°C for 20 minutes until firm. Store refrigerated for up to a week.</p><h2>Recipe 2: Peanut Butter & Banana Drops</h2><p>Mash 1 ripe banana. Mix with 2 tbsp unsweetened peanut butter (check no xylitol in the ingredients). Add 100g whole wheat flour or oat flour. Roll into small balls. Bake at 180°C for 15 minutes. These keep for 5 days in an airtight container.</p><h2>Recipe 3: Carrot & Egg Crunchers</h2><p>Grate 2 carrots. Beat 2 eggs. Mix with 150g oat flour and 1 tbsp coconut oil. Flatten on a baking sheet, score into pieces. Bake at 170°C for 25 minutes. Breaks apart into bite-sized pieces after cooling.</p><h2>Important safety notes</h2><p>Never include onion, garlic, raisins, grapes, chocolate, xylitol, or macadamia nuts. Keep portions small — treats should be no more than 10% of daily calorie intake.</p>',
    featured_image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=1600&q=85&auto=format&fit=crop',
    category: 'Nutrition', author: 'PetopiaCare Experts', read_time_minutes: 5, status: 'published',
    seo_title: 'Natural Dog Treats at Home | Healthy Pet Recipes India',
    seo_description: 'Make healthy, homemade dog treats using natural ingredients and simple recipes for training rewards.',
    seo_keywords: 'homemade dog treats, natural dog snacks, dog recipe india, healthy pet food',
  },
  {
    title: 'Building a Dog-Friendly Home in India',
    slug: 'building-dog-friendly-home-india',
    excerpt: 'Make your home safe and comfortable for dogs with smart layout, storage, and care zones.',
    content: '<h2>Designate specific zones</h2><p>Dogs thrive with structure. A defined feeding area (away from foot traffic), a specific sleeping spot, and a clear play zone help dogs understand where different activities happen and reduce anxiety.</p><h2>Flooring and surfaces</h2><p>Polished marble and granite floors — common in Indian homes — are slippery and can cause joint injuries over time, especially in large breeds. Place non-slip mats in your dog\'s movement paths. Removable rugs with non-slip backing are excellent for high-traffic areas.</p><h2>Safety checklist</h2><ul><li>Secure balconies with mesh or grille — even large dogs can squeeze through or fall</li><li>Store cleaning products, medicines, and cosmetics in locked or high cabinets</li><li>Cable management to prevent chewing electrical cables</li><li>Check that houseplants are non-toxic (Pothos, Lilies, and Aloe are toxic to dogs)</li><li>Secure bins with lids — Indian kitchen waste contains onion and garlic scraps that are toxic</li></ul><h2>Hot season setup</h2><p>Ensure at least one room stays below 26°C during peak summer. Provide a cool tile area for resting. Multiple water bowls throughout the home prevent dehydration during hot months.</p>',
    featured_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=85&auto=format&fit=crop',
    category: 'Lifestyle', author: 'PetopiaCare Experts', read_time_minutes: 5, status: 'published',
    seo_title: 'Build a Dog-Friendly Home India | Pet Safe Design Tips',
    seo_description: 'Create a dog-friendly home with safe zones, easy-clean materials, and pet storage solutions for Indian homes.',
    seo_keywords: 'dog friendly home india, pet home design, dog care space, pet safety india',
  },
  {
    title: 'How to Manage Dog Anxiety with Routine and Comfort',
    slug: 'manage-dog-anxiety',
    excerpt: 'Help anxious dogs feel calm with routine, mental stimulation, and gentle behavior support.',
    content: '<h2>Understanding dog anxiety</h2><p>Anxiety in dogs shows as pacing, whining, excessive barking, destructive behaviour, house soiling despite being trained, and clinginess. In India, common triggers include Diwali fireworks (the most significant annual anxiety event), thunderstorms during monsoon, and separation from owners.</p><h2>The power of routine</h2><p>Dogs with anxiety benefit enormously from a predictable daily schedule. Same wake-up time, same walk time, same feeding time. Predictability reduces the vigilance state that anxious dogs maintain — they can relax when they know what comes next.</p><h2>Fireworks protocol</h2><p>During Diwali: Close all windows and play white noise or calming music. Create a safe space — a crate or a wardrobe-nook with familiar bedding. Stay home if possible. Never force the dog outside to "get used to it." Discuss anti-anxiety medication with your vet before Diwali season if your dog has severe reactions.</p><h2>Separation anxiety</h2><p>Start with very short departures — 5 minutes — and gradually increase. Never make arrivals and departures dramatic. A food puzzle or Kong filled with peanut butter given only during departures creates a positive association with being alone.</p><h2>When to see a vet</h2><p>If anxiety is severe, self-harming, or doesn\'t respond to routine changes, consult a vet or veterinary behaviourist. Anti-anxiety medications combined with behaviour modification are effective and not harmful when used appropriately.</p>',
    featured_image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1600&q=85&auto=format&fit=crop',
    category: 'Training', author: 'PetopiaCare Experts', read_time_minutes: 6, status: 'published',
    seo_title: 'Manage Dog Anxiety | Calm Pet Behavior Tips India',
    seo_description: 'Reduce dog anxiety with routine, calming strategies, and behaviour support — including Diwali fireworks protocol.',
    seo_keywords: 'dog anxiety india, dog fireworks diwali, separation anxiety dog, calm dog tips',
  },
  {
    title: 'Benefits of Regular Dog Exercise for Indian Pets',
    slug: 'benefits-regular-dog-exercise',
    excerpt: "Discover how daily movement improves your dog's health, mood, and behavior in Indian climates.",
    content: '<h2>Exercise is medicine</h2><p>Under-exercised dogs develop behavioural problems: destructive chewing, excessive barking, hyperactivity, and anxiety. This is not a discipline problem — it is an unmet physical need. Regular exercise is the single most effective intervention for most common behaviour issues in pet dogs.</p><h2>How much is enough?</h2><ul><li><strong>High-energy breeds</strong> (Labrador, GSD, Husky): 90-120 minutes daily</li><li><strong>Medium-energy breeds</strong> (Beagle, Pomeranian, Spitz): 45-60 minutes daily</li><li><strong>Low-energy breeds</strong> (Pug, Shih Tzu, senior dogs): 30 minutes daily</li><li><strong>Indian Pariah Dog</strong>: 45-60 minutes; self-regulates well</li></ul><h2>Safe exercise in Indian conditions</h2><p>Walk before 8 AM and after 7 PM in summer. Concrete and tar road surfaces reach 60-70°C in afternoon sun — paw burns are a real risk. Carry water on any walk longer than 20 minutes. In monsoon, keep sessions shorter and check for ticks immediately after each walk.</p><h2>Mental exercise counts too</h2><p>Physical exercise and mental exercise are both needed. A 15-minute training session is as tiring as a 30-minute walk. Puzzle feeders, scent games (hiding treats around the home), and learning new commands all reduce the total physical exercise needed.</p>',
    featured_image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1600&q=85&auto=format&fit=crop',
    category: 'Health', author: 'PetopiaCare Experts', read_time_minutes: 6, status: 'published',
    seo_title: 'Regular Dog Exercise Benefits | Healthy Dog Lifestyle India',
    seo_description: 'Learn the benefits of regular dog exercise with safe routines for Indian climate and breed-specific guidance.',
    seo_keywords: 'dog exercise india, pet fitness, dog health india, active dog tips',
  },
  {
    title: 'Dog Safety Tips for Urban Living in India',
    slug: 'dog-safety-urban-indirapuram',
    excerpt: 'Protect your dog in city life with leash safety, traffic awareness, and secure balcony habits.',
    content: '<h2>Road and traffic safety</h2><p>Urban India presents specific dangers: erratic traffic, stray dogs in packs, open drains, construction debris, and discarded food. Always use a leash in the city — even the most obedient dog can bolt when startled. A 4-6 foot leash gives control without restricting movement.</p><h2>Balcony and terrace safety</h2><p>Dogs can squeeze through surprisingly narrow gaps and fall from unexpected heights. If your dog has access to a balcony, install mesh or a grille that covers the full opening. Check regularly for gaps at the bottom of railings — this is where dogs explore most.</p><h2>Night walks</h2><p>Attach a small LED light to your dog\'s collar for visibility on unlit streets. Avoid walking near construction sites at night — stray dogs defend these territories aggressively. Bring a torch and be aware of other stray dog packs in your neighbourhood — know their usual locations.</p><h2>Identity and microchipping</h2><p>City dogs can get lost easily. Ensure your dog always wears a collar with your mobile number. Microchipping is a permanent ID that cannot be removed — available from most vet clinics for ₹500-800. Register the chip with the national database. Take updated photographs monthly in case you need to file a missing report.</p>',
    featured_image: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=1600&q=85&auto=format&fit=crop',
    category: 'Health', author: 'PetopiaCare Experts', read_time_minutes: 5, status: 'published',
    seo_title: 'Dog Safety Urban India | City Pet Care Tips',
    seo_description: 'Urban dog safety guide for Indian cities — leash rules, balcony safety, night walks, and identification tips.',
    seo_keywords: 'dog safety india, urban pet tips, city dog care, leash safety india',
  },
  {
    title: 'Choosing the Right Dog Bed for Comfort and Support',
    slug: 'choosing-right-dog-bed',
    excerpt: 'Find the most comfortable dog bed for your pet, whether they prefer orthopaedic support or cozy nesting style.',
    content: '<h2>Why dog beds matter</h2><p>Dogs sleep 12-14 hours per day. A poorly designed sleeping surface contributes to joint problems, pressure sores, and poor sleep quality over time. This is especially important for large breeds in India where hip dysplasia is common, and for any dog over 5 years old.</p><h2>Types of dog beds</h2><ul><li><strong>Orthopaedic/Memory foam</strong>: Best for senior dogs, large breeds, and dogs with joint issues. Supports the body evenly and reduces pressure points.</li><li><strong>Bolster/Donut beds</strong>: Great for dogs that like to curl up against something. The raised edge provides a sense of security.</li><li><strong>Flat mat</strong>: Works for young, healthy dogs that prefer to stretch out. Easy to wash.</li><li><strong>Elevated/Cot bed</strong>: Excellent for Indian conditions — keeps the dog off hot or cold floors, improves airflow, reduces moisture build-up.</li></ul><h2>What to look for in Indian conditions</h2><p>Prioritise washability — monsoon and shedding seasons mean frequent washing. Look for quick-dry materials. Avoid beds with internal zippers that dogs can access and swallow. Non-slip base is essential on Indian marble and tile floors.</p><h2>Sizing guide</h2><p>The bed should be at least 10cm longer than your dog from nose to tail tip. If your dog stretches out when sleeping, err on the larger side. For puppies, buy the size they will need as adults — they will grow into it.</p>',
    featured_image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=1600&q=85&auto=format&fit=crop',
    category: 'Products', author: 'PetopiaCare Experts', read_time_minutes: 5, status: 'published',
    seo_title: 'Best Dog Bed Guide India | Comfort & Support for Dogs',
    seo_description: 'Choose the right dog bed for Indian conditions — orthopaedic, elevated, or bolster — with sizing and care tips.',
    seo_keywords: 'dog bed india, comfortable dog bed, pet bedding india, orthopaedic dog bed',
  },
  {
    title: 'Allergy Care for Dogs in India: Seasonal Grooming Tips',
    slug: 'allergy-care-dogs-india',
    excerpt: 'Manage dog allergies with seasonal grooming, diet changes, and home-cleaning routines.',
    content: '<h2>Types of allergies in Indian dogs</h2><p>The three most common are: environmental allergies (pollen, dust, mould — worse in spring and post-monsoon), food allergies (chicken and wheat are the most common culprits in Indian dogs), and contact allergies (certain shampoos, fabrics, or cleaning products).</p><h2>Recognising allergy signs</h2><ul><li>Constant licking of paws — a classic allergy symptom</li><li>Repeated ear infections</li><li>Red, inflamed skin particularly in armpits, groin, and between toes</li><li>Watery eyes or sneezing</li><li>Hot spots — painful, moist skin lesions</li></ul><h2>Environmental allergy management</h2><p>Wipe your dog\'s paws and belly after outdoor walks during high pollen seasons (February-April and October-November in North India). Change bedding weekly. Use an air purifier if possible. Bathe weekly with hypoallergenic shampoo during flare-ups.</p><h2>Food allergy elimination diet</h2><p>If food allergy is suspected, your vet may recommend an elimination diet: switching to a novel protein (one the dog has never eaten — often fish or rabbit) for 8-12 weeks to identify the trigger. Do not introduce new foods during this period.</p><h2>When to see a vet</h2><p>Allergies that cause constant discomfort, secondary infections, or aren\'t managed by home care need veterinary attention. Antihistamines, steroids, and newer immunotherapy options are available. Never give human antihistamines without vet guidance — dosing differs significantly.</p>',
    featured_image: 'https://images.unsplash.com/photo-1625213327543-b24c2fc0d6ee?w=1600&q=85&auto=format&fit=crop',
    category: 'Health', author: 'PetopiaCare Experts', read_time_minutes: 6, status: 'published',
    seo_title: 'Dog Allergy Care India | Seasonal Grooming & Diet Tips',
    seo_description: 'Manage dog allergies in India with seasonal grooming, elimination diet guidance, and home care strategies.',
    seo_keywords: 'dog allergies india, seasonal pet care, allergy grooming dog, dog food allergy india',
  },
];

const CREATE_TABLE_SQL = `CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt VARCHAR(500),
  content TEXT NOT NULL,
  featured_image VARCHAR(500),
  category VARCHAR(50),
  author VARCHAR(100) DEFAULT 'PetopiaCare',
  read_time_minutes INT,
  status VARCHAR(20) DEFAULT 'published',
  seo_title VARCHAR(60),
  seo_description VARCHAR(160),
  seo_keywords VARCHAR(200),
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`;

const PROJECT_REF = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '').split('.')[0]
  : '';
const SUPABASE_EDITOR_URL = `https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`;

export default function SeedBlogPage() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tableExists, setTableExists] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [seededCount, setSeededCount] = useState(0);

  useEffect(() => {
    checkTable();
  }, []);

  const checkTable = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/admin/check-blog-table');
      const data = await res.json();
      setTableExists(data.exists);
    } catch {
      setTableExists(false);
    } finally {
      setChecking(false);
    }
  };

  const copySQL = async () => {
    await navigator.clipboard.writeText(CREATE_TABLE_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSeed = async () => {
    setLoading(true);
    setMessage(null);
    setSeededCount(0);

    try {
      const res = await fetch('/api/admin/seed-blogs', { method: 'POST' });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? 'Import failed');
      const count = data.count ?? staticPosts.length;
      setSeededCount(count);
      setMessage({ type: 'success', text: `✓ ${count} posts imported — all are now editable in the admin panel.` });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to import posts.' });
    } finally {
      setLoading(false);
    }
  };

  const richCount = staticPosts.filter(p => !!BLOG_CONTENT[p.slug]).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/admin/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors">
          <ArrowLeft size={16} /> Back to Blog Dashboard
        </Link>

        <div className="bg-[#1A7D80] text-white p-8 rounded-3xl">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-cyan-100 mb-2">Admin — Blog Setup</p>
          <h1 className="text-3xl font-bold">Import All {staticPosts.length} Posts into Supabase</h1>
          <p className="mt-2 text-cyan-100/90 text-sm max-w-xl">
            First create the database table (Step 1), then import all posts (Step 2). Each step takes under 30 seconds.
          </p>
        </div>

        {/* ── STEP 1: Create Table ── */}
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
            <span className="w-7 h-7 rounded-full bg-[#1A7D80] text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
            <h2 className="font-bold text-gray-900">Create the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">blog_posts</code> table in Supabase</h2>
            <span className="ml-auto text-xs text-gray-400">Skip if already done</span>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              Copy the SQL below, open the Supabase SQL Editor, paste it and click <strong>Run</strong>.
            </p>

            {/* SQL block — always visible */}
            <div className="relative">
              <pre className="bg-gray-900 text-green-300 text-xs leading-relaxed p-5 rounded-2xl overflow-x-auto font-mono whitespace-pre-wrap">
{CREATE_TABLE_SQL}
              </pre>
              <button
                onClick={copySQL}
                className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-white/20"
              >
                {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy SQL</>}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copySQL}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy SQL</>}
              </button>
              <a
                href={SUPABASE_EDITOR_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#1A7D80] hover:bg-[#16625f] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                <ExternalLink size={14} /> Open Supabase SQL Editor
              </a>
            </div>
          </div>
        </div>

        {/* ── STEP 2: Seed Posts ── */}
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
            <span className="w-7 h-7 rounded-full bg-[#1A7D80] text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
            <h2 className="font-bold text-gray-900">Import all {staticPosts.length} posts</h2>
            <div className="ml-auto flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> {richCount} rich</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> {staticPosts.length - richCount} standard</span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {message && (
              <div className={`rounded-2xl border p-4 text-sm font-medium flex items-start gap-3 ${
                message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {message.type === 'success' ? <Check size={15} className="shrink-0 mt-0.5" /> : <AlertCircle size={15} className="shrink-0 mt-0.5" />}
                <span className="flex-1">{message.text}</span>
                {message.type === 'success' && (
                  <Link href="/admin/blog" className="shrink-0 underline font-bold whitespace-nowrap">View Dashboard →</Link>
                )}
              </div>
            )}

            {message?.type !== 'success' && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 flex gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                Re-seeding overwrites posts with the same slug. Skip if you&apos;ve already edited posts in the admin.
              </div>
            )}

            <button
              onClick={handleSeed}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#1A7D80] px-6 py-4 text-sm font-bold text-white shadow-md transition hover:bg-[#16625f] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {loading
                ? <span className="animate-pulse">Importing {staticPosts.length} posts...</span>
                : <><Sparkles size={16} /> Import All {staticPosts.length} Posts</>
              }
            </button>

            {/* Post list */}
            <div className="grid gap-2 sm:grid-cols-2 pt-2">
              {staticPosts.map((post) => {
                const hasRich = !!BLOG_CONTENT[post.slug];
                return (
                  <div key={post.slug} className="rounded-xl border border-gray-100 bg-gray-50 p-3 flex items-start gap-2.5">
                    <div className={`shrink-0 w-2 h-2 rounded-full mt-1.5 ${hasRich ? 'bg-green-500' : 'bg-blue-400'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900 leading-snug">{post.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{post.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
