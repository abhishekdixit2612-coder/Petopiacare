'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, Check, RefreshCw, ExternalLink, Copy } from 'lucide-react';
import type { UnsplashImage } from '@/types/unsplash';

interface Props {
  searchQuery?: string;
  onImageSelect: (image: UnsplashImage) => void;
  onClose: () => void;
  selectedImage?: UnsplashImage | null;
}

const SUGGESTED_QUERIES = [
  'golden retriever dog', 'labrador puppy', 'dog training',
  'dog food nutrition', 'vet dog health', 'dog running outdoor',
  'puppy cute adorable', 'dog collar leash', 'indian dog',
];

function ImageSkeleton() {
  return (
    <div className="aspect-square bg-neutral-200 rounded-xl animate-pulse" />
  );
}

export default function UnsplashImagePicker({ searchQuery: initialQuery = '', onImageSelect, onClose, selectedImage }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async (q: string, p = 1) => {
    if (!q.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/unsplash/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, count: 9, page: p }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'Search failed');
      setImages(p === 1 ? data.images : (prev) => [...prev, ...data.images] as any);
      setTotalPages(data.totalPages);
      setPage(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search images');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search on mount if initial query provided
  useEffect(() => {
    if (initialQuery.trim()) search(initialQuery);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [initialQuery, search]);

  // Debounced search on query change
  useEffect(() => {
    if (!query.trim()) { setImages([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query, 1), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  const handleSelect = (img: UnsplashImage) => {
    // Trigger download tracking (required by Unsplash ToS)
    fetch('/api/unsplash/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '__download__', downloadLocation: img.links.download_location }),
    }).catch(() => {});
    onImageSelect(img);
    onClose();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100">
          <Search size={18} className="text-neutral-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Unsplash (e.g. 'golden retriever puppy')..."
            className="flex-1 text-body-md text-neutral-900 bg-transparent outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); setImages([]); }} className="text-neutral-400 hover:text-neutral-600">
              <X size={16} />
            </button>
          )}
          <button onClick={onClose} className="ml-2 text-neutral-400 hover:text-neutral-600 p-1">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Suggestions */}
          {!query && (
            <div className="p-5">
              <p className="text-label-sm text-neutral-400 uppercase tracking-wider mb-3">Suggested searches</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUERIES.map((q) => (
                  <button key={q} onClick={() => setQuery(q)}
                    className="text-body-sm bg-neutral-100 hover:bg-primary-50 hover:text-primary-600 text-neutral-700 px-3 py-1.5 rounded-full transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="m-5 p-4 bg-error-50 border border-error-200 rounded-xl text-body-sm text-error-700 flex items-center gap-3">
              <span className="flex-1">{error}</span>
              <button onClick={() => search(query)} className="flex items-center gap-1 font-medium hover:underline">
                <RefreshCw size={13} /> Retry
              </button>
            </div>
          )}

          {/* Grid */}
          <div className="p-5 grid grid-cols-3 gap-3">
            {loading && images.length === 0
              ? Array.from({ length: 9 }).map((_, i) => <ImageSkeleton key={i} />)
              : images.map((img) => {
                  const isSelected = selectedImage?.id === img.id;
                  const isHovered = hoveredId === img.id;
                  return (
                    <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square cursor-pointer"
                      onMouseEnter={() => setHoveredId(img.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => handleSelect(img)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.urls.small} alt={img.alt_description ?? 'Unsplash image'}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />

                      {/* Hover overlay */}
                      {(isHovered || isSelected) && (
                        <div className={`absolute inset-0 flex flex-col justify-between p-3 ${isSelected ? 'bg-primary-500/70' : 'bg-black/50'}`}>
                          <div className="flex justify-end">
                            {isSelected && (
                              <span className="bg-white rounded-full p-1"><Check size={14} className="text-primary-500" /></span>
                            )}
                          </div>
                          <div>
                            <p className="text-white text-[10px] truncate">
                              by <span className="font-semibold">{img.user.name}</span>
                            </p>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleSelect(img); }}
                              className="mt-1.5 w-full text-center bg-white text-neutral-900 font-bold text-[11px] py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                            >
                              {isSelected ? '✓ Selected' : 'Use this image'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
            }
          </div>

          {/* Load more */}
          {images.length > 0 && page < totalPages && (
            <div className="px-5 pb-5 text-center">
              <button onClick={() => search(query, page + 1)} disabled={loading}
                className="flex items-center gap-2 mx-auto text-body-sm text-primary-600 font-medium hover:text-primary-700 disabled:opacity-50">
                {loading ? <RefreshCw size={14} className="animate-spin" /> : null}
                {loading ? 'Loading...' : 'Show more results'}
              </button>
            </div>
          )}

          {/* No results */}
          {!loading && query && images.length === 0 && !error && (
            <div className="p-10 text-center">
              <p className="text-body-md font-medium text-neutral-500 mb-2">No images found for &ldquo;{query}&rdquo;</p>
              <p className="text-body-sm text-neutral-400 mb-4">Try different keywords</p>
              <button onClick={() => setQuery('')} className="text-primary-600 font-medium text-body-sm hover:underline">
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Selected preview + footer */}
        {selectedImage && (
          <div className="border-t border-neutral-100 p-4 flex items-center gap-4 bg-neutral-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage.urls.thumb} alt="Selected" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-medium text-neutral-900 truncate">Selected: {selectedImage.alt_description ?? selectedImage.id}</p>
              <p className="text-label-sm text-neutral-400">
                Photo by <a href={`https://unsplash.com/@${selectedImage.user.username}`} target="_blank" rel="noopener noreferrer" className="underline">{selectedImage.user.name}</a> on Unsplash
              </p>
            </div>
            <button onClick={() => copyUrl(selectedImage.urls.regular)}
              className="flex items-center gap-1.5 text-body-sm text-neutral-500 hover:text-neutral-700 transition-colors border border-neutral-200 px-3 py-1.5 rounded-lg">
              {copiedUrl ? <Check size={13} className="text-success-500" /> : <Copy size={13} />}
              {copiedUrl ? 'Copied' : 'Copy URL'}
            </button>
          </div>
        )}

        {/* Unsplash attribution footer */}
        <div className="border-t border-neutral-100 px-5 py-2.5 flex items-center justify-between bg-white">
          <p className="text-[10px] text-neutral-400">Photos from <a href="https://unsplash.com?utm_source=petopiacare&utm_medium=referral" target="_blank" rel="noopener noreferrer" className="underline">Unsplash</a></p>
          <button onClick={onClose} className="text-body-sm text-neutral-500 hover:text-neutral-700 font-medium">Cancel</button>
        </div>
      </div>
    </div>
  );
}
