'use client';

import { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import BreedCard from './BreedCard';
import type { DogBreed } from '@/types/database';

interface Props {
  breeds: DogBreed[];
}

const SIZES = ['small', 'medium', 'large', 'xlarge'];
const EXERCISE = ['low', 'moderate', 'high', 'very_high'];
const GROOMING = ['minimal', 'moderate', 'high', 'very_high'];
const LABEL: Record<string, string> = {
  small: 'Small', medium: 'Medium', large: 'Large', xlarge: 'XL',
  low: 'Low', moderate: 'Moderate', high: 'High', very_high: 'Very High',
  minimal: 'Minimal',
};

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-body-sm font-medium border transition-all ${
        active
          ? 'bg-primary-500 border-primary-500 text-white'
          : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300'
      }`}
    >
      {label}
    </button>
  );
}

export default function BreedFilters({ breeds }: Props) {
  const [search, setSearch] = useState('');
  const [size, setSize] = useState('');
  const [exercise, setExercise] = useState('');
  const [grooming, setGrooming] = useState('');
  const [sort, setSort] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...breeds];
    if (search.trim()) result = result.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));
    if (size)     result = result.filter((b) => b.size === size);
    if (exercise) result = result.filter((b) => b.exercise_level === exercise);
    if (grooming) result = result.filter((b) => b.grooming_needs === grooming);
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [breeds, search, size, exercise, grooming, sort]);

  const hasFilters = !!(search || size || exercise || grooming);

  const resetFilters = () => {
    setSearch(''); setSize(''); setExercise(''); setGrooming('');
  };

  return (
    <div className="space-y-6">
      {/* Search + controls */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search breeds..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-body-md focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-body-sm font-medium transition-all ${
            showFilters || hasFilters
              ? 'bg-primary-50 border-primary-300 text-primary-700'
              : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300'
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters {hasFilters && `(active)`}
        </button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-body-sm text-neutral-700 focus:outline-none focus:border-primary-400 transition-all"
        >
          <option value="name">A–Z</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Filter chips */}
      {showFilters && (
        <div className="bg-white border border-neutral-100 rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-label-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <FilterChip key={s} label={LABEL[s] ?? s} active={size === s} onClick={() => setSize(size === s ? '' : s)} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-label-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">Exercise Level</p>
            <div className="flex flex-wrap gap-2">
              {EXERCISE.map((e) => (
                <FilterChip key={e} label={LABEL[e] ?? e} active={exercise === e} onClick={() => setExercise(exercise === e ? '' : e)} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-label-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">Grooming</p>
            <div className="flex flex-wrap gap-2">
              {GROOMING.map((g) => (
                <FilterChip key={g} label={LABEL[g] ?? g} active={grooming === g} onClick={() => setGrooming(grooming === g ? '' : g)} />
              ))}
            </div>
          </div>
          {hasFilters && (
            <button onClick={resetFilters} className="flex items-center gap-1.5 text-body-sm text-neutral-500 hover:text-error-600 transition-colors">
              <X size={13} /> Reset all filters
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-neutral-500">
          {filtered.length} breed{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((breed) => (
            <BreedCard
              key={breed.slug}
              breed={{ name: breed.name, slug: breed.slug, image_url: breed.image_url, size: breed.size, temperament: breed.temperament, exercise_level: breed.exercise_level }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50">
          <p className="text-body-lg font-medium text-neutral-500 mb-2">No breeds match your filters</p>
          <p className="text-body-sm text-neutral-400 mb-4">Try adjusting or clearing your filters</p>
          <button onClick={resetFilters} className="text-primary-600 font-medium text-body-sm hover:underline">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
