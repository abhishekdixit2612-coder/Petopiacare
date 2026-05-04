'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ShieldCheck, CloudSun, BookOpen, Star } from 'lucide-react';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';

interface FeaturedProduct {
  id: string; name: string; image_url: string;
  category: string; minPrice: number;
}

function getImageSrc(url: string): string {
  if (!url) return '';
  let m = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w800`;
  m = url.match(/drive\.google\.com\/uc[^?]*\?.*[?&]id=([^&]+)/);
  if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w800`;
  return url;
}

const CATEGORIES = [
  { label: 'Harnesses', emoji: '🐾', href: '/products?category=Harnesses', desc: 'No-choke designs for Indian breeds', count: '40+' },
  { label: 'Leashes',   emoji: '🦮', href: '/products?category=Standard+Leashes', desc: 'Rope, nylon & designer options', count: '25+' },
  { label: 'Collars',   emoji: '🏷️', href: '/products?category=Standard+Collars', desc: 'Padded cotton, nylon & polymer', count: '35+' },
];

const STATS = [
  { value: '100+', label: 'Products', sub: 'in our catalog' },
  { value: '3',    label: 'Categories', sub: 'all for dogs' },
  { value: '4.9',  label: 'Avg rating', sub: 'from dog parents' },
];

export default function Home() {
  const [featured, setFeatured] = useState<FeaturedProduct[]>([]);

  useEffect(() => {
    supabase
      .from('products')
      .select('id,name,image_url,category,variants(price)')
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data?.length) {
          setFeatured(data.map((p: any) => {
            const prices = Array.isArray(p.variants) ? p.variants.map((v: any) => Number(v.price)).filter(Boolean) : [];
            return { id: p.id, name: p.name, image_url: p.image_url, category: p.category, minPrice: prices.length ? Math.min(...prices) : 0 };
          }));
        }
      });
  }, []);

  return (
    <main className="bg-neutral-50">

      {/* ── HERO ── */}
      <section className="bg-forest-500 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full bg-primary-500/8 translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute right-48 bottom-0 w-[300px] h-[300px] rounded-full bg-secondary-500/6 translate-y-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 text-primary-400 text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-full mb-6">
                🐾 India&apos;s Premium Dog Gear
              </span>
              <h1 className="font-display font-bold italic text-white text-display-lg md:text-[52px] leading-tight mb-5">
                Because they<br />deserve the best.
              </h1>
              <p className="text-white/70 text-body-lg leading-relaxed mb-8 max-w-md">
                Handcrafted collars, harnesses, and leashes for Indian dogs.
                Washable, adjustable, and tested on 1,000+ happy dogs.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="large" onClick={() => window.location.href = '/products'}>
                  Shop Now →
                </Button>
                <Button variant="ivory" size="large" onClick={() => window.location.href = '/learn'}>
                  Dog Care Guides
                </Button>
              </div>

              {/* Stats row */}
              <div className="flex gap-8 pt-8 mt-8 border-t border-white/10">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <p className="font-display font-bold text-white text-[22px]">{s.value}</p>
                    <p className="text-white/50 text-body-sm">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="relative h-80 lg:h-[440px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80"
                alt="Happy dog wearing PetopiaCare harness"
                fill
                className="object-cover"
                unoptimized
                priority
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900/40 to-transparent" />
              {/* Price badge */}
              <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                <p className="text-[10px] font-bold text-primary-500 uppercase tracking-wide mb-0.5">Harnesses from</p>
                <p className="font-display font-bold text-forest-500 text-xl">₹175</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY CARDS ── */}
      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-500 font-bold uppercase tracking-[0.12em] text-[11px] mb-3">Shop by Category</p>
            <h2 className="font-display font-bold text-display-sm text-neutral-900">Everything your dog needs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => (
              <Link key={cat.href} href={cat.href}
                className="group relative bg-white rounded-2xl border border-neutral-200 p-7 hover:border-primary-300 hover:shadow-md transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-neutral-50 translate-x-8 -translate-y-8 pointer-events-none" />
                <div className="text-4xl mb-4">{cat.emoji}</div>
                <h3 className="font-display font-bold text-neutral-900 text-heading-lg mb-1 group-hover:text-primary-500 transition-colors">
                  {cat.label}
                </h3>
                <p className="text-body-sm text-neutral-500 mb-4">{cat.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary-500 bg-primary-50 px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {cat.count} products
                  </span>
                  <ChevronRight size={16} className="text-neutral-300 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary-500 font-bold uppercase tracking-[0.12em] text-[11px] mb-2">New Arrivals</p>
              <h2 className="font-display font-bold text-display-sm text-neutral-900">Just added</h2>
            </div>
            <Link href="/products" className="text-primary-500 font-bold text-body-sm hover:text-primary-600 flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}
                  className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="aspect-square bg-neutral-50 overflow-hidden relative">
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={getImageSrc(product.image_url)} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl text-neutral-300">🐕</div>
                    )}
                  </div>
                  <div className="p-3.5">
                    <p className="text-[10px] font-bold text-primary-500 uppercase tracking-wide mb-1">{product.category}</p>
                    <p className="font-display font-semibold text-neutral-900 text-[13px] line-clamp-2 leading-snug mb-2 group-hover:text-primary-500 transition-colors">
                      {product.name}
                    </p>
                    {product.minPrice > 0 && (
                      <p className="font-display font-bold text-forest-500 text-[15px]">
                        ₹{product.minPrice.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="aspect-square rounded-2xl bg-neutral-100 animate-pulse" />)}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY PETOPIACARE ── */}
      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-500 font-bold uppercase tracking-[0.12em] text-[11px] mb-3">Why dog parents choose us</p>
            <h2 className="font-display font-bold text-display-sm text-neutral-900">Built for India. Tested by dogs.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <ShieldCheck size={22} className="text-primary-500" />, title: 'Built to Last', desc: 'Reinforced stitching, rust-proof hardware, colour-fast fabrics. Made to survive Indian monsoons and Indian roads.' },
              { icon: <CloudSun size={22} className="text-primary-500" />,    title: 'India-First Design', desc: 'Quick-dry, breathable materials tuned for Indian heat and humidity. Safe for long summer walks.' },
              { icon: <BookOpen size={22} className="text-primary-500" />,    title: 'Expert Dog Guides', desc: '50+ free guides on training, nutrition, and care written specifically for Indian dog breeds and conditions.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-sm transition-all">
                <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-neutral-900 text-heading-md mb-2">{item.title}</h3>
                <p className="text-body-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL STRIP ── */}
      <section className="py-10 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#C8930A" className="text-secondary-500" />)}
              <span className="ml-2 font-display font-bold text-neutral-900 text-[15px]">4.9 / 5</span>
              <span className="text-neutral-400 text-body-sm ml-1">from 1,000+ happy dog parents</span>
            </div>
            <div className="flex flex-wrap gap-4 text-body-sm text-neutral-500">
              <span className="flex items-center gap-1.5">✓ Free shipping above ₹999</span>
              <span className="flex items-center gap-1.5">✓ 30-day returns</span>
              <span className="flex items-center gap-1.5">✓ Washable & weather-resistant</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEARN HUB CTA ── */}
      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-forest-500 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-72 h-72 rounded-full bg-primary-500/8 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-primary-400 font-bold uppercase tracking-[0.12em] text-[11px] mb-3">Free Expert Guides</p>
                <h2 className="font-display font-bold italic text-white text-display-sm md:text-display-md mb-3 leading-tight">
                  Complete Dog Care<br />Guide for India
                </h2>
                <p className="text-white/60 text-body-md max-w-lg">
                  Breeds, nutrition, health, training — expert guides written specifically for Indian dog parents, Indian climates, and Indian budgets.
                </p>
              </div>
              <div className="flex flex-col gap-3 flex-shrink-0">
                <Button size="large" onClick={() => window.location.href = '/learn'}>
                  Explore Learn Hub →
                </Button>
                <Button variant="ivory" size="medium" onClick={() => window.location.href = '/companion'}>
                  Care Companion Tools
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold italic text-display-md text-neutral-900 mb-4">
            Give your dog the gear<br />they deserve.
          </h2>
          <p className="text-body-lg text-neutral-500 mb-8">
            Free shipping on orders above ₹999. 30-day money-back guarantee.
          </p>
          <Button size="large" onClick={() => window.location.href = '/products'}>
            Shop All Products →
          </Button>
        </div>
      </section>
    </main>
  );
}
