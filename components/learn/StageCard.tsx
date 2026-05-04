'use client';

import Link from 'next/link';
import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import type { StageCardProps } from '@/types/components';

const STAGE_THEME: Record<string, { badge: string; border: string; gradient: string; dot: string }> = {
  neonatal:            { badge: 'bg-violet-100 text-violet-700', border: 'border-violet-200', gradient: 'from-violet-50', dot: 'bg-violet-400' },
  'puppy-early':       { badge: 'bg-blue-100 text-blue-700',    border: 'border-blue-200',   gradient: 'from-blue-50',   dot: 'bg-blue-400' },
  'puppy-socialisation':{ badge: 'bg-blue-100 text-blue-700',   border: 'border-blue-200',   gradient: 'from-blue-50',   dot: 'bg-blue-400' },
  'puppy-juvenile':    { badge: 'bg-sky-100 text-sky-700',      border: 'border-sky-200',    gradient: 'from-sky-50',    dot: 'bg-sky-400' },
  adolescent:          { badge: 'bg-cyan-100 text-cyan-700',    border: 'border-cyan-200',   gradient: 'from-cyan-50',   dot: 'bg-cyan-400' },
  'young-adult':       { badge: 'bg-green-100 text-green-700',  border: 'border-green-200',  gradient: 'from-green-50',  dot: 'bg-green-400' },
  adult:               { badge: 'bg-green-100 text-green-700',  border: 'border-green-200',  gradient: 'from-green-50',  dot: 'bg-green-500' },
  'senior-small':      { badge: 'bg-amber-100 text-amber-700',  border: 'border-amber-200',  gradient: 'from-amber-50',  dot: 'bg-amber-400' },
  'senior-large':      { badge: 'bg-orange-100 text-orange-700',border: 'border-orange-200', gradient: 'from-orange-50', dot: 'bg-orange-400' },
  geriatric:           { badge: 'bg-rose-100 text-rose-700',    border: 'border-rose-200',   gradient: 'from-rose-50',   dot: 'bg-rose-400' },
};

const DEFAULT_THEME = { badge: 'bg-neutral-100 text-neutral-700', border: 'border-neutral-200', gradient: 'from-neutral-50', dot: 'bg-neutral-400' };

function StageCard({ stage, featured = false }: StageCardProps) {
  const theme = STAGE_THEME[stage.slug] ?? DEFAULT_THEME;

  if (featured) {
    return (
      <Link
        href={`/learn/life-stages/${stage.slug}`}
        className={`group w-full flex flex-col md:flex-row rounded-2xl border ${theme.border} bg-gradient-to-br ${theme.gradient} to-white overflow-hidden shadow-sm hover:shadow-lg transition-all`}
        aria-label={`${stage.name} — ${stage.age_range}`}
      >
        <div className="md:w-2/5 h-52 md:h-auto overflow-hidden bg-neutral-100 flex-shrink-0">
          {stage.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={stage.image_url} alt={stage.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🐾</div>
          )}
        </div>
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
          <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full mb-3 w-fit ${theme.badge}`}>
            {stage.age_range}
          </span>
          <h3 className="font-display font-bold text-neutral-900 text-display-sm mb-2 group-hover:text-primary-600 transition-colors">
            {stage.name}
          </h3>
          {stage.behavioral_characteristics && (
            <p className="text-body-sm text-neutral-600 line-clamp-3 mb-4 leading-relaxed">
              {stage.behavioral_characteristics}
            </p>
          )}
          <span className="inline-flex items-center gap-1 text-primary-600 font-medium text-body-sm">
            Explore stage <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/learn/life-stages/${stage.slug}`}
      className={`group flex flex-col rounded-2xl border ${theme.border} bg-gradient-to-b ${theme.gradient} to-white overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}
      aria-label={`${stage.name} — ${stage.age_range}`}
    >
      <div className="h-40 overflow-hidden bg-neutral-100 flex-shrink-0 relative">
        {stage.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={stage.image_url} alt={stage.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-neutral-50">🐾</div>
        )}
        <span className={`absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${theme.badge}`}>
          {stage.age_range}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${theme.dot}`} />
          <h3 className="font-display font-semibold text-neutral-900 text-heading-sm group-hover:text-primary-600 transition-colors">
            {stage.name}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 text-primary-500 text-xs font-medium mt-2">
          Explore <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

export default memo(StageCard);
