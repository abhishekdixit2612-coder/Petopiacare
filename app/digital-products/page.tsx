"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, BookOpen, Star, Download } from "lucide-react";

export default function DigitalProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    fetch('/api/digital-products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(p => categoryFilter === "All" || p.category === categoryFilter);
  const categories = ["All", "eBook", "Course", "Checklist"];

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="bg-[#1C1C1C] py-20 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2000')] opacity-10 bg-cover bg-center"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="font-primary text-4xl md:text-5xl font-bold mb-6">Digital Learning Portal</h1>
          <p className="text-xl text-gray-400 font-secondary max-w-2xl mx-auto">
            Expert guides, courses, and resources designed to help you become the ultimate pet parent. 
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-12">
        
        {/* Left Sidebar Filters */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
            <h3 className="font-primary font-bold text-lg mb-6 text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#1A7D80]" /> Filters
            </h3>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Content Type</h4>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category"
                        checked={categoryFilter === cat}
                        onChange={() => setCategoryFilter(cat)}
                        className="w-4 h-4 text-[#1A7D80] border-gray-300 focus:ring-[#1A7D80]" 
                      />
                      <span className={`text-sm transition-colors ${categoryFilter === cat ? 'text-[#1A7D80] font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                        {cat}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Product Grid */}
        <div className="flex-1">
          
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1,2,3].map(i => <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse"></div>)}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <Link href={`/digital-products/${product.id}`} key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-premium transition-premium border border-gray-100 flex flex-col h-full">
                  
                  {/* Thumbnail */}
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.thumbnail_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-premium duration-500" />
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-[#1C1C1C] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {product.badge}
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[#1A7D80] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                         <BookOpen className="w-3 h-3" /> {product.category}
                       </span>
                    </div>
                    
                    <h3 className="font-primary font-bold text-lg text-gray-900 mb-2 leading-snug group-hover:text-[#1A7D80] transition-colors">
                      {product.title}
                    </h3>
                    
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {product.short_description}
                    </p>
                    
                    {/* Ratings */}
                    <div className="flex items-center gap-1 mb-6 mt-auto">
                      <Star className="w-4 h-4 fill-[#FFD166] text-[#FFD166]" />
                      <span className="font-semibold text-sm text-gray-700">{product.rating}</span>
                      <span className="text-xs text-gray-400">({product.review_count})</span>
                    </div>
                    
                    {/* Price and Action */}
                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                      <span className="font-primary font-bold text-xl text-gray-900">
                        {product.price === 0 ? <span className="text-green-600 uppercase text-sm tracking-wide">Free</span> : `₹${product.price.toFixed(2)}`}
                      </span>
                      <button className="bg-gray-50 hover:bg-[#1A7D80] text-gray-600 hover:text-white p-2 rounded-lg transition-premium">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">No digital products found.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
