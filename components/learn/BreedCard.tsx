'use client';

import Link from 'next/link';
import { memo } from 'react';
import { Activity, ShoppingBag } from 'lucide-react';
import type { BreedCardProps } from '@/types/components';

const SIZE_BADGE: Record<string, string> = {
  small:  'bg-blue-100 text-blue-700',
  medium: 'bg-green-100 text-green-700',
  large:  'bg-orange-100 text-orange-700',
  xlarge: 'bg-purple-100 text-purple-700',
};

const SIZE_LABEL: Record<string, string> = {
  small: 'Small', medium: 'Medium', large: 'Large', xlarge: 'XL',
};

const EXERCISE_DOTS: Record<string, number> = {
  low: 1, moderate: 2, high: 3, very_high: 4,
};

const EXERCISE_LABEL: Record<string, string> = {
  low: 'Low', moderate: 'Moderate', high: 'High', very_high: 'Very High',
};

function ExerciseDots({ level }: { level: string }) {
  const filled = EXERCISE_DOTS[level] ?? 2;
  return (
    <span className="flex items-center gap-0.5" aria-label={`Exercise: ${EXERCISE_LABEL[level]}`}>
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${i < filled ? 'bg-primary-500' : 'bg-neutral-200'}`}
        />
      ))}
    </span>
  );
}

function BreedCard({ breed, showProducts = false, onProductClick }: BreedCardProps) {
  return (
    <article className="group bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-neutral-50 relative">
        {breed.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={breed.image_url}
            alt={breed.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300 text-4xl">🐕</div>
        )}
        <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${SIZE_BADGE[breed.size] ?? 'bg-neutral-100 text-neutral-600'}`}>
          {SIZE_LABEL[breed.size] ?? breed.size}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-neutral-900 text-heading-sm mb-2 group-hover:text-primary-600 transition-colors">
          {breed.name}
        </h3>

        {/* Temperament tags */}
        {breed.temperament.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {breed.temperament.slice(0, 3).map((t) => (
              <span key={t} className="text-[11px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full capitalize">
                {t}
              </span>
            ))}
            {breed.temperament.length > 3 && (
              <span className="text-[11px] text-neutral-400">+{breed.temperament.length - 3}</span>
            )}
          </div>
        )}

        {/* Exercise level */}
        <div className="flex items-center gap-2 mb-4">
          <Activity size={13} className="text-neutral-400 flex-shrink-0" />
          <span className="text-body-sm text-neutral-500 text-xs">{EXERCISE_LABEL[breed.exercise_level]}</span>
          <ExerciseDots level={breed.exercise_level} />
        </div>

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-2">
          <Link
            href={`/learn/breed-guide/${breed.slug}`}
            className="w-full text-center bg-primary-500 hover:bg-primary-600 text-white text-body-sm font-medium py-2 rounded-lg transition-colors"
          >
            Learn More
          </Link>
          {showProducts && (
            <button
              onClick={() => onProductClick?.(breed.slug)}
              className="w-full text-center border border-primary-300 text-primary-600 hover:bg-primary-50 text-body-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={13} />
              Shop for this breed
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default memo(BreedCard);
