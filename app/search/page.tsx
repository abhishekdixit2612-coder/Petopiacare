import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Dog, Heart, Utensils, Brain, BookOpen, ShoppingBag, ArrowRight } from 'lucide-react';
import { searchAll, suggestCorrection, type ContentType, type SearchResult } from '@/lib/search-queries';

export const revalidate = 0; // always fresh for search

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — Search Results | PetopiaCare` : 'Search | PetopiaCare',
    description: q ? `Search results for "${q}" across breeds, health guides, nutrition, training, and products.` : 'Search PetopiaCare',
    robots: { index: false },
  };
}

const TYPE_CONFIG: Record<ContentType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  breed:     { label: 'Breeds',    icon: <Dog size={14} />,         color: 'text-purple-700', bg: 'bg-purple-100' },
  health:    { label: 'Health',    icon: <Heart size={14} />,       color: 'text-rose-700',   bg: 'bg-rose-100' },
  nutrition: { label: 'Nutrition', icon: <Utensils size={14} />,    color: 'text-green-700',  bg: 'bg-green-100' },
  behavior:  { label: 'Behaviour', icon: <Brain size={14} />,       color: 'text-amber-700',  bg: 'bg-amber-100' },
  blog:      { label: 'Blog',      icon: <BookOpen size={14} />,    color: 'text-blue-700',   bg: 'bg-blue-100' },
  product:   { label: 'Products',  icon: <ShoppingBag size={14} />, color: 'text-primary-700', bg: 'bg-primary-100' },
};

function ResultCard({ result }: { result: SearchResult }) {
  const cfg = TYPE_CONFIG[result.type];
  return (
    <Link href={result.url}
      className="group flex gap-4 p-5 bg-white border border-neutral-100 rounded-2xl hover:shadow-md hover:border-primary-200 transition-all"
    >
      {result.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={result.image_url} alt={result.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-neutral-100" />
      ) : (
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
          <span className={cfg.color}>{cfg.icon}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap mb-1">
          <h3 className="font-display font-semibold text-neutral-900 text-heading-sm group-hover:text-primary-600 transition-colors leading-tight">
            {result.title}
          </h3>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
        {result.excerpt && (
          <p className="text-body-sm text-neutral-500 line-clamp-2 leading-relaxed">{result.excerpt}</p>
        )}
        {result.meta && (
          <p className="text-label-sm text-neutral-400 mt-1 capitalize">{result.meta}</p>
        )}
      </div>
      <ArrowRight size={15} className="text-neutral-300 group-hover:text-primary-400 flex-shrink-0 mt-1" />
    </Link>
  );
}

type FilterType = ContentType | 'all';

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'breed',     label: 'Breeds' },
  { value: 'health',    label: 'Health' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'behavior',  label: 'Behaviour' },
  { value: 'blog',      label: 'Blog' },
  { value: 'product',   label: 'Products' },
];

const SUGGESTIONS = [
  'Labrador Retriever', 'German Shepherd', 'Tick fever',
  'Puppy feeding', 'Leash pulling', 'Hip dysplasia',
  'Homemade dog food', 'Separation anxiety',
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? '';
  const typeParam = (params.type ?? 'all') as FilterType;
  const page = Math.max(1, parseInt(params.page ?? '1', 10));

  const grouped = q ? await searchAll(q, {
    type: typeParam === 'all' ? 'all' : typeParam as ContentType,
    limit: 20,
  }) : null;

  const allResults: SearchResult[] = grouped
    ? [...grouped.breed, ...grouped.health, ...grouped.nutrition,
       ...grouped.behavior, ...grouped.blog, ...grouped.product]
    : [];

  const LIMIT = 10;
  const total = allResults.length;
  const paged  = allResults.slice((page - 1) * LIMIT, page * LIMIT);
  const totalPages = Math.ceil(total / LIMIT);

  const correction = (q && total === 0) ? suggestCorrection(q) : null;

  function filterHref(type: FilterType) {
    const p = new URLSearchParams({ q, type });
    return `/search?${p}`;
  }

  function pageHref(p: number) {
    const sp = new URLSearchParams({ q, type: typeParam, page: String(p) });
    return `/search?${sp}`;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Search input */}
      <form method="get" action="/search" className="mb-8">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input name="q" type="search" defaultValue={q}
            placeholder="Search breeds, health topics, guides, products..."
            autoFocus={!q}
            className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-200 rounded-2xl text-body-lg text-neutral-900 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 shadow-sm transition-all"
          />
        </div>
      </form>

      {/* No query → show suggestions */}
      {!q && (
        <div className="space-y-8">
          <div>
            <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-6">Popular Searches</h2>
            <div className="flex flex-wrap gap-3">
              {SUGGESTIONS.map((s) => (
                <Link key={s} href={`/search?q=${encodeURIComponent(s)}`}
                  className="bg-white border border-neutral-200 hover:border-primary-300 hover:text-primary-700 text-neutral-700 font-medium px-4 py-2 rounded-full text-body-sm transition-colors"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
                <Link key={type} href={`/search?type=${type}`}
                  className={`flex items-center gap-3 p-4 rounded-2xl border ${cfg.bg} border-transparent hover:shadow-md transition-all group`}
                >
                  <span className={`${cfg.color}`}>{cfg.icon}</span>
                  <span className={`font-medium text-body-md ${cfg.color}`}>{cfg.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Query results */}
      {q && (
        <div className="space-y-6">
          {/* Type filters */}
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => {
              const count = f.value === 'all' ? total : (grouped?.[f.value as ContentType]?.length ?? 0);
              return (
                <Link key={f.value} href={filterHref(f.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-body-sm font-medium border transition-all ${
                    typeParam === f.value
                      ? 'bg-primary-500 border-primary-500 text-white'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300'
                  }`}
                >
                  {f.label}
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${typeParam === f.value ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Results count */}
          <p className="text-body-sm text-neutral-500">
            {total > 0
              ? `${total} result${total !== 1 ? 's' : ''} for "${q}"`
              : `No results for "${q}"`}
          </p>

          {/* Typo correction */}
          {correction && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-body-sm text-blue-800">
              Did you mean{' '}
              <Link href={`/search?q=${encodeURIComponent(correction)}`} className="font-semibold underline hover:text-blue-900">
                {correction}
              </Link>?
            </div>
          )}

          {/* Result cards */}
          {paged.length > 0 ? (
            <div className="space-y-3">
              {paged.map((r) => <ResultCard key={`${r.type}-${r.id}`} result={r} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-dashed border-neutral-200 rounded-2xl">
              <Search size={40} className="text-neutral-300 mx-auto mb-4" />
              <p className="font-display font-semibold text-neutral-500 text-heading-md mb-2">No results found</p>
              <p className="text-body-sm text-neutral-400 mb-6">Try different keywords, or browse a category below</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.slice(0, 5).map((s) => (
                  <Link key={s} href={`/search?q=${encodeURIComponent(s)}`}
                    className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-body-sm font-medium hover:bg-primary-100 transition-colors"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              {page > 1 && (
                <Link href={pageHref(page - 1)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-body-sm text-neutral-600 hover:border-primary-300 transition-colors">
                  ← Previous
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={pageHref(p)}
                  className={`px-4 py-2 rounded-xl text-body-sm font-medium border transition-colors ${
                    p === page ? 'bg-primary-500 border-primary-500 text-white' : 'border-neutral-200 text-neutral-600 hover:border-primary-300'
                  }`}
                >
                  {p}
                </Link>
              ))}
              {page < totalPages && (
                <Link href={pageHref(page + 1)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-body-sm text-neutral-600 hover:border-primary-300 transition-colors">
                  Next →
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
