'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Sparkles } from 'lucide-react';

const seedPosts = [
  {
    title: 'Homemade Dog Food Recipe for Indian Dogs (Budget-Friendly & Healthy)',
    slug: 'homemade-dog-food-recipe-indian-dogs',
    excerpt: 'Learn how to make nutritious, budget-friendly dog food at home. Step-by-step recipes perfect for Indian dog breeds. Safe ingredients, cost-effective, and loved by dogs.',
    content: '<h2>Introduction</h2><p>Your dog deserves healthy, nutritious food. Many Indian pet parents worry about commercial dog food quality or budget constraints. This guide shows you how to prepare homemade dog food that\'s healthier, cheaper, and just as nutritious.</p><h2>Why Homemade Dog Food?</h2><p>Homemade dog food gives you full control over ingredients, avoids preservatives and fillers, and can cost only ₹30-50 a day compared to ₹100-200 for premium brands. It is perfect for the Indian climate and especially helpful for dogs with allergies.</p><h2>Recipe 1: Basic Chicken & Rice</h2><p>Ingredients: 2 cups cooked chicken (boiled, no salt), 1 cup cooked brown rice, 1/2 cup cooked vegetables (carrots, beans, peas), 1 tbsp coconut oil, 1/2 tsp turmeric, pinch of salt.</p><p>Instructions: Boil chicken until tender, cook brown rice separately, boil vegetables until soft, mix all ingredients, store in refrigerator for 3-4 days, and serve at room temperature.</p><p>Nutritional benefits: protein from chicken, carbs from brown rice, fiber from vegetables, immunity support from turmeric.</p><h2>Recipe 2: Beef & Veggie Mix</h2><p>Ingredients: 2 cups cooked lean beef, 1 cup cooked rice or millet, 1/2 cup cooked vegetables, 1 tbsp ghee or coconut oil, 1/2 tsp turmeric, pinch of salt.</p><p>Instructions: Boil beef until fully cooked, prepare the grain separately, steam vegetables until soft, mix everything, keep refrigerated for 3-4 days, and serve warm.</p><p>Beef provides rich protein, grains offer energy, vegetables add fiber, and turmeric supports immunity.</p><h2>Common Mistakes to Avoid</h2><p>Do not use onions or garlic, which are toxic to dogs. Avoid oversalting, uncooked vegetables, and spices other than turmeric. Never add chocolate, grapes, or avocado. Keep portion sizes balanced and change recipes gradually.</p><h2>Cost Breakdown</h2><p>Chicken costs about ₹150/kg or ₹25/day, rice costs ₹40/kg or ₹2/day, vegetables cost about ₹50 total or ₹3/day, and oil plus turmeric add about ₹2/day. Total cost is roughly ₹32/day versus ₹150+ for commercial options.</p><h2>FAQ</h2><p>Q: Can I use bones? A: Remove all bones. Cooked bones can splinter. Q: How often should I change recipes? A: Rotate every 2-3 weeks. Q: What about puppies? A: Serve smaller portions more frequently with puppy-safe nutrition.</p>',
    featured_image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80',
    category: 'Nutrition',
    author: 'PetopiaCare Experts',
    read_time_minutes: 8,
    status: 'published',
    seo_title: 'Homemade Dog Food Recipe for Indian Dogs (Budget & Healthy)',
    seo_description: 'Step-by-step homemade dog food recipes for Indian dogs. Budget-friendly, healthy ingredients. Save ₹100+ monthly vs commercial brands.',
    seo_keywords: 'homemade dog food recipe, dog food recipes india, budget dog food, healthy dog food, homemade dog food for indian dogs',
    date: 'Apr 06, 2026',
  },
  {
    title: 'Best Dog Food Brands in India for 2026',
    slug: 'best-dog-food-brands-india',
    excerpt: 'Find India’s top dog food brands, nutrition ratings, and matching recipes for every breed and budget.',
    content: '<h2>Choose nutrition that fits your dog</h2><p>When selecting dog food in India, focus on locally available brands with clear protein sources, balanced fats, and added vitamins.</p><h3>Top considerations</h3><ul><li>Age-specific formulas for puppies, adults, and seniors.</li><li>High-quality protein from chicken, fish, or lamb.</li><li>Easy digestion for Indian weather and humidity.</li></ul><p>Mix dry kibble with fresh veggies or home-cooked options to keep your dog excited at meal time.</p>',
    featured_image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80',
    category: 'Nutrition',
    author: 'PetopiaCare Experts',
    read_time_minutes: 5,
    status: 'published',
    seo_title: 'Best Dog Food Brands in India | 2026 Pet Nutrition Guide',
    seo_description: 'Discover top dog food brands in India for 2026, with nutrition tips, price comparisons, and feeding advice for every breed.',
    seo_keywords: 'dog food india, best dog food, dog nutrition, pet food brands',
    date: 'Apr 01, 2026',
  },
  {
    title: 'Stop Dog Pulling on Leash: Training Tips That Work',
    slug: 'stop-dog-pulling-on-leash',
    excerpt: 'Turn daily walks into a calm experience with proven leash training techniques for Indian dogs.',
    content: '<h2>Why dogs pull</h2><p>Most dogs pull because the walk is too exciting and they want to explore faster than their owner.</p><h3>Try these steps</h3><ul><li>Start with short indoor sessions.</li><li>Reward the dog for walking beside you.</li><li>Use a comfortable harness and consistent verbal cues.</li></ul><p>Patience and consistency are the keys to a stress-free walk.</p>',
    featured_image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80',
    category: 'Training',
    author: 'PetopiaCare Experts',
    read_time_minutes: 4,
    status: 'published',
    seo_title: 'How to Stop Dog Pulling on Leash | Training Guide',
    seo_description: 'Learn leash training tips to stop your dog from pulling, with step-by-step guidance for Indian pet parents.',
    seo_keywords: 'dog pulling leash, leash training, dog walking tips, pet training india',
    date: 'Mar 28, 2026',
  },
  {
    title: 'Summer Dog Care in India: Hydration & Heat Safety',
    slug: 'summer-dog-care-india',
    excerpt: 'Keep your dog cool and safe during India’s hot months with hydration, grooming, and sun protection advice.',
    content: '<h2>Recognize heat stress early</h2><p>Signs include heavy panting, drooling, and lethargy. Move your dog to shade immediately if you notice these symptoms.</p><h3>Summer care essentials</h3><ul><li>Fresh water at all times.</li><li>Light grooming and short walks during cooler hours.</li><li>Shaded resting spots and cooling mats.</li></ul><p>Simplicity and consistent care help your dog enjoy summer comfortably.</p>',
    featured_image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80',
    category: 'Health',
    author: 'Dr. Sharma',
    read_time_minutes: 6,
    status: 'published',
    seo_title: 'Summer Dog Care India | Hydration & Heat Safety Tips',
    seo_description: 'Protect your dog from Indian summer heat with hydration tips, grooming advice, and sun safety strategies.',
    seo_keywords: 'summer dog care, heat safety for dogs, hydration tips, Indian pet care',
    date: 'Mar 20, 2026',
  },
  {
    title: 'Choosing a Safe Dog Harness for Every Breed',
    slug: 'choosing-safe-dog-harness',
    excerpt: 'Find the best dog harness for comfort, control, and safety across small, medium, and large breeds.',
    content: '<h2>Why a good harness matters</h2><p>The right harness protects your dog&apos;s neck and provides better control without restricting movement.</p><h3>What to look for</h3><ul><li>Soft padded straps that do not rub.</li><li>Adjustable fit for chest and shoulders.</li><li>Strong buckles and D-ring support.</li></ul><p>Choose a harness designed for your dog&apos;s size, shape and activity level for happier walks.</p>',
    featured_image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80',
    category: 'Products',
    author: 'PetopiaCare Experts',
    read_time_minutes: 5,
    status: 'published',
    seo_title: 'Safe Dog Harness Guide | Best Harnesses for Dogs',
    seo_description: 'Discover how to choose the safest dog harness for your pet, with tips for fit, design, and breed-specific comfort.',
    seo_keywords: 'dog harness india, safe harness, dog walking gear, pet products',
    date: 'Mar 14, 2026',
  },
  {
    title: 'Grooming Tips for Indian Dogs: Coat, Nails, and Skin',
    slug: 'grooming-tips-indian-dogs',
    excerpt: 'Keep your dog looking healthy and comfortable with the right bathing, brushing, and nail care routine.',
    content: '<h2>Daily grooming habits</h2><p>Regular brushing removes loose fur, reduces matting, and improves skin health.</p><h3>Focus areas</h3><ul><li>Brush weekly for medium and long coats.</li><li>Trim nails safely with a guided clipper.</li><li>Check ears and teeth during grooming sessions.</li></ul><p>Consistent grooming helps your dog feel fresh and prevents common skin problems.</p>',
    featured_image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&q=80',
    category: 'Grooming',
    author: 'PetopiaCare Experts',
    read_time_minutes: 5,
    status: 'published',
    seo_title: 'Indian Dog Grooming Tips | Coat, Nails & Skin Care',
    seo_description: 'Master dog grooming in India with expert tips for coat care, nail trimming, and skin health.',
    seo_keywords: 'dog grooming india, pet grooming tips, dog skin care, nail trimming',
    date: 'Mar 10, 2026',
  },
  {
    title: 'Puppy Training Basics Every New Owner Needs',
    slug: 'puppy-training-basics',
    excerpt: 'Start your puppy right with easy-to-follow house training, socialization, and reward-based techniques.',
    content: '<h2>Start early with consistency</h2><p>Puppies learn best through repetition, calm guidance, and positive reinforcement.</p><h3>Essential puppy training steps</h3><ul><li>Use a clear potty schedule.</li><li>Practice simple commands like sit and stay.</li><li>Socialize with people and other dogs gently.</li></ul><p>Small daily wins build confidence and create a happy home for your puppy.</p>',
    featured_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
    category: 'Training',
    author: 'PetopiaCare Experts',
    read_time_minutes: 5,
    status: 'published',
    seo_title: 'Puppy Training Basics | New Dog Owner Guide',
    seo_description: 'Learn puppy training basics for Indian homes, including house training, socialization, and gentle rewards.',
    seo_keywords: 'puppy training, new dog owner, dog socialization, positive reinforcement',
    date: 'Mar 05, 2026',
  },
  {
    title: 'Common Dog Health Issues and When to See a Vet',
    slug: 'common-dog-health-issues',
    excerpt: 'Recognize early signs of infection, allergies, and joint pain so you can act before problems worsen.',
    content: '<h2>Watch for warning signs</h2><p>Symptoms like frequent scratching, limping, or appetite loss may indicate a health issue.</p><h3>Common concerns in Indian dogs</h3><ul><li>Skin allergies and flea irritation.</li><li>Digestive upset from diet changes.</li><li>Heat-related fatigue and dehydration.</li></ul><p>Early vet consultation prevents small problems from becoming emergencies.</p>',
    featured_image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=800&q=80',
    category: 'Health',
    author: 'Dr. Sharma',
    read_time_minutes: 6,
    status: 'published',
    seo_title: 'Common Dog Health Issues | Vet Advice for Indian Pets',
    seo_description: 'Identify common dog health issues early and learn when to seek veterinary care for your pet.',
    seo_keywords: 'dog health issues, vet advice, pet illness signs, dog allergies',
    date: 'Feb 28, 2026',
  },
  {
    title: 'Dog Dental Care Guide: Healthy Teeth for Happy Dogs',
    slug: 'dog-dental-care-guide',
    excerpt: 'Healthy teeth keep your dog smiling. Learn daily brushing, teething, and dental treat routines.',
    content: '<h2>Why dental care matters</h2><p>Poor oral hygiene can lead to bad breath, gum disease, and more serious infections.</p><h3>Simple daily habits</h3><ul><li>Brush with dog-safe toothpaste.</li><li>Offer dental chews and crunchy treats.</li><li>Schedule regular vet check-ups.</li></ul><p>Healthy dental habits improve overall well-being and eating comfort.</p>',
    featured_image: 'https://images.unsplash.com/photo-1517423440428-7a9ea5a07f7f?w=800&q=80',
    category: 'Health',
    author: 'PetopiaCare Experts',
    read_time_minutes: 5,
    status: 'published',
    seo_title: 'Dog Dental Care Guide | Healthy Teeth for Dogs',
    seo_description: 'Keep your dog&apos;s teeth clean with practical dental care tips, brushing routines, and preventive habits.',
    seo_keywords: 'dog dental care, dog teeth cleaning, pet oral hygiene, dental chews',
    date: 'Feb 22, 2026',
  },
  {
    title: 'Traveling with Your Dog in India: Planning, Safety, and Comfort',
    slug: 'traveling-with-dog-india',
    excerpt: 'Make dog travel easy with packing lists, transport tips, and destination advice for Indian pet families.',
    content: '<h2>Travel smart with your dog</h2><p>Choose pet-friendly transportation and plan for food, water, and potty breaks.</p><h3>Must-pack essentials</h3><ul><li>Collapsible bowls and fresh water.</li><li>Comfortable collar and leash.</li><li>Health records and vaccination proofs.</li></ul><p>With preparation, travel becomes a rewarding adventure for your dog and family.</p>',
    featured_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    category: 'Lifestyle',
    author: 'PetopiaCare Experts',
    read_time_minutes: 6,
    status: 'published',
    seo_title: 'Traveling with Dogs in India | Pet Travel Tips',
    seo_description: 'Prepare for safe and comfortable dog travel in India with packing tips, transport advice, and destination planning.',
    seo_keywords: 'traveling with dog, pet travel india, dog safety travel, dog travel essentials',
    date: 'Feb 15, 2026',
  },
  {
    title: 'Introducing a New Puppy to Your Home',
    slug: 'introducing-new-puppy',
    excerpt: 'Bring home your puppy with confidence using preparation tips for sleeping, feeding, and family introduction.',
    content: '<h2>Welcome your new family member</h2><p>Set up a calm space with a cozy bed, toys, and a feeding station before the puppy arrives.</p><h3>First week priorities</h3><ul><li>Maintain a consistent feeding schedule.</li><li>Provide gentle social exposure.</li><li>Reward quiet, confident behavior.</li></ul><p>A calm and structured environment helps puppies settle quickly.</p>',
    featured_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
    category: 'Lifestyle',
    author: 'PetopiaCare Experts',
    read_time_minutes: 5,
    status: 'published',
    seo_title: 'Introducing a New Puppy | Home Preparation Guide',
    seo_description: 'Learn how to welcome a new puppy with the right setup, feeding routine, and social introduction.',
    seo_keywords: 'new puppy guide, puppy introduction, dog home setup, puppy care',
    date: 'Feb 08, 2026',
  },
  {
    title: 'Rainy Season Dog Care: Waterproof Gear & Clean Paws',
    slug: 'rainy-season-dog-care',
    excerpt: 'Keep your dog dry, clean, and comfortable during monsoon with easy grooming and rain-ready gear.',
    content: '<h2>Monsoon dog care essentials</h2><p>Wet weather can lead to muddy paws, damp fur, and skin irritation if not managed properly.</p><h3>Best rainy season routines</h3><ul><li>Dry paws after every walk.</li><li>Use lightweight raincoats and quick-dry blankets.</li><li>Brush fur gently to remove debris.</li></ul><p>Good wet-weather care keeps your dog healthy throughout the monsoon.</p>',
    featured_image: 'https://images.unsplash.com/photo-1537151608804-ea6f25dc1005?w=800&q=80',
    category: 'Health',
    author: 'PetopiaCare Experts',
    read_time_minutes: 5,
    status: 'published',
    seo_title: 'Rainy Season Dog Care | Monsoon Pet Tips',
    seo_description: 'Manage monsoon pet care with rain-ready gear, paw cleaning tips, and skin protection for dogs.',
    seo_keywords: 'rainy season dog care, monsoon pet care, dog paw cleaning, waterproof dog gear',
    date: 'Feb 01, 2026',
  },
  {
    title: 'Senior Dog Care Tips: Comfort, Diet, and Gentle Exercise',
    slug: 'senior-dog-care-tips',
    excerpt: 'Support your aging dog with softer diets, joint-friendly exercise, and comfort-focused home changes.',
    content: '<h2>Adjust care for senior dogs</h2><p>Older dogs benefit from softer food, low-impact activity, and warm resting spots.</p><h3>Senior-friendly changes</h3><ul><li>Switch to senior-specific nutrition.</li><li>Use supportive beds and easy ramps.</li><li>Monitor mobility and joint comfort daily.</li></ul><p>Small adjustments add years of wellness and happiness to your dog&apos;s life.</p>',
    featured_image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80',
    category: 'Health',
    author: 'PetopiaCare Experts',
    read_time_minutes: 5,
    status: 'published',
    seo_title: 'Senior Dog Care Tips | Comfort & Nutrition',
    seo_description: 'Care for senior dogs with diet changes, gentle exercise, and supportive home adjustments.',
    seo_keywords: 'senior dog care, older dog tips, dog joint care, senior pet nutrition',
    date: 'Jan 25, 2026',
  },
  {
    title: 'A Practical Dog Breed Guide for Indian Families',
    slug: 'dog-breed-guide-indian-families',
    excerpt: 'Choose the right dog breed for your lifestyle with this Indian-friendly breed guide and care comparison.',
    content: '<h2>Find the right breed</h2><p>Matching a dog breed with your home, activity level, and family is the first step to long-term happiness.</p><h3>Popular Indian choices</h3><ul><li>Indian Spitz: loyal, adaptable, low maintenance.</li><li>Labrador Retriever: playful, family-friendly, active.</li><li>Pug: compact, affectionate, indoor-friendly.</li></ul><p>Consider each breed&apos;s needs before bringing a new dog home.</p>',
    featured_image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80',
    category: 'Breed Guide',
    author: 'PetopiaCare Experts',
    read_time_minutes: 6,
    status: 'published',
    seo_title: 'Dog Breed Guide India | Best Breeds for Families',
    seo_description: 'Explore the best dog breeds for Indian homes, including family-friendly, low-maintenance, and active options.',
    seo_keywords: 'dog breed guide, indian dog breeds, best pets india, family dog breeds',
    date: 'Jan 18, 2026',
  },
  {
    title: 'Natural Dog Treats You Can Make at Home',
    slug: 'natural-dog-treats-at-home',
    excerpt: 'Create healthy dog treats with simple ingredients and avoid processed snacks with this easy homemade recipe guide.',
    content: '<h2>Homemade treats are healthier</h2><p>DIY dog treats let you control the ingredients and avoid preservatives and fillers.</p><h3>Recipe ideas</h3><ul><li>Peanut butter banana bites</li><li>Sweet potato chips</li><li>Chicken and carrot cubes</li></ul><p>These simple treats are nutritious, delicious, and perfect for training rewards.</p>',
    featured_image: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?w=800&q=80',
    category: 'Nutrition',
    author: 'PetopiaCare Experts',
    read_time_minutes: 5,
    status: 'published',
    seo_title: 'Natural Dog Treats at Home | Healthy Pet Recipes',
    seo_description: 'Make healthy, homemade dog treats using natural ingredients and simple recipes for rewarding snacks.',
    seo_keywords: 'homemade dog treats, natural dog snacks, dog recipe india, healthy pet food',
    date: 'Jan 10, 2026',
  },
  {
    title: 'Building a Dog-Friendly Home in India',
    slug: 'building-dog-friendly-home-india',
    excerpt: 'Make your home safe and comfortable for dogs with smart layout, storage, and care zones.',
    content: '<h2>Small changes make a big difference</h2><p>Designate a feeding area, a cozy bed corner, and an easy-clean play zone.</p><h3>Home setup tips</h3><ul><li>Choose washable floor mats and removable bed covers.</li><li>Use secure gates to block off sensitive areas.</li><li>Store toys and food in labeled bins.</li></ul><p>Dog-friendly design helps pets feel at home while keeping your space organized.</p>',
    featured_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    category: 'Lifestyle',
    author: 'PetopiaCare Experts',
    read_time_minutes: 5,
    status: 'published',
    seo_title: 'Build a Dog-Friendly Home in India | Pet Safe Design',
    seo_description: 'Learn how to create a dog-friendly home with safe zones, easy-clean materials, and pet storage solutions.',
    seo_keywords: 'dog friendly home, pet home design, dog care space, pet friendly india',
    date: 'Jan 03, 2026',
  },
  {
    title: 'How to Manage Dog Anxiety with Routine and Comfort',
    slug: 'manage-dog-anxiety',
    excerpt: 'Help anxious dogs feel calm with routine, mental stimulation, and gentle behavior support.',
    content: '<h2>Recognize anxiety signs</h2><p>Common symptoms include pacing, whining, restlessness, and clinginess.</p><h3>Comfort strategies</h3><ul><li>Build a predictable daily routine.</li><li>Provide chew toys and calming scents.</li><li>Create a safe quiet corner for rest.</li></ul><p>With consistency, anxious dogs become more relaxed and secure.</p>',
    featured_image: 'https://images.unsplash.com/photo-1517423440428-1f8a2cc1a3a1?w=800&q=80',
    category: 'Behavior',
    author: 'PetopiaCare Experts',
    read_time_minutes: 5,
    status: 'published',
    seo_title: 'Manage Dog Anxiety | Calm Pet Behavior Tips',
    seo_description: 'Reduce dog anxiety with a simple routine, calming environment, and gentle behavior support strategies.',
    seo_keywords: 'dog anxiety, calm dog tips, pet behavior support, dog stress relief',
    date: 'Dec 28, 2025',
  },
  {
    title: 'Benefits of Regular Dog Exercise for Indian Pets',
    slug: 'benefits-regular-dog-exercise',
    excerpt: 'Discover how daily movement improves your dog’s health, mood, and behavior in Indian climates.',
    content: '<h2>Exercise supports body and mind</h2><p>Regular walks help maintain healthy weight, strong muscles, and a balanced temperament.</p><h3>Exercise ideas</h3><ul><li>Short morning strolls in cool weather.</li><li>Play fetch in shaded yards.</li><li>Use puzzle toys for indoor energy release.</li></ul><p>Consistent activity keeps your dog fit, happy, and obedient.</p>',
    featured_image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80',
    category: 'Health',
    author: 'PetopiaCare Experts',
    read_time_minutes: 5,
    status: 'published',
    seo_title: 'Regular Dog Exercise Benefits | Healthy Dog Lifestyle',
    seo_description: 'Learn the benefits of regular dog exercise with easy routines and mental stimulation ideas for Indian pets.',
    seo_keywords: 'dog exercise, pet fitness, dog health india, active dog tips',
    date: 'Dec 20, 2025',
  },
  {
    title: 'Dog Safety Tips for Urban Living in Indirapuram',
    slug: 'dog-safety-urban-indirapuram',
    excerpt: 'Protect your dog in city life with leash safety, traffic awareness, and secure balcony habits.',
    content: '<h2>Urban safety starts at home</h2><p>Ensure your balcony or terrace is secure and create a safe route for daily walks.</p><h3>City safety checklist</h3><ul><li>Use high-quality harnesses and IDs.</li><li>Avoid busy roads during peak traffic.</li><li>Keep water accessible on hot days.</li></ul><p>With vigilance and proper tools, city living is safe and happy for your dog.</p>',
    featured_image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80',
    category: 'Safety',
    author: 'PetopiaCare Experts',
    read_time_minutes: 5,
    status: 'published',
    seo_title: 'Dog Safety in Urban India | Indirapuram Pet Care Tips',
    seo_description: 'Learn urban dog safety tips for Indirapuram and NCR, including leash rules, traffic caution, and home security.',
    seo_keywords: 'dog safety india, urban pet tips, city dog care, leash safety',
    date: 'Dec 12, 2025',
  },
  {
    title: 'Choosing the Right Dog Bed for Comfort and Support',
    slug: 'choosing-right-dog-bed',
    excerpt: 'Find the most comfortable dog bed for your pet, whether they prefer orthopaedic support or cozy nesting style.',
    content: '<h2>Dog beds matter more than you think</h2><p>A well-designed bed supports joints, regulates body temperature, and improves sleep quality.</p><h3>Bed selection tips</h3><ul><li>Opt for memory foam for senior dogs.</li><li>Choose washable covers for easy cleaning.</li><li>Match bed size to your dog&apos;s sleeping posture.</li></ul><p>Good bedding keeps your dog relaxed and healthy every night.</p>',
    featured_image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&q=80',
    category: 'Products',
    author: 'PetopiaCare Experts',
    read_time_minutes: 5,
    status: 'published',
    seo_title: 'Best Dog Bed Guide | Comfort & Support for Dogs',
    seo_description: 'Choose the right dog bed with comfort, support, and easy care recommendations for all breeds.',
    seo_keywords: 'dog bed guide, comfortable dog bed, pet bedding india, orthopaedic dog bed',
    date: 'Dec 05, 2025',
  },
  {
    title: 'Allergy Care for Dogs in India: Seasonal Grooming Tips',
    slug: 'allergy-care-dogs-india',
    excerpt: 'Manage dog allergies with seasonal grooming, diet changes, and home-cleaning routines.',
    content: '<h2>Seasonal allergies affect many dogs</h2><p>Pet dander, pollen, and dust can trigger itchy skin and respiratory discomfort.</p><h3>Reduce allergy triggers</h3><ul><li>Keep your home clean and well-ventilated.</li><li>Use gentle shampoo and rinse thoroughly.</li><li>Talk to your vet about anti-allergy diets.</li></ul><p>With thoughtful care, allergy season becomes easier for both you and your dog.</p>',
    featured_image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&q=80',
    category: 'Health',
    author: 'PetopiaCare Experts',
    read_time_minutes: 5,
    status: 'published',
    seo_title: 'Dog Allergy Care India | Seasonal Grooming Tips',
    seo_description: 'Get dog allergy relief with seasonal grooming and home care tips designed for Indian conditions.',
    seo_keywords: 'dog allergies, seasonal pet care, allergy grooming, Indian pet care',
    date: 'Nov 28, 2025',
  }
];

export default function SeedBlogPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.from('blog_posts').upsert(seedPosts, { onConflict: 'slug' });
      if (error) {
        throw error;
      }
      setMessage(`Seeded ${seedPosts.length} SEO-optimized blog posts successfully.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to seed blog posts.');
      console.error('Seed error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="bg-[#1A7D80] text-white p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] font-semibold text-cyan-100">Admin Content Seed</p>
              <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">Seed SEO Blog Content</h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-cyan-100/90">
                Quickly populate the blog with high-value articles that are ready to publish and optimized for search.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white">
              <Sparkles size={18} /> Ready for publishing
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10 space-y-6">
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">What this does</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              This seed action inserts a collection of blog posts into the <code className="rounded bg-gray-100 px-1 py-0.5">blog_posts</code> table using unique slugs.
              It is ideal for quickly launching the blog while keeping existing drafts intact.
            </p>
          </div>

          {message && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 text-sm text-gray-800 shadow-sm">
              {message}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={handleSeed}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[#1A7D80] px-6 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-[#16625f] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {loading ? 'Seeding content...' : 'Seed Blog Content'}
            </button>
            <Link
              href="/admin/blog"
              className="inline-flex items-center justify-center rounded-3xl border border-gray-300 bg-white px-6 py-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              View Blog Dashboard
            </Link>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seeded Topics Included</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {seedPosts.map((post) => (
                <div key={post.slug} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-gray-900">{post.title}</p>
                  <p className="text-xs text-gray-500 mt-2">{post.category} • {post.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-6 text-right">
        <Link href="/admin/dashboard" className="text-sm font-semibold text-[#1A7D80] hover:text-[#16625f]">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
