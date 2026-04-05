"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(false);
  
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Product added successfully!");
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div>
      <h1 className="text-3xl font-primary font-bold mb-8 text-gray-900">Manage Products</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Plus className="text-[#1A7D80]" /> Add New Product
        </h2>
        
        <form onSubmit={handleAddProduct} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
               <input required type="text" className="w-full border-gray-300 rounded-lg px-4 py-2 border shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80]" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
               <input required type="text" className="w-full border-gray-300 rounded-lg px-4 py-2 border shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80]" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
               <input required type="number" min="0" step="0.01" className="w-full border-gray-300 rounded-lg px-4 py-2 border shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80]" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Cost (₹)</label>
               <input type="number" min="0" step="0.01" className="w-full border-gray-300 rounded-lg px-4 py-2 border shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80]" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
               <select required className="w-full border-gray-300 rounded-lg px-4 py-2 border shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80] bg-white">
                 <option value="Collars">Collars</option>
                 <option value="Harnesses">Harnesses</option>
                 <option value="Leashes">Leashes</option>
                 <option value="Toys">Toys</option>
                 <option value="Other">Other</option>
               </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
             <input required type="url" placeholder="https://..." className="w-full border-gray-300 rounded-lg px-4 py-2 border shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80]" />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
             <textarea required rows={4} className="w-full border-gray-300 rounded-lg px-4 py-2 border shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80]"></textarea>
          </div>
          
          <div className="pt-4">
            <button disabled={loading} type="submit" className="bg-[#1A7D80] text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-800 transition-colors disabled:opacity-50">
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
