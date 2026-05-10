'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, Plus, ArrowLeft, Download, AlertCircle, Search } from 'lucide-react';

interface DigitalProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  category: string;
  tier: string;
  badge: string;
  rating: number;
  review_count: number;
  created_at: string;
}

const tierColors: Record<string, string> = {
  FREE: 'bg-green-50 text-green-700',
  PAID: 'bg-blue-50 text-blue-700',
};

const badgeColors: Record<string, string> = {
  Free: 'bg-green-100 text-green-700',
  Bestseller: 'bg-amber-100 text-amber-700',
  Premium: 'bg-purple-100 text-purple-700',
  New: 'bg-blue-100 text-blue-700',
  'Best Value': 'bg-rose-100 text-rose-700',
};

export default function AdminDigitalProducts() {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableExists, setTableExists] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/dp');
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          if (err.error?.includes('does not exist')) setTableExists(false);
          return;
        }
        const { products } = await res.json();
        setProducts(products || []);
      } catch (e) {
        console.error('Fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this product?')) return;
    const res = await fetch(`/api/admin/dp/${id}`, { method: 'DELETE' });
    if (res.ok) setProducts(prev => prev.filter(p => p.id !== id));
  };

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-bold mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-display text-display-sm font-semibold text-neutral-900">Digital Products</h1>
            <p className="text-neutral-500 text-body-sm mt-1">Manage free guides, eBooks, and premium courses.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/digital-products/seed"
              className="flex items-center gap-2 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all">
              <Download size={16} /> Import All
            </Link>
            <Link href="/admin/digital-products/new"
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md text-sm">
              <Plus size={18} /> New Product
            </Link>
          </div>
        </div>

        {!tableExists && !loading && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-3 mb-6">
            <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-800 mb-1">Database table not set up yet</p>
              <p className="text-sm text-rose-700 mb-3">The <code className="bg-rose-100 px-1 rounded">digital_products</code> table doesn&apos;t exist. Run the one-time setup to create it and import all products.</p>
              <Link href="/admin/digital-products/seed"
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
                Run Setup &amp; Import Products →
              </Link>
            </div>
          </div>
        )}

        <div className="mb-5 bg-white p-2 rounded-xl shadow-sm border border-neutral-100 flex items-center gap-2">
          <Search size={15} className="text-neutral-400 ml-2" />
          <input type="text" placeholder="Search by title or category..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-2 py-2 bg-transparent text-neutral-900 outline-none text-body-sm" />
        </div>

        {loading ? (
          <div className="text-center py-20 text-neutral-400 font-bold animate-pulse">Loading Products...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 border-b border-neutral-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider w-2/5">Product</th>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-center">Tier</th>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-center">Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Badge</th>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map(product => (
                    <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-neutral-900 text-body-sm mb-0.5 line-clamp-1">{product.title}</p>
                        <p className="text-xs text-neutral-400 font-mono">/{product.slug}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-neutral-100 px-2 py-1 rounded text-xs tracking-wide text-neutral-600">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${tierColors[product.tier] ?? 'bg-neutral-100 text-neutral-700'}`}>
                          {product.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-sm">
                        {product.price === 0
                          ? <span className="text-green-600 font-bold">FREE</span>
                          : <span className="text-neutral-700">₹{product.price}</span>}
                      </td>
                      <td className="px-6 py-4">
                        {product.badge && (
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColors[product.badge] ?? 'bg-neutral-100 text-neutral-600'}`}>
                            {product.badge}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 flex items-center justify-end gap-2">
                        <Link href={`/admin/digital-products/${product.id}`}
                          className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit">
                          <Edit2 size={15} />
                        </Link>
                        <button onClick={() => handleDelete(product.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filtered.length === 0 && !loading && tableExists && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-300 mt-4">
            <p className="text-neutral-500 font-semibold mb-3">No products found.</p>
            <div className="flex justify-center gap-4">
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-primary-600 font-bold hover:underline text-sm">
                  Clear search
                </button>
              )}
              <Link href="/admin/digital-products/seed" className="text-primary-600 font-bold hover:underline text-sm">
                Import all products →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
