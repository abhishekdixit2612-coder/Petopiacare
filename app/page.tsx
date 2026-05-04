'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ChevronRight, ShieldCheck, CloudSun, BookOpen } from 'lucide-react';

interface FeaturedProduct {
  id: string;
  name: string;
  image_url: string;
  category: string;
  minPrice: number;
}

function getImageSrc(url: string): string {
  if (!url) return '';
  let match = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
  match = url.match(/drive\.google\.com\/uc[^?]*\?.*[?&]id=([^&]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
  return url;
}

const CATEGORIES = [
  {
    label: 'Harnesses',
    desc: 'No-choke designs built for Indian breeds. Adjustable, breathable, weather-resistant.',
    href: '/products?category=Harnesses',
    emoji: '🐾',
  },
  {
    label: 'Leashes',
    desc: 'Rope, nylon & designer leashes in every width. Strong clips, comfortable grips.',
    href: '/products?category=Standard+Leashes',
    emoji: '🦮',
  },
  {
    label: 'Collars',
    desc: 'Padded cotton, nylon & polymer collars. Lightweight, washable, long-lasting.',
    href: '/products?category=Standard+Collars',
    emoji: '🏷️',
  },
];

export default function Home() {
  const [featured, setFeatured] = useState<FeaturedProduct[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('id,name,image_url,category,variants(price)')
          .order('created_at', { ascending: false })
          .limit(4);

        if (data && data.length > 0) {
          setFeatured(
            data.map((p: any) => {
              const prices = Array.isArray(p.variants)
                ? p.variants.map((v: any) => Number(v.price)).filter(Boolean)
                : [];
              return {
                id: p.id,
                name: p.name,
                image_url: p.image_url,
                category: p.category,
                minPrice: prices.length ? Math.min(...prices) : 0,
              };
            })
          );
        }
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative py-14 md:py-24 bg-gradient-to-br from-primary-50 via-white to-primary-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <Badge variant="primary" className="mb-5">
                🐾 India&apos;s Premium Dog Gear
              </Badge>
              <h1 className="text-display-lg md:text-display-md font-display text-neutral-900 mb-5 leading-tight">
                Collars, Harnesses &amp; Leashes Built for Indian Dogs
              </h1>
              <p className="text-body-lg text-neutral-600 mb-8">
                Handcrafted for India&apos;s climate. Washable, adjustable, and tested on real dogs.
                From daily walks to outdoor adventures — gear that lasts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="large" onClick={() => window.location.href = '/products'}>
                  Shop All Products
                </Button>
                <Button variant="ghost" size="large" onClick={() => window.location.href = '/blog'}>
                  Dog Care Guides
                </Button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 pt-8 border-t border-neutral-200">
                <div>
                  <p className="text-heading-sm font-display text-primary-600">100+</p>
                  <p className="text-body-sm text-neutral-500">Products</p>
                </div>
                <div>
                  <p className="text-heading-sm font-display text-primary-600">3</p>
                  <p className="text-body-sm text-neutral-500">Categories</p>
                </div>
                <div>
                  <p className="text-heading-sm font-display text-primary-600">All-weather</p>
                  <p className="text-body-sm text-neutral-500">Tested</p>
                </div>
              </div>
            </div>

            <div className="relative h-80 md:h-[480px] rounded-2xl overflow-hidden shadow-xl bg-primary-100">
              <Image
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80"
                alt="Happy dog wearing Petopia harness"
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-display-sm font-display text-neutral-900 mb-3">Shop by Category</h2>
            <p className="text-body-md text-neutral-500">Everything your dog needs, all in one place</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 hover:shadow-lg hover:border-primary-300 transition-all"
              >
                <div className="text-4xl mb-4">{cat.emoji}</div>
                <h3 className="text-heading-lg font-display text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {cat.label}
                </h3>
                <p className="text-body-sm text-neutral-600 mb-4">{cat.desc}</p>
                <span className="inline-flex items-center gap-1 text-primary-600 font-medium text-body-sm group-hover:gap-2 transition-all">
                  Shop {cat.label} <ChevronRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-14 md:py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-display-sm font-display text-neutral-900 mb-2">New Arrivals</h2>
              <p className="text-body-md text-neutral-500">Just added to the collection</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1 text-primary-600 font-medium text-body-sm hover:gap-2 transition-all"
            >
              View all <ChevronRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {loadingFeatured
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-neutral-200 animate-pulse aspect-square" />
                ))
              : featured.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all border border-neutral-100"
                  >
                    <div className="aspect-square bg-neutral-50 overflow-hidden">
                      {product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getImageSrc(product.image_url)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-300 text-body-sm">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-body-sm font-medium text-neutral-900 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors">
                        {product.name}
                      </p>
                      {product.minPrice > 0 && (
                        <p className="text-body-sm font-semibold text-primary-600 mt-1">
                          from ₹{product.minPrice.toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/products" className="text-primary-600 font-medium text-body-sm">
              View all products →
            </Link>
          </div>
        </div>
      </section>

      {/* WHY PETOPIACARE */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-display-sm font-display text-center text-neutral-900 mb-12">
            Why Dog Parents Choose PetopiaCare
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck size={28} className="text-primary-500" />,
                title: 'Built to Last',
                desc: 'Reinforced stitching, rust-proof hardware, and colour-fast fabric. Our products outlast the average Indian monsoon season.',
              },
              {
                icon: <CloudSun size={28} className="text-primary-500" />,
                title: 'India-First Design',
                desc: 'Made for Indian heat and humidity. Quick-dry, breathable materials that stay comfortable on long summer walks.',
              },
              {
                icon: <BookOpen size={28} className="text-primary-500" />,
                title: 'Expert Dog Guides',
                desc: '50+ free guides on training, nutrition, and care written specifically for Indian dog breeds and conditions.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl border border-neutral-100 bg-neutral-50 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-heading-md font-display text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-body-sm text-neutral-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 bg-gradient-to-r from-primary-700 to-primary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-display-sm md:text-display-md font-display text-white mb-4">
            Give your dog the gear they deserve
          </h2>
          <p className="text-body-lg text-primary-100 mb-8">
            Free shipping on orders above ₹999. 30-day returns. No questions asked.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="large"
              variant="secondary"
              onClick={() => window.location.href = '/products'}
            >
              Shop Now
            </Button>
            <Button
              size="large"
              variant="ghost"
              className="border-white/40 text-white hover:bg-white/10"
              onClick={() => window.location.href = '/digital-products'}
            >
              Free Dog Guides
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
