'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BannerCarousel() {
  // Using high-quality Unsplash images for the MVP banners
  const banners = [
    { id: 1, src: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2000&auto=format&fit=crop', alt: 'Premium Dog Essentials' },
    { id: 2, src: 'https://images.unsplash.com/photo-1544568100-847a9ec5d878?q=80&w=2000&auto=format&fit=crop', alt: 'Healthy Treats & Nutrition' },
    { id: 3, src: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2000&auto=format&fit=crop', alt: 'Training & Agility Gear' },
    { id: 4, src: 'https://images.unsplash.com/photo-1537151608804-ea6f25dc1005?q=80&w=2000&auto=format&fit=crop', alt: 'Comfort & Lounging' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (isHovered) return; // Pause on hover

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, banners.length]);

  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStart - touchEnd > 50) {
      // Swiped left → next banner
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    } else if (touchEnd - touchStart > 50) {
      // Swiped right → previous banner
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  // Navigate to specific banner
  const goToBanner = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-900 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner Container */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Adding overlay for better text readability if we add text later */}
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              className="object-cover"
              priority={index === 0}
              quality={85}
              unoptimized
            />
            {/* Optional Banner Text Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
               {index === currentIndex && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
                   <h2 className="font-primary text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                     {index === 0 ? "Premium Dog Products Trusted by 1000s in India" : banner.alt}
                   </h2>
                   <p className="font-secondary text-lg text-gray-200 mb-8 max-w-xl mx-auto">
                     Everything your dog needs, crafted for comfort and durability.
                   </p>
                   <a href="/products" className="inline-block bg-[#1A7D80] hover:bg-teal-800 text-white font-semibold py-4 px-10 rounded-lg shadow-premium hover:shadow-premium-hover transition-premium text-lg">
                      Shop Collection
                   </a>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-[#1A7D80] text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous banner"
      >
        <ChevronLeft size={30} />
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-[#1A7D80] text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next banner"
      >
        <ChevronRight size={30} />
      </button>

      {/* Slide Indicator Text */}
      <div className="absolute top-6 right-6 z-30 text-white text-sm bg-black/30 backdrop-blur-md px-3 py-1 rounded-full font-semibold">
        {currentIndex + 1} / {banners.length}
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToBanner(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-[#FFD166] w-10'
                : 'bg-white/50 w-2 hover:bg-white/90'
            }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
