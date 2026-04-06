'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Edit2, Trash2, Plus, ArrowLeft } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  created_at: string;
  variants?: Array<{ price: number }>;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('id,name,category,created_at,variants(price)')
          .order('created_at', { ascending: false });

        setProducts((data as Product[]) || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to permanently delete this product?')) return;

    try {
      await supabase.from('products').delete().eq('id', id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-primary text-gray-900">Inventory Management</h1>
            <p className="text-gray-500 mt-1">Manage products and variant inventories.</p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-[#1A7D80] hover:bg-[#126265] text-white px-6 py-3 rounded-xl font-bold transition-premium shadow-md"
          >
            <Plus size={20} /> Configure New Product
          </Link>
        </div>

        <div className="mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-transparent text-gray-900 outline-none"
          />
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold animate-pulse">Loading Inventory Vault...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#FAFAFA] border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Product Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Min Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Variants</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => {
                    const prices = product.variants?.map((variant) => Number(variant.price)).filter((price) => !Number.isNaN(price)) || [];
                    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

                    return (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900 text-sm">{product.name}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs tracking-wide">{product.category || 'Uncategorized'}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900 text-right text-sm">₹{minPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-700">{product.variants?.length || 0} variants</td>
                        <td className="px-6 py-4 flex items-center justify-end gap-3 text-sm">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50"
                            title="Edit Product"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 mt-4">
            <p className="text-gray-500 font-semibold mb-4">No products match your search.</p>
            <button onClick={() => setSearchTerm('')} className="text-[#1A7D80] font-bold hover:underline">Clear Search Filter</button>
          </div>
        )}
      </div>
    </div>
  );
}
