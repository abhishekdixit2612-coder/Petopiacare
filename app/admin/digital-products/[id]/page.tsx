'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface FormData {
  title: string;
  slug: string;
  price: string;
  category: string;
  tier: string;
  short_description: string;
  thumbnail_url: string;
  download_url: string;
  rating: string;
  review_count: string;
  badge: string;
  features: string[];
}

const CATEGORIES = ['Checklist', 'Guide', 'eBook', 'Course'];
const BADGES = ['', 'Free', 'Bestseller', 'Premium', 'New', 'Best Value'];

export default function EditDigitalProduct() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    title: '', slug: '', price: '0', category: '', tier: 'FREE',
    short_description: '', thumbnail_url: '', download_url: '',
    rating: '4.9', review_count: '0', badge: '', features: [''],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/admin/dp/${id}`);
      if (!res.ok) {
        setError('Product not found');
        setLoading(false);
        return;
      }
      const { product: data } = await res.json();
      setFormData({
        title: data.title ?? '',
        slug: data.slug ?? '',
        price: String(data.price ?? 0),
        category: data.category ?? '',
        tier: data.tier ?? 'FREE',
        short_description: data.short_description ?? '',
        thumbnail_url: data.thumbnail_url ?? '',
        download_url: data.download_url ?? '',
        rating: String(data.rating ?? 4.9),
        review_count: String(data.review_count ?? 0),
        badge: data.badge ?? '',
        features: Array.isArray(data.features) ? data.features : [''],
      });
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'tier') {
      setFormData(prev => ({
        ...prev,
        tier: value,
        badge: value === 'FREE' ? 'Free' : prev.badge === 'Free' ? '' : prev.badge,
        price: value === 'FREE' ? '0' : prev.price,
      }));
    }
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
    setSaving(true);
    setError('');

    const res = await fetch(`/api/admin/dp/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.title,
        slug: formData.slug,
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
    const result = await res.json();
    setSaving(false);
    if (!res.ok) { setError(result.error ?? 'Save failed'); return; }
    router.push('/admin/digital-products');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 font-bold animate-pulse">Loading product...</p>
      </div>
    );
  }

  const inputCls = 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/digital-products" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Digital Products
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">Edit Product</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm font-semibold">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title + Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className={`${inputCls} font-mono`} />
              </div>
            </div>

            {/* Category + Tier + Badge */}
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
                <select name="tier" value={formData.tier} onChange={handleChange} className={inputCls}>
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

            {/* Price + Rating + Reviews */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange}
                  min="0" step="1" disabled={formData.tier === 'FREE'}
                  className={`${inputCls} disabled:bg-gray-50 disabled:text-gray-400`} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Rating (0–5)</label>
                <input type="number" name="rating" value={formData.rating} onChange={handleChange}
                  min="0" max="5" step="0.1" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Review Count</label>
                <input type="number" name="review_count" value={formData.review_count} onChange={handleChange}
                  min="0" className={inputCls} />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Short Description</label>
              <textarea name="short_description" value={formData.short_description} onChange={handleChange}
                rows={3} className={inputCls + ' resize-none'} />
            </div>

            {/* Thumbnail + Download URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Thumbnail URL</label>
                {formData.thumbnail_url && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={formData.thumbnail_url} alt="" className="w-full h-28 object-cover rounded-xl mb-2" />
                )}
                <input type="url" name="thumbnail_url" value={formData.thumbnail_url} onChange={handleChange}
                  placeholder="https://..." className={`${inputCls} font-mono text-xs`} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Download URL</label>
                <input type="url" name="download_url" value={formData.download_url} onChange={handleChange}
                  placeholder="https://..." className={`${inputCls} font-mono text-xs`} />
                <p className="text-xs text-gray-400 mt-1">PDF, ZIP, or external link</p>
              </div>
            </div>

            {/* Features */}
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
                className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">
                <Plus size={12} /> Add Feature
              </button>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button type="submit" disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-md transition-all disabled:opacity-60">
                {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
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
