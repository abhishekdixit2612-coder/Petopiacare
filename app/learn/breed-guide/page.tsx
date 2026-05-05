import type { Metadata } from 'next';
import BreedFilters from '@/components/learn/BreedFilters';
import BreadcrumbNav from '@/components/learn/BreadcrumbNav';
import { getAllBreeds } from '@/lib/learn-queries';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Dog Breed Guide — Find Your Perfect Match',
  description: 'Compare 10+ dog breeds popular in India. Filter by size, exercise level, and grooming needs to find the right breed for your family.',
};

export default async function BreedGuidePage() {
  const breeds = await getAllBreeds();

  return (
    <div className="space-y-8">
      <BreadcrumbNav items={[{ label: 'Learn', href: '/learn' }, { label: 'Breed Guide' }]} />

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&q=80"
          alt="Dogs of different breeds" className="w-full h-56 md:h-72 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-500/90 to-forest-500/60 flex items-center p-8 md:p-12">
          <div>
            <h1 className="font-display font-bold italic text-white text-display-sm md:text-display-md mb-3">
              Find Your Perfect Breed
            </h1>
            <p className="text-white/80 text-body-lg max-w-xl">
              Explore guides for every breed popular in India — exercise needs, grooming,
              training difficulty, and suitability for Indian climate and apartments.
            </p>
          </div>
        </div>
      </div>

      {/* Filters + grid (client component) */}
      <BreedFilters breeds={breeds} />
    </div>
  );
}
