'use client';

import { useState } from 'react';
import { Search, RefreshCw, Check, AlertCircle, Info, Zap } from 'lucide-react';
import UnsplashImagePicker from '@/components/UnsplashImagePicker';
import type { UnsplashImage } from '@/types/unsplash';
import Link from 'next/link';

export default function AdminImagesPage() {
  const [testQuery, setTestQuery] = useState('golden retriever dog');
  const [migrating, setMigrating] = useState(false);
  const [migrateResult, setMigrateResult] = useState<{ totalUpdated: number; summary: any[] } | null>(null);
  const [migrateError, setMigrateError] = useState('');

  const runMigration = async () => {
    setMigrating(true);
    setMigrateResult(null);
    setMigrateError('');
    try {
      const res = await fetch('/api/admin/populate-images', { method: 'POST' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'Migration failed');
      setMigrateResult(data);
    } catch (err) {
      setMigrateError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setMigrating(false);
    }
  };
  const [showPicker, setShowPicker] = useState(false);
  const [lastSelected, setLastSelected] = useState<UnsplashImage | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testImages, setTestImages] = useState<UnsplashImage[]>([]);
  const [testError, setTestError] = useState('');
  const [apiStatus, setApiStatus] = useState<'unknown' | 'ok' | 'error'>('unknown');

  const testSearch = async () => {
    if (!testQuery.trim()) return;
    setTestLoading(true);
    setTestError('');
    setTestImages([]);
    try {
      const res = await fetch('/api/unsplash/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery, count: 6 }),
      });
      const data = await res.json();
      if (!data.success) {
        setApiStatus('error');
        setTestError(data.error ?? 'API error');
      } else {
        setApiStatus('ok');
        setTestImages(data.images);
      }
    } catch (err) {
      setApiStatus('error');
      setTestError('Network error — check if server is running');
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:text-gray-700 mb-2 block">← Back to Dashboard</Link>
            <h1 className="text-3xl font-bold text-gray-900">Image Management</h1>
            <p className="text-gray-500 mt-1">Unsplash API integration and image search testing</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium ${
            apiStatus === 'ok' ? 'bg-green-50 border-green-200 text-green-700' :
            apiStatus === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
            'bg-gray-100 border-gray-200 text-gray-600'
          }`}>
            {apiStatus === 'ok' ? <Check size={15} /> : apiStatus === 'error' ? <AlertCircle size={15} /> : <Info size={15} />}
            {apiStatus === 'ok' ? 'API Connected' : apiStatus === 'error' ? 'API Error' : 'API Status Unknown'}
          </div>
        </div>

        {/* ── POPULATE ALL IMAGES (main CTA) ── */}
        <div className="bg-forest-500 rounded-2xl p-6 mb-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="flex-1">
              <h2 className="font-bold text-xl mb-1 flex items-center gap-2">
                <Zap size={20} className="text-yellow-300" /> Populate All Website Images
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Fetches Unsplash images for all breeds, life stages, health conditions, nutrition guides, and behavior topics in the database.
                Only fills rows where <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs">image_url</code> is currently empty.
                Takes ~2 minutes (rate limited to 40 req/min).
              </p>
            </div>
            <div className="flex-shrink-0">
              <button onClick={runMigration} disabled={migrating}
                className="flex items-center gap-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-white/20 disabled:cursor-not-allowed text-white font-bold px-6 py-3.5 rounded-xl transition-colors text-sm whitespace-nowrap">
                {migrating ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
                {migrating ? 'Fetching images… (please wait)' : 'Run Image Population'}
              </button>
            </div>
          </div>

          {/* Result */}
          {migrateResult && (
            <div className="mt-4 bg-white/10 rounded-xl p-4">
              <p className="font-bold text-green-300 flex items-center gap-2 mb-3">
                <Check size={16} /> Done! {migrateResult.totalUpdated} images added to database
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {migrateResult.summary.map((s: any) => (
                  <div key={s.table} className="text-xs bg-white/10 rounded-lg px-3 py-2">
                    <span className="font-semibold text-white">{s.table}</span>
                    <span className="text-white/60 ml-2">+{s.updated} images</span>
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-xs mt-3">Refresh any Learn Hub page to see the new images.</p>
            </div>
          )}

          {migrateError && (
            <div className="mt-4 bg-red-500/20 border border-red-400/30 rounded-xl p-4 text-sm text-red-200">
              {migrateError}
            </div>
          )}
        </div>

        {/* Setup instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex gap-4">
          <Info size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-800 text-sm mb-1">Setup Required</p>
            <p className="text-amber-700 text-sm mb-2">
              Add your Unsplash access key to <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">.env.local</code>:
            </p>
            <code className="block bg-amber-100 text-amber-900 font-mono text-xs p-3 rounded-lg">
              UNSPLASH_ACCESS_KEY=your_access_key_here
            </code>
            <p className="text-amber-600 text-xs mt-2">
              Get a free key at <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer" className="underline">unsplash.com/developers</a> — free tier gives 50 requests/hour.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test search panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Test Image Search</h2>

            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={testQuery}
                  onChange={(e) => setTestQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && testSearch()}
                  placeholder="Search query..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                />
              </div>
              <button onClick={testSearch} disabled={testLoading}
                className="flex items-center gap-2 bg-forest-500 hover:bg-forest-600 text-white font-bold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {testLoading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                Test
              </button>
            </div>

            {testError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 mb-4">
                {testError}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {testImages.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group cursor-pointer"
                  onClick={() => { setLastSelected(img); }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.urls.small} alt={img.alt_description ?? ''} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-white text-[9px] truncate">{img.user.name}</p>
                  </div>
                </div>
              ))}
              {testLoading && Array.from({length: 6}).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-gray-200 animate-pulse" />
              ))}
            </div>

            {/* Preset queries */}
            <div className="mt-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Quick tests</p>
              <div className="flex flex-wrap gap-1.5">
                {['labrador retriever', 'puppy training', 'dog food bowl', 'vet examination', 'dog harness walk'].map((q) => (
                  <button key={q} onClick={() => { setTestQuery(q); }}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Image picker demo */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Image Picker Demo</h2>
            <p className="text-sm text-gray-500 mb-4">
              The image picker is integrated into the blog post editor. Test it here.
            </p>

            <button onClick={() => setShowPicker(true)}
              className="w-full flex items-center justify-center gap-2 bg-forest-500 hover:bg-forest-600 text-white font-bold py-3 rounded-xl transition-colors mb-4">
              <Search size={16} /> Open Image Picker
            </button>

            {lastSelected && (
              <div className="rounded-xl overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={lastSelected.urls.small} alt={lastSelected.alt_description ?? ''} className="w-full h-40 object-cover" />
                <div className="p-3 bg-gray-50">
                  <p className="text-xs font-medium text-gray-700 truncate">{lastSelected.alt_description ?? lastSelected.id}</p>
                  <p className="text-xs text-gray-400">by {lastSelected.user.name}</p>
                  <code className="block mt-2 text-[10px] bg-gray-100 p-2 rounded font-mono break-all text-gray-600">
                    {lastSelected.urls.regular}
                  </code>
                </div>
              </div>
            )}

            {showPicker && (
              <UnsplashImagePicker
                searchQuery="dog india pet"
                selectedImage={lastSelected}
                onImageSelect={(img) => { setLastSelected(img); }}
                onClose={() => setShowPicker(false)}
              />
            )}
          </div>
        </div>

        {/* Migration info */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-3">Bulk Image Migration</h2>
          <p className="text-sm text-gray-600 mb-4">
            To populate all content tables (breeds, life stages, health conditions, etc.) with Unsplash images automatically, run the migration script from your terminal:
          </p>
          <code className="block bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-xl">
            npx ts-node --project tsconfig.json scripts/migrateImagesToUnsplash.ts
          </code>
          <p className="text-xs text-gray-400 mt-3">
            The script only updates rows where image_url is NULL or empty. It respects Unsplash rate limits (50 requests/hour on free tier).
          </p>
        </div>
      </div>
    </div>
  );
}
