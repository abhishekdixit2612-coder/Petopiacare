'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import type { BehavioralTopic } from '@/types/database';

interface Props { topics: BehavioralTopic[]; }

const STAGES = ['puppy', 'adult', 'senior'];
const STAGE_LABELS: Record<string, string> = { puppy: '🐶 Puppy', adult: '🐕 Adult', senior: '🦮 Senior' };

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-body-sm font-medium border transition-all ${
        active ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-neutral-200 text-neutral-600 hover:border-amber-300'
      }`}
    >
      {label}
    </button>
  );
}

export default function BehaviorFilters({ topics }: Props) {
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...topics];
    if (search.trim()) result = result.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.issue_description?.toLowerCase().includes(search.toLowerCase()));
    if (stage) result = result.filter((t) => t.applicable_stages?.includes(stage));
    return result;
  }, [topics, search, stage]);

  return (
    <div className="space-y-6">
      {/* Search + filter toggle */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search behaviours..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-body-md focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
          />
        </div>
        <button onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-body-sm font-medium transition-all ${
            showFilters || stage ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-neutral-200 text-neutral-600 hover:border-amber-300'
          }`}
        >
          <SlidersHorizontal size={15} /> Filter by stage {stage && `(${stage})`}
        </button>
        {(search || stage) && (
          <button onClick={() => { setSearch(''); setStage(''); }} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-500 text-body-sm hover:text-error-600 hover:border-error-300 transition-all">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-white border border-neutral-100 rounded-2xl p-5">
          <p className="text-label-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Life Stage</p>
          <div className="flex flex-wrap gap-2">
            {STAGES.map((s) => (
              <FilterChip key={s} label={STAGE_LABELS[s] ?? s} active={stage === s} onClick={() => setStage(stage === s ? '' : s)} />
            ))}
          </div>
        </div>
      )}

      <p className="text-body-sm text-neutral-500">{filtered.length} topic{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((topic) => (
            <Link key={topic.slug} href={`/learn/behavior/${topic.slug}`}
              className="group flex flex-col p-5 bg-white border border-neutral-100 rounded-2xl hover:border-amber-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-display font-semibold text-neutral-900 text-heading-sm group-hover:text-amber-700 transition-colors">{topic.name}</h3>
                <ArrowRight size={15} className="text-neutral-300 group-hover:text-amber-400 flex-shrink-0 mt-0.5" />
              </div>
              {topic.issue_description && (
                <p className="text-body-sm text-neutral-600 leading-relaxed line-clamp-2 mb-3 flex-1">{topic.issue_description}</p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {topic.applicable_stages?.map((s) => (
                  <span key={s} className="text-[11px] bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-medium capitalize">{s}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-14 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50">
          <p className="text-body-md font-medium text-neutral-500 mb-2">No topics match your search</p>
          <button onClick={() => { setSearch(''); setStage(''); }} className="text-amber-600 font-medium text-body-sm hover:underline">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
