'use client';

import { useState } from 'react';
import { LayoutGrid, AlignJustify } from 'lucide-react';
import type { ComparisonLayoutProps } from '@/types/components';

export default function ComparisonLayout({
  children,
  title,
  subtitle,
  viewMode: initialMode = 'side-by-side',
}: ComparisonLayoutProps) {
  const [viewMode, setViewMode] = useState(initialMode);

  return (
    <div className="w-full">
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            {title && (
              <h1 className="font-display font-bold text-display-sm text-neutral-900">{title}</h1>
            )}
            {subtitle && (
              <p className="text-body-md text-neutral-500 mt-1">{subtitle}</p>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-neutral-100 rounded-lg p-1 gap-1 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('side-by-side')}
              aria-pressed={viewMode === 'side-by-side'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-body-sm font-medium transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-white shadow-sm text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <LayoutGrid size={14} />
              <span className="hidden sm:inline">Side by side</span>
            </button>
            <button
              onClick={() => setViewMode('stacked')}
              aria-pressed={viewMode === 'stacked'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-body-sm font-medium transition-all ${
                viewMode === 'stacked'
                  ? 'bg-white shadow-sm text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <AlignJustify size={14} />
              <span className="hidden sm:inline">Stacked</span>
            </button>
          </div>
        </div>
      )}

      {/* Content wrapper — passes viewMode to children via CSS class */}
      <div
        data-view={viewMode}
        className={
          viewMode === 'side-by-side'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
            : 'flex flex-col gap-6'
        }
      >
        {children}
      </div>
    </div>
  );
}
