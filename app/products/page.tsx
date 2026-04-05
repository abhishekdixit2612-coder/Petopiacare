"use client";
import React, { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Filter, SlidersHorizontal, ChevronDown } from "lucide-react";

// Extended Mock data for pagination & filtering
const mockProducts = [
  { id: "1", name: "Classic Teal Collar", price: 499, category: "Collars", image_url: "https://images.unsplash.com/photo-1605365859556-9dccdb0e3092?w=800&q=80" },
  { id: "2", name: "Comfort Harness Orange", price: 899, category: "Harnesses", image_url: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80" },
  { id: "3", name: "Durable Training Leash", price: 599, category: "Leashes", image_url: "https://images.unsplash.com/photo-1605365859346-a4a3501a4fc6?w=800&q=80" },
  { id: "4", name: "Premium Squeaky Toy", price: 299, category: "Toys", image_url: "https://images.unsplash.com/photo-1576624933939-9d54e4708709?w=800&q=80" },
  { id: "5", name: "Reflective Night Collar", price: 549, category: "Collars", image_url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80" },
  { id: "6", name: "Breathable Mesh Harness", price: 999, category: "Harnesses", image_url: "https://images.unsplash.com/photo-1601614488349-f0dbbe70741c?w=800&q=80" },
  { id: "7", name: "Rope Leash w/ Leather Accent", price: 699, category: "Leashes", image_url: "https://images.unsplash.com/photo-1589416550751-24af9cc763b6?w=800&q=80" },
  { id: "8", name: "Tough Chew Bone", price: 349, category: "Toys", image_url: "https://plus.unsplash.com/premium_photo-1663127027581-2292f3922c09?w=800&q=80" },
];

export default function ProductsPage() {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = ["All", "Collars", "Harnesses", "Leashes", "Toys"];

  let filteredProducts = mockProducts.filter((p) => filter === "All" || p.category === filter);

  if (sort === "Price: Low to High") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "Price: High to Low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-primary font-bold text-[#1C1C1C] mb-4">Shop All Gear</h1>
          <p className="text-gray-600 text-lg max-w-2xl">Discover premium collars, leashes, harnesses and more. Lab-tested for strength, designed for comfort.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center justify-center gap-2 w-full bg-white border border-gray-300 py-3 rounded-lg font-semibold shadow-sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter className="w-5 h-5" /> Filters & Sort
          </button>

          {/* LEFT SIDEBAR (Filters) */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-max sticky top-28`}>
            <div className="flex items-center gap-2 mb-6 text-gray-900 border-b border-gray-100 pb-4">
              <SlidersHorizontal className="w-5 h-5 text-[#1A7D80]" />
              <h2 className="font-primary font-bold text-lg">Filters</h2>
            </div>
            
            <div className="space-y-8">
              {/* Category Filter */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex justify-between items-center cursor-pointer">
                  Category <ChevronDown className="w-4 h-4 text-gray-400" />
                </h3>
                <ul className="space-y-3">
                  {categories.map((c) => (
                    <li key={c}>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="category"
                          checked={filter === c}
                          onChange={() => setFilter(c)}
                          className="w-4 h-4 text-[#1A7D80] border-gray-300 focus:ring-[#1A7D80]" 
                        />
                        <span className={`text-sm transition-colors ${filter === c ? 'text-[#1A7D80] font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                          {c}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter (Mock UI) */}
               <div>
                <h3 className="font-bold text-gray-900 mb-4 flex justify-between items-center cursor-pointer">
                  Price <ChevronDown className="w-4 h-4 text-gray-400" />
                </h3>
                <div className="px-2">
                  <input type="range" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1A7D80]" />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>₹0</span>
                    <span>₹5000+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT GRID (Products) */}
          <div className="flex-1">
            {/* Top Toolbar */}
            <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm font-medium">
                Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> products
              </p>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Sort by:</span>
                <select 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)}
                  className="border-gray-200 rounded-lg shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80] py-2 pl-3 pr-10 text-sm bg-gray-50 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-300 mt-8">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                <button onClick={() => setFilter("All")} className="mt-4 text-[#1A7D80] font-bold hover:underline">Clear Filters</button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex justify-center mt-16">
                <nav className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors opacity-50 cursor-not-allowed">&lt;</button>
                  <button className="w-10 h-10 rounded-full bg-[#1A7D80] text-white flex items-center justify-center font-bold shadow-md">1</button>
                  <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors">2</button>
                  <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors">&gt;</button>
                </nav>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
