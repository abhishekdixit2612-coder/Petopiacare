'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Clock } from 'lucide-react';
import type { SearchBarProps } from '@/types/components';

const STORAGE_KEY = 'petopia_learn_recent_searches';
const MAX_RECENT = 5;

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  try {
    const existing = getRecentSearches().filter((s) => s !== query);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([query, ...existing].slice(0, MAX_RECENT)));
  } catch {}
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search breeds, conditions, guides...',
  suggestions = [],
  autoFocus = false,
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => {
      onSearch(query.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveRecentSearch(query.trim());
    setRecent(getRecentSearches());
    onSearch(query.trim());
    setOpen(false);
  };

  const handleSelect = useCallback((value: string) => {
    setQuery(value);
    saveRecentSearch(value);
    setRecent(getRecentSearches());
    onSearch(value);
    setOpen(false);
    inputRef.current?.blur();
  }, [onSearch]);

  const filteredSuggestions = query.trim()
    ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  const showDropdown = open && (filteredSuggestions.length > 0 || recent.length > 0);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} role="search">
        <div className="relative flex items-center">
          <Search size={16} className="absolute left-3.5 text-neutral-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            autoComplete="off"
            aria-label="Search"
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-neutral-200 rounded-xl text-body-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="absolute right-3.5 text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </form>

      {showDropdown && (
        <div
          role="listbox"
          aria-label="Search suggestions"
          className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 overflow-hidden"
        >
          {filteredSuggestions.length > 0 && (
            <div>
              <p className="px-4 py-2 text-label-sm text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                Suggestions
              </p>
              {filteredSuggestions.slice(0, 5).map((s) => (
                <button
                  key={s}
                  role="option"
                  aria-selected={false}
                  onClick={() => handleSelect(s)}
                  className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50 text-body-sm text-neutral-700 transition-colors"
                >
                  <Search size={13} className="text-neutral-300 flex-shrink-0" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {recent.length > 0 && (
            <div>
              <p className="px-4 py-2 text-label-sm text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                Recent Searches
              </p>
              {recent.map((s) => (
                <button
                  key={s}
                  role="option"
                  aria-selected={false}
                  onClick={() => handleSelect(s)}
                  className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 text-body-sm text-neutral-600 transition-colors"
                >
                  <Clock size={13} className="text-neutral-300 flex-shrink-0" />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
