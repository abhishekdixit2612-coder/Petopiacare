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
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100 rounded-2xl p-6 md:p-10">
        <h1 className="font-display font-bold text-display-sm md:text-display-md text-neutral-900 mb-3">
          Find Your Perfect Breed
        </h1>
        <p className="text-body-lg text-neutral-600 max-w-xl">
          Explore detailed guides for every breed popular in India — from exercise needs to grooming,
          training difficulty, and suitability for Indian climate and apartments.
        </p>
      </div>

      {/* Filters + grid (client component) */}
      <BreedFilters breeds={breeds} />
    </div>
  );
}
