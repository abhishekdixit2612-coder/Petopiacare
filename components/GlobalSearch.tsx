'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, TrendingUp, Dog, Heart, Utensils, Brain, BookOpen, ShoppingBag, ArrowRight } from 'lucide-react';
import { searchAll, type SearchResult, type ContentType } from '@/lib/search-queries';

const STORAGE_KEY = 'petopia_global_recent';
const MAX_RECENT = 6;

const TYPE_CONFIG: Record<ContentType, { label: string; icon: React.ReactNode; color: string }> = {
  breed:     { label: 'Breed',     icon: <Dog size={13} />,         color: 'text-purple-600 bg-purple-50' },
  health:    { label: 'Health',    icon: <Heart size={13} />,       color: 'text-rose-600 bg-rose-50' },
  nutrition: { label: 'Nutrition', icon: <Utensils size={13} />,    color: 'text-green-600 bg-green-50' },
  behavior:  { label: 'Behaviour', icon: <Brain size={13} />,       color: 'text-amber-600 bg-amber-50' },
  blog:      { label: 'Blog',      icon: <BookOpen size={13} />,    color: 'text-blue-600 bg-blue-50' },
  product:   { label: 'Product',   icon: <ShoppingBag size={13} />, color: 'text-primary-600 bg-primary-50' },
};

const TRENDING = [
  'Labrador Retriever', 'Tick fever India', 'Puppy feeding schedule',
  'Leash pulling', 'Separation anxiety', 'Hip dysplasia',
];

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { return []; }
}
function saveRecent(q: string) {
  try {
    const prev = getRecent().filter((s) => s !== q);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([q, ...prev].slice(0, MAX_RECENT)));
  } catch {}
}
function clearRecentStorage() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

function ResultItem({ result, onClose }: { result: SearchResult; onClose: () => void }) {
  const cfg = TYPE_CONFIG[result.type];
  return (
    <Link href={result.url} onClick={onClose}
      className="flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors group"
    >
      {result.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={result.image_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-neutral-100" />
      ) : (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
          {cfg.icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-900 text-body-sm group-hover:text-primary-600 transition-colors truncate">{result.title}</p>
        {result.excerpt && (
          <p className="text-label-sm text-neutral-400 line-clamp-1 mt-0.5">{result.excerpt}</p>
        )}
      </div>
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${cfg.color}`}>
        {cfg.label}
      </span>
    </Link>
  );
}

export default function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Open on Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setRecent(getRecent());
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Debounced search
  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await searchAll(q, { limit: 12 });
      const flat = [
        ...res.breed, ...res.health, ...res.nutrition,
        ...res.behavior, ...res.blog, ...res.product,
      ];
      setResults(flat);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { void runSearch(q); }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveRecent(query.trim());
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectRecent = (q: string) => {
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const close = () => setOpen(false);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open search"
        className="hidden md:flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-500 rounded-lg px-3 py-2 text-body-sm transition-colors"
      >
        <Search size={15} />
        <span>Search...</span>
        <kbd className="ml-2 text-[10px] bg-white border border-neutral-200 px-1.5 py-0.5 rounded text-neutral-400 hidden lg:inline">⌘K</kbd>
      </button>

      {/* Mobile search icon */}
      <button onClick={() => setOpen(true)} aria-label="Open search" className="md:hidden p-2 text-neutral-600 hover:text-primary-600 transition-colors">
        <Search size={20} />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 px-4" role="dialog" aria-modal aria-label="Search">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

          {/* Panel */}
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
              <Search size={18} className="text-neutral-400 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={handleChange}
                placeholder="Search breeds, health topics, products..."
                className="flex-1 text-body-md text-neutral-900 bg-transparent outline-none placeholder-neutral-400"
              />
              {query && (
                <button type="button" onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors">
                  <X size={16} />
                </button>
              )}
              <button type="button" onClick={close} className="text-label-sm text-neutral-400 hover:text-neutral-600 pl-2 border-l border-neutral-200">
                Esc
              </button>
            </form>

            <div className="overflow-y-auto flex-1">
              {/* Loading */}
              {loading && (
                <div className="flex justify-center py-8">
                  <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
                </div>
              )}

              {/* Results */}
              {!loading && results.length > 0 && (
                <div>
                  {results.slice(0, 8).map((r) => <ResultItem key={`${r.type}-${r.id}`} result={r} onClose={close} />)}
                  {results.length > 8 && (
                    <div className="px-4 py-3 border-t border-neutral-100">
                      <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={close}
                        className="flex items-center justify-between text-primary-600 font-medium text-body-sm hover:text-primary-700 transition-colors"
                      >
                        See all {results.length}+ results <ArrowRight size={14} />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* No results */}
              {!loading && query.trim() && results.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-body-md font-medium text-neutral-500 mb-1">No results for &ldquo;{query}&rdquo;</p>
                  <p className="text-body-sm text-neutral-400">Try different keywords or browse a category</p>
                </div>
              )}

              {/* Empty state: recent + trending */}
              {!query.trim() && !loading && (
                <div className="p-4 space-y-5">
                  {recent.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-label-sm font-semibold text-neutral-400 uppercase tracking-wider">Recent</p>
                        <button onClick={() => { clearRecentStorage(); setRecent([]); }}
                          className="text-label-sm text-neutral-400 hover:text-neutral-600 transition-colors">Clear</button>
                      </div>
                      <div className="space-y-1">
                        {recent.map((q) => (
                          <button key={q} onClick={() => handleSelectRecent(q)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-50 text-body-sm text-neutral-600 text-left transition-colors"
                          >
                            <Clock size={13} className="text-neutral-300 flex-shrink-0" /> {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-label-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <TrendingUp size={12} /> Trending
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING.map((t) => (
                        <button key={t} onClick={() => { setQuery(t); void runSearch(t); }}
                          className="text-body-sm bg-neutral-100 hover:bg-primary-50 hover:text-primary-700 text-neutral-700 px-3 py-1.5 rounded-full transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-label-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">Browse</p>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
                        <Link key={type} href={type === 'product' ? '/products' : type === 'blog' ? '/blog' : `/learn/${type === 'breed' ? 'breed-guide' : type === 'health' ? 'health-wellness' : type === 'nutrition' ? 'nutrition' : 'behavior-training'}`}
                          onClick={close}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-body-sm font-medium transition-colors ${cfg.color}`}
                        >
                          {cfg.icon} {cfg.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
