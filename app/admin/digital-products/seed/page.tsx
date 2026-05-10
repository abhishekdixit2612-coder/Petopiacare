'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Check, AlertCircle, Copy, ExternalLink } from 'lucide-react';

const CREATE_TABLE_SQL = `CREATE TABLE IF NOT EXISTS digital_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  category VARCHAR(50) NOT NULL,
  tier VARCHAR(50) NOT NULL,
  short_description VARCHAR(500),
  features JSONB,
  thumbnail_url VARCHAR(500),
  download_url VARCHAR(500),
  rating DECIMAL(3, 2) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  badge VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);`;

const PROJECT_REF = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '')
  .replace('https://', '').split('.')[0];
const SUPABASE_EDITOR_URL = `https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`;

const ALL_PRODUCTS = [
  {
    title: '7-Day Dog Care Checklist',
    slug: '7-day-dog-care-checklist',
    price: 0, category: 'Checklist', tier: 'FREE', badge: 'Free',
    short_description: 'Daily checklist for new dog parents. Print it out and follow.',
    features: ['Morning routine checklist', 'Evening care reminders', 'Health tracking and paw checks', 'Training session prompts'],
    thumbnail_url: 'https://images.unsplash.com/photo-1544568100-847a9ec5d878?w=800&q=80',
    download_url: 'https://petopiacare.in/downloads/7-day-dog-care-checklist.pdf',
    rating: 4.9, review_count: 510,
  },
  {
    title: 'Understanding Dog Behavior (Free Guide)',
    slug: 'understanding-dog-behavior-free-guide',
    price: 0, category: 'Guide', tier: 'FREE', badge: 'Free',
    short_description: "Learn what your dog's behavior means with simple body language cues.",
    features: ['Tail and ear language explained', 'Body posture signals', 'Vocalization meanings', 'Calm dog training tips'],
    thumbnail_url: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?w=800&q=80',
    download_url: 'https://petopiacare.in/downloads/understanding-dog-behavior.pdf',
    rating: 4.8, review_count: 420,
  },
  {
    title: '5 Basic Dog Training Exercises',
    slug: '5-basic-dog-training-exercises',
    price: 0, category: 'Guide', tier: 'FREE', badge: 'Free',
    short_description: 'Learn 5 exercises you can teach your dog in 10 minutes.',
    features: ['Sit and stay basics', 'Come when called', 'Loose leash walking', 'Positive reward systems'],
    thumbnail_url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    download_url: 'https://petopiacare.in/downloads/5-basic-dog-training-exercises.pdf',
    rating: 4.7, review_count: 320,
  },
  {
    title: 'Dog First Aid Guide',
    slug: 'dog-first-aid-guide',
    price: 0, category: 'Checklist', tier: 'FREE', badge: 'Free',
    short_description: 'A free dog first aid checklist for immediate home care.',
    features: ['Emergency care steps', 'Wound cleaning tips', 'Heat stroke actions', 'Poison response checklist'],
    thumbnail_url: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80',
    download_url: 'https://petopiacare.in/downloads/dog-first-aid-guide.pdf',
    rating: 4.7, review_count: 210,
  },
  {
    title: 'Potty Training Blueprint',
    slug: 'potty-training-blueprint',
    price: 0, category: 'Guide', tier: 'FREE', badge: 'Free',
    short_description: 'Potty training made easy with routine, rewards, and step-by-step practice.',
    features: ['Daily house training schedule', 'Positive reward system', 'Accident handling tips', 'Crate training support'],
    thumbnail_url: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=800&q=80',
    download_url: 'https://petopiacare.in/downloads/potty-training-blueprint.pdf',
    rating: 4.6, review_count: 190,
  },
  {
    title: 'The Complete Dog Care Handbook',
    slug: 'the-complete-dog-care-handbook',
    price: 149, category: 'eBook', tier: 'PAID', badge: 'Bestseller',
    short_description: 'Everything you need to know about dog care in India.',
    features: ['Nutrition & meal planning', 'Health and wellness care', 'Training basics', 'Emergency first aid'],
    thumbnail_url: 'https://images.unsplash.com/photo-1537151608804-ea6f25dc1005?w=800&q=80',
    download_url: 'https://petopiacare.in/downloads/complete-dog-care-handbook.pdf',
    rating: 4.9, review_count: 180,
  },
  {
    title: '6-Week Dog Training Masterclass',
    slug: '6-week-dog-training-masterclass',
    price: 499, category: 'Course', tier: 'PAID', badge: 'Premium',
    short_description: 'Professional dog training adapted for Indian homes.',
    features: ['12 training modules', 'Weekly progress plans', 'Behavior troubleshooting', 'Lifetime access'],
    thumbnail_url: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&q=80',
    download_url: 'https://petopiacare.in/downloads/6-week-dog-training-masterclass.zip',
    rating: 4.9, review_count: 88,
  },
  {
    title: 'Dog Nutrition Masterclass',
    slug: 'dog-nutrition-masterclass',
    price: 349, category: 'eBook', tier: 'PAID', badge: 'New',
    short_description: 'Create balanced meal plans with Indian ingredients.',
    features: ['30+ homemade recipes', 'Budget meal plans', 'Special diets for allergies', 'Shopping lists in INR'],
    thumbnail_url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&q=80',
    download_url: 'https://petopiacare.in/downloads/dog-nutrition-masterclass.pdf',
    rating: 4.8, review_count: 102,
  },
  {
    title: 'Dog Travel Preparation Kit',
    slug: 'dog-travel-preparation-kit',
    price: 99, category: 'Guide', tier: 'PAID', badge: 'Best Value',
    short_description: 'Prepare your dog for safe travel with the ultimate packing checklist.',
    features: ['Pre-travel health checklist', 'Travel-friendly feeding plan', 'Comfort and safety tips', 'Pet documentation guide'],
    thumbnail_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    download_url: 'https://petopiacare.in/downloads/dog-travel-preparation-kit.pdf',
    rating: 4.8, review_count: 130,
  },
  {
    title: 'Advanced Dog Nutrition Planner',
    slug: 'advanced-dog-nutrition-planner',
    price: 299, category: 'eBook', tier: 'PAID', badge: 'Premium',
    short_description: 'Balanced meal planning for dogs with allergies, weight goals, and active lifestyles.',
    features: ['Allergy-safe meal plans', 'Weight management recipes', 'Seasonal ingredient guide', 'Weekly shopping lists'],
    thumbnail_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&q=80',
    download_url: 'https://petopiacare.in/downloads/advanced-dog-nutrition-planner.pdf',
    rating: 4.9, review_count: 76,
  },
];

export default function SeedDigitalProducts() {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const copySQL = async () => {
    await navigator.clipboard.writeText(CREATE_TABLE_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/seed-digital-products', { method: 'POST' });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? 'Import failed');
      const count = data.count ?? ALL_PRODUCTS.length;
      setMessage({ type: 'success', text: `✓ ${count} products imported — all are now editable in the admin panel.` });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Import failed. Make sure you created the table first (Step 1).' });
    } finally {
      setLoading(false);
    }
  };

  const freeCount = ALL_PRODUCTS.filter(p => p.tier === 'FREE').length;
  const paidCount = ALL_PRODUCTS.filter(p => p.tier === 'PAID').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/admin/digital-products" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors">
          <ArrowLeft size={16} /> Back to Digital Products
        </Link>

        <div className="bg-[#1A7D80] text-white p-8 rounded-3xl">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-cyan-100 mb-2">Admin — Digital Products Setup</p>
          <h1 className="text-3xl font-bold">Import All {ALL_PRODUCTS.length} Digital Products</h1>
          <p className="mt-2 text-cyan-100/90 text-sm max-w-xl">
            Create the database table first (Step 1), then import all products in one click (Step 2).
          </p>
        </div>

        {/* Step 1 — Create Table */}
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
            <span className="w-7 h-7 rounded-full bg-[#1A7D80] text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
            <h2 className="font-bold text-gray-900">Create the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">digital_products</code> table</h2>
            <span className="ml-auto text-xs text-gray-400">Skip if already done</span>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">Copy the SQL, open the Supabase SQL Editor, paste and click <strong>Run</strong>.</p>

            <div className="relative">
              <pre className="bg-gray-900 text-green-300 text-xs leading-relaxed p-5 rounded-2xl overflow-x-auto font-mono whitespace-pre-wrap">
{CREATE_TABLE_SQL}
              </pre>
              <button onClick={copySQL}
                className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-white/20">
                {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy SQL</>}
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={copySQL}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy SQL</>}
              </button>
              <a href={SUPABASE_EDITOR_URL} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 bg-[#1A7D80] hover:bg-[#16625f] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
                <ExternalLink size={14} /> Open Supabase SQL Editor
              </a>
            </div>
          </div>
        </div>

        {/* Step 2 — Import */}
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
            <span className="w-7 h-7 rounded-full bg-[#1A7D80] text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
            <h2 className="font-bold text-gray-900">Import all {ALL_PRODUCTS.length} products</h2>
            <div className="ml-auto flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> {freeCount} free</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> {paidCount} paid</span>
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
                  <Link href="/admin/digital-products" className="shrink-0 underline font-bold whitespace-nowrap">View Products →</Link>
                )}
              </div>
            )}

            {message?.type !== 'success' && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 flex gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                Re-importing overwrites existing products with the same slug.
              </div>
            )}

            <button onClick={handleImport} disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#1A7D80] px-6 py-4 text-sm font-bold text-white shadow-md transition hover:bg-[#16625f] disabled:cursor-not-allowed disabled:bg-gray-300">
              {loading
                ? <span className="animate-pulse">Importing {ALL_PRODUCTS.length} products...</span>
                : <><Sparkles size={16} /> Import All {ALL_PRODUCTS.length} Products</>}
            </button>

            <div className="grid gap-2 sm:grid-cols-2 pt-2">
              {ALL_PRODUCTS.map(p => (
                <div key={p.slug} className="rounded-xl border border-gray-100 bg-gray-50 p-3 flex items-start gap-2.5">
                  <div className={`shrink-0 w-2 h-2 rounded-full mt-1.5 ${p.tier === 'FREE' ? 'bg-green-500' : 'bg-blue-500'}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 leading-snug">{p.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {p.category} · {p.price === 0 ? 'FREE' : `₹${p.price}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
