'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BannerCarousel() {
  const banners = [
    { id: 1, src: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2000&auto=format&fit=crop', alt: 'Premium Dog Essentials', headline: 'Premium Dog Products Trusted by 1000s in India' },
    { id: 2, src: 'https://images.unsplash.com/photo-1544568100-847a9ec5d878?q=80&w=2000&auto=format&fit=crop', alt: 'Healthy Treats & Nutrition', headline: 'Healthy Treats & Nutrition' },
    { id: 3, src: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2000&auto=format&fit=crop', alt: 'Training & Agility Gear', headline: 'Training & Agility Gear' },
    { id: 4, src: 'https://images.unsplash.com/photo-1537151608804-ea6f25dc1005?q=80&w=2000&auto=format&fit=crop', alt: 'Comfort & Lounging', headline: 'Comfort & Lounging' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, banners.length]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) setCurrentIndex((prev) => (prev + 1) % banners.length);
    else if (diff < -50) setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-neutral-900 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              className="object-cover"
              priority={index === 0}
              quality={85}
              unoptimized
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
              {index === currentIndex && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
                  <h2 className="font-display text-display-md md:text-display-lg font-semibold text-white leading-tight mb-6">
                    {banner.headline}
                  </h2>
                  <p className="font-body text-body-lg text-neutral-200 mb-8 max-w-xl mx-auto">
                    Everything your dog needs, crafted for comfort and durability.
                  </p>
                  <a
                    href="/products"
                    className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium py-4 px-10 rounded-lg shadow-lg transition-all duration-300 text-body-lg"
                  >
                    Shop Collection
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-primary-500 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous banner"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-primary-500 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next banner"
      >
        <ChevronRight size={28} />
      </button>

      <div className="absolute top-6 right-6 z-30 text-white text-label-sm bg-black/30 backdrop-blur-md px-3 py-1 rounded-full font-medium">
        {currentIndex + 1} / {banners.length}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-secondary-300 w-10' : 'bg-white/50 w-2 hover:bg-white/80'
            }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
