"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Star, Download, Filter } from "lucide-react";
import { Badge } from "@/components/Badge";

export default function DigitalProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    fetch('/api/digital-products')
      .then(res => res.json())
      .then(data => { setProducts(data.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(p => categoryFilter === "All" || p.category === categoryFilter);
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="bg-neutral-900 py-20 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2000')] opacity-10 bg-cover bg-center" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="inline-block text-label font-medium text-primary-300 uppercase tracking-widest mb-4">Free & Premium Resources</span>
          <h1 className="font-display text-display-md md:text-display-lg font-semibold mb-6">Digital Learning Portal</h1>
          <p className="text-body-lg text-neutral-400 max-w-2xl mx-auto">
            Expert guides, courses, and resources designed to help you become the ultimate pet parent.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <div className="hidden lg:block w-60 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 sticky top-28">
            <h3 className="font-display font-semibold text-heading-sm mb-6 text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary-500" /> Filters
            </h3>
            <div className="space-y-4">
              <h4 className="font-medium text-neutral-700 text-body-sm">Content Type</h4>
              <ul className="space-y-3">
                {(categories as string[]).map((cat) => (
                  <li key={cat}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={categoryFilter === cat}
                        onChange={() => setCategoryFilter(cat)}
                        className="w-4 h-4 accent-primary-500"
                      />
                      <span className={`text-body-sm transition-colors ${categoryFilter === cat ? 'text-primary-600 font-medium' : 'text-neutral-600 group-hover:text-neutral-900'}`}>
                        {cat}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-80 bg-neutral-200 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <Link
                  href={`/digital-products/${product.id}`}
                  key={product.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-neutral-100 flex flex-col h-full"
                >
                  <div className="aspect-[4/3] bg-neutral-100 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.thumbnail_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.badge && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="neutral" size="small" className="bg-neutral-900 text-white">{product.badge}</Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-1 mb-2">
                      <BookOpen className="w-3 h-3 text-primary-500" />
                      <span className="text-label-sm font-medium text-primary-600 uppercase tracking-wider">{product.category}</span>
                    </div>
                    <h3 className="font-display font-semibold text-heading-sm text-neutral-900 mb-2 leading-snug group-hover:text-primary-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-body-sm text-neutral-500 mb-4 line-clamp-2">{product.short_description}</p>

                    <div className="flex items-center gap-1 mb-6 mt-auto">
                      <Star className="w-4 h-4 fill-secondary-300 text-secondary-300" />
                      <span className="font-medium text-body-sm text-neutral-700">{product.rating}</span>
                      <span className="text-label-sm text-neutral-400">({product.review_count})</span>
                    </div>

                    <div className="border-t border-neutral-100 pt-4 flex items-center justify-between">
                      <span className="font-display font-semibold text-heading-sm text-neutral-900">
                        {product.price === 0
                          ? <span className="text-success-600 text-label uppercase tracking-wide">Free</span>
                          : `₹${product.price.toFixed(2)}`}
                      </span>
                      <button className="bg-neutral-100 hover:bg-primary-500 hover:text-white text-neutral-600 p-2 rounded-lg transition-all">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-32 bg-white rounded-xl border border-dashed border-neutral-300">
              <p className="text-body-lg text-neutral-500">No digital products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
