'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Download, ShieldCheck, Sparkles } from 'lucide-react';

const seedProducts = [
  {
    title: '7-Day Dog Care Checklist',
    slug: '7-day-dog-care-checklist',
    price: 0,
    category: 'Checklist',
    tier: 'FREE',
    short_description: 'Daily checklist for new dog parents. Print it out and follow.',
    features: [
      'Morning and evening routine checks',
      'Hydration and paw health tracking',
      'Behavior and training reminders',
      'Weekly wellness review',
    ],
    thumbnail_url: 'https://images.unsplash.com/photo-1544568100-847a9ec5d878?w=800&q=80',
    download_url: 'https://petopiacare.in/downloads/7-day-dog-care-checklist.pdf',
    rating: 4.9,
    review_count: 510,
    badge: 'Free',
  },
  {
    title: 'Understanding Dog Behavior (Free Guide)',
    slug: 'understanding-dog-behavior-free-guide',
    price: 0,
    category: 'Guide',
    tier: 'FREE',
    short_description: 'Learn what your dog is trying to tell you through body language and vocal cues.',
    features: [
      'Tail and ear language explained',
      'Body posture and mood signals',
      'Vocalization meanings',
      'Practical behavior tips for calm dogs',
    ],
    thumbnail_url: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?w=800&q=80',
    download_url: 'https://petopiacare.in/downloads/understanding-dog-behavior.pdf',
    rating: 4.8,
    review_count: 420,
    badge: 'Free',
  },
  {
    title: '5 Basic Dog Training Exercises',
    slug: '5-basic-dog-training-exercises',
    price: 0,
    category: 'Guide',
    tier: 'FREE',
    short_description: 'Learn these 5 exercises in 10 minutes to build your dog’s obedience foundation.',
    features: [
      'Sit and stay fundamentals',
      'Come on command step-by-step',
      'Loose leash walking practice',
      'Recall and reward techniques',
    ],
    thumbnail_url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    download_url: 'https://petopiacare.in/downloads/5-basic-dog-training-exercises.pdf',
    rating: 4.7,
    review_count: 320,
    badge: 'Free',
  },
  {
    title: 'The Complete Dog Care Handbook',
    slug: 'the-complete-dog-care-handbook',
    price: 149,
    category: 'eBook',
    tier: 'PAID',
    short_description: 'Everything you need to know about dog care in India, from nutrition to emergency support.',
    features: [
      'Nutrition plans for Indian diets',
      'Health and wellness guide',
      'Training basics and behavior solutions',
      'Emergency first aid tips',
    ],
    thumbnail_url: 'https://images.unsplash.com/photo-1537151608804-ea6f25dc1005?w=800&q=80',
    download_url: 'https://petopiacare.in/downloads/complete-dog-care-handbook.pdf',
    rating: 4.9,
    review_count: 180,
    badge: 'Bestseller',
  },
  {
    title: '6-Week Dog Training Masterclass',
    slug: '6-week-dog-training-masterclass',
    price: 499,
    category: 'Course',
    tier: 'PAID',
    short_description: 'Professional training methods adapted for India, with video lessons and downloadable plans.',
    features: [
      '12 video training modules',
      'Weekly action plans',
      'Behavior troubleshooting guide',
      'Lifetime access to course materials',
    ],
    thumbnail_url: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&q=80',
    download_url: 'https://petopiacare.in/downloads/6-week-dog-training-masterclass.zip',
    rating: 4.9,
    review_count: 88,
    badge: 'Premium',
  },
  {
    title: 'Dog Nutrition Masterclass',
    slug: 'dog-nutrition-masterclass',
    price: 349,
    category: 'eBook',
    tier: 'PAID',
    short_description: 'Create perfect meal plans for your dog with 30+ homemade recipes and Indian ingredient guides.',
    features: [
      'Budget-friendly meal plans',
      'Homemade recipe library',
      'Special diets for allergies and obesity',
      'Shopping lists in INR',
    ],
    thumbnail_url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&q=80',
    download_url: 'https://petopiacare.in/downloads/dog-nutrition-masterclass.pdf',
    rating: 4.8,
    review_count: 102,
    badge: 'New',
  },
];

export default function NewDigitalProducts() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.from('digital_products').upsert(seedProducts, { onConflict: 'slug' });
      if (error) throw error;
      setMessage('Seeded 6 digital products successfully. Check the digital products page to confirm.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to seed digital products.');
      console.error('Digital product seed error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#1A7D80] p-8 sm:p-12 text-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] font-semibold text-cyan-100">Admin Digital Products</p>
              <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">Seed Free & Paid Digital Products</h1>
              <p className="mt-4 max-w-2xl text-sm sm:text-base text-cyan-100/90">
                Add ready-to-launch digital products for your shop, including free guides and premium courses.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-semibold tracking-wide">
              <Sparkles size={18} /> Launch-ready products
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10 space-y-6">
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What gets created</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {seedProducts.map((product) => (
                <li key={product.slug} className="rounded-3xl bg-white border border-gray-200 p-4 shadow-sm">
                  <p className="font-bold text-gray-900">{product.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{product.category} • {product.price === 0 ? 'Free' : `₹${product.price}`}</p>
                </li>
              ))}
            </ul>
          </div>

          {message && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 text-sm text-gray-800 shadow-sm">
              {message}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={handleSeed}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[#1A7D80] px-6 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-[#16625f] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <Download className="w-5 h-5" />
              {loading ? 'Seeding products...' : 'Seed Digital Products'}
            </button>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center justify-center rounded-3xl border border-gray-300 bg-white px-6 py-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
