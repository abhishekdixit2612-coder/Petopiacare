'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Plus, Trash2, AlertCircle, Upload, Loader2, ExternalLink, Search, X } from 'lucide-react';
import Link from 'next/link';
import UnsplashImagePicker from '@/components/UnsplashImagePicker';
import type { UnsplashImage } from '@/types/unsplash';

const CATEGORIES = ['Checklist', 'Guide', 'eBook', 'Course'];
const BADGES = ['', 'Free', 'Bestseller', 'Premium', 'New', 'Best Value'];

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

export default function NewDigitalProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '', slug: '', price: '0', category: '', tier: 'FREE',
    short_description: '', thumbnail_url: '', download_url: '',
    rating: '4.9', review_count: '0', badge: 'Free', features: [''],
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [error, setError] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUnsplashSelect = (image: UnsplashImage) => {
    setSelectedImage(image);
    setFormData(prev => ({ ...prev, thumbnail_url: image.urls.regular }));
    setShowImagePicker(false);
  };

  const getSearchQuery = () => {
    if (formData.title.trim()) return formData.title.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').slice(0, 40);
    if (formData.category) return `${formData.category.toLowerCase()} dog`;
    return 'dog pet india';
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      // Step 1: get signed URL from server (tiny request, no body size issue)
      const sigRes = await fetch(`/api/admin/upload?filename=${encodeURIComponent(file.name)}`);
      const sigData = await sigRes.json();
      if (!sigRes.ok) throw new Error(sigData.error ?? 'Could not get upload URL');

      // Step 2: upload file directly to Supabase Storage (bypasses Next.js size limit)
      const uploadRes = await fetch(sigData.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error('Upload to storage failed');

      setFormData(prev => ({ ...prev, download_url: sigData.publicUrl }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({ ...prev, title, slug: generateSlug(title) }));
  };

  const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tier = e.target.value;
    setFormData(prev => ({
      ...prev, tier,
      badge: tier === 'FREE' ? 'Free' : prev.badge === 'Free' ? '' : prev.badge,
      price: tier === 'FREE' ? '0' : prev.price,
    }));
  };

  const updateFeature = (idx: number, val: string) => {
    const features = [...formData.features];
    features[idx] = val;
    setFormData(prev => ({ ...prev, features }));
  };

  const addFeature = () => setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  const removeFeature = (idx: number) =>
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/dp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        tier: formData.tier,
        short_description: formData.short_description,
        thumbnail_url: formData.thumbnail_url,
        download_url: formData.download_url,
        rating: parseFloat(formData.rating) || 4.9,
        review_count: parseInt(formData.review_count) || 0,
        badge: formData.badge,
        features: formData.features.filter(Boolean),
      }),
    });
    const data = await res.json();

    setLoading(false);
    if (!res.ok) { setError(data.error ?? 'Failed to create product'); return; }
    router.push('/admin/digital-products');
  };

  const inputCls = 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/digital-products" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Digital Products
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">New Digital Product</h1>
            <Link href="/admin/digital-products/seed"
              className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded-lg transition-colors">
              Import All 10 →
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm font-semibold">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleTitleChange} required className={inputCls} placeholder="e.g., Dog First Aid Guide" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className={`${inputCls} font-mono`} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} required className={inputCls}>
                  <option value="">Select...</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tier</label>
                <select name="tier" value={formData.tier} onChange={handleTierChange} className={inputCls}>
                  <option value="FREE">FREE</option>
                  <option value="PAID">PAID</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Badge</label>
                <select name="badge" value={formData.badge} onChange={handleChange} className={inputCls}>
                  {BADGES.map(b => <option key={b} value={b}>{b || '(none)'}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange}
                  min="0" step="1" disabled={formData.tier === 'FREE'}
                  className={`${inputCls} disabled:bg-gray-50 disabled:text-gray-400`} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                <input type="number" name="rating" value={formData.rating} onChange={handleChange} min="0" max="5" step="0.1" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Review Count</label>
                <input type="number" name="review_count" value={formData.review_count} onChange={handleChange} min="0" className={inputCls} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Short Description</label>
              <textarea name="short_description" value={formData.short_description} onChange={handleChange} rows={3} className={inputCls + ' resize-none'} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image</label>
                {formData.thumbnail_url && (
                  <div className="relative mb-2 rounded-xl overflow-hidden h-32 bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setSelectedImage(null); setFormData(p => ({ ...p, thumbnail_url: '' })); }}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-lg transition-colors">
                      <X size={13} />
                    </button>
                    {selectedImage && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1">
                        Photo by {selectedImage.user.name} on Unsplash
                      </div>
                    )}
                  </div>
                )}
                <button type="button" onClick={() => setShowImagePicker(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors mb-2">
                  <Search size={14} /> Search Unsplash
                </button>
                <input type="url" name="thumbnail_url" value={formData.thumbnail_url} onChange={handleChange}
                  placeholder="Or paste image URL..." className={`${inputCls} font-mono text-xs`} />
                {showImagePicker && (
                  <UnsplashImagePicker
                    searchQuery={getSearchQuery()}
                    selectedImage={selectedImage}
                    onImageSelect={handleUnsplashSelect}
                    onClose={() => setShowImagePicker(false)}
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Download File</label>
                <input ref={fileRef} type="file" accept=".pdf,.zip,.epub,.mp4,.docx" onChange={handleFileUpload} className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="w-full mb-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50 rounded-xl py-3 text-sm font-semibold text-gray-500 hover:text-primary-600 transition-all disabled:opacity-60">
                  {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : <><Upload size={14} /> Upload PDF / ZIP</>}
                </button>
                {uploadError && (
                  <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-2">
                    {uploadError.includes('Bucket not found') ? (
                      <>
                        <strong>Storage bucket missing.</strong> Go to{' '}
                        <a href="https://supabase.com/dashboard/project/ftvaewmvghxkhwjgishc/storage/buckets" target="_blank" rel="noreferrer" className="underline font-bold">
                          Supabase → Storage
                        </a>{' '}
                        → New bucket → name: <code className="bg-amber-100 px-1 rounded">digital-downloads</code> → set to <strong>Public</strong>.
                      </>
                    ) : uploadError}
                  </div>
                )}
                <input type="url" name="download_url" value={formData.download_url} onChange={handleChange}
                  placeholder="Or paste URL (Google Drive, Dropbox…)"
                  className={`${inputCls} font-mono text-xs`} />
                {formData.download_url && (
                  <a href={formData.download_url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline mt-1">
                    <ExternalLink size={11} /> Test link
                  </a>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Features / What&apos;s Included</label>
              <div className="space-y-2">
                {formData.features.map((f, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <span className="text-primary-500 font-bold shrink-0">✓</span>
                    <input type="text" value={f} onChange={e => updateFeature(idx, e.target.value)}
                      placeholder={`Feature ${idx + 1}...`} className={inputCls} />
                    <button type="button" onClick={() => removeFeature(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addFeature}
                className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700">
                <Plus size={12} /> Add Feature
              </button>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button type="submit" disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-md transition-all disabled:opacity-60">
                {loading ? 'Creating...' : <><Send size={17} /> Create Product</>}
              </button>
              <Link href="/admin/digital-products"
                className="px-6 flex items-center justify-center border border-gray-300 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
