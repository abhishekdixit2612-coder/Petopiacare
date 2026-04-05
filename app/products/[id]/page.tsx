"use client";
import { useState, use } from "react";
import { useCartStore } from "@/store/cartStore";
import { Plus, Minus, ShoppingCart, ShieldCheck, Heart, Share2, AlertCircle, Truck } from "lucide-react";

// Mock data
const mockProducts = [
  { id: "1", name: "Classic Teal Collar", price: 499, category: "Collars", description: "A comfortable, durable collar in our signature teal. Built to last with reinforced stitching and double-locked buckles. Designed specifically for the rough-and-tumble lifestyle of Indian street dogs and pedigree breeds alike.", image_url: "https://images.unsplash.com/photo-1605365859556-9dccdb0e3092?w=800&q=80", sku: "COL-TEAL-01" },
  { id: "2", name: "Comfort Harness Orange", price: 899, category: "Harnesses", description: "Our warmest accent color designed into a premium, no-pull harness. Keeps your dog safe and comfortable on long walks.", image_url: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80", sku: "HAR-ORG-01" },
];

export default function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const product = mockProducts.find((p) => p.id === params.id) || mockProducts[0]; 
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity,
    });
    alert("Added to cart!");
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left: Image Gallery */}
        <div className="w-full lg:w-1/2">
          {/* Main Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-premium duration-700"
            />
            
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">
              {product.category}
            </div>
          </div>
          
          {/* Thumbnails (Mock) */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="aspect-square rounded-xl border-2 border-[#1A7D80] overflow-hidden opacity-100"><img src={product.image_url} className="w-full h-full object-cover" alt="thumb" /></div>
            <div className="aspect-square rounded-xl border border-gray-200 overflow-hidden opacity-60 hover:opacity-100 transition-opacity cursor-pointer"><img src={product.image_url} className="w-full h-full object-cover filter grayscale" alt="thumb" /></div>
            <div className="aspect-square rounded-xl border border-gray-200 overflow-hidden opacity-60 hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-100 text-gray-400 text-xs text-center cursor-pointer">View<br/>More</div>
          </div>
        </div>

        {/* Right: Product Details (Sticky) */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-32 h-max">
          <div className="flex items-center gap-2 text-sm text-[#1A7D80] font-semibold tracking-wide uppercase mb-3">
            <span>PetopiaCare Originals</span>
          </div>
          
          <h1 className="font-primary text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-[1.1]">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-primary font-bold text-[#1C1C1C]">₹{product.price.toFixed(2)}</span>
            <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> In Stock (Ships today!)
            </div>
          </div>
          
          <p className="text-lg text-gray-600 mb-10 leading-relaxed font-secondary">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 rounded-xl w-full sm:w-32 bg-white justify-between shadow-sm">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-4 text-gray-500 hover:text-black transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="px-4 py-4 text-gray-500 hover:text-black transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-[#1A7D80] hover:bg-[#126265] text-white font-bold py-4 px-8 rounded-xl transition-premium shadow-premium hover:shadow-premium-hover flex items-center justify-center gap-3 text-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              Add to Cart — ₹{(product.price * quantity).toFixed(2)}
            </button>
            
            {/* Wishlist */}
            <button className="w-14 h-[60px] rounded-xl border border-gray-300 flex flex-shrink-0 items-center justify-center text-gray-500 hover:text-red-500 hover:bg-gray-50 transition-premium shadow-sm">
              <Heart className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Value Props */}
          <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-gray-100 mb-10">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-[#1A7D80]" />
              <span className="text-sm font-medium text-gray-700">Free Shipping in India</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#1A7D80]" />
              <span className="text-sm font-medium text-gray-700">1 Year Warranty</span>
            </div>
          </div>

          {/* Detailed Tabs */}
          <div>
            <div className="flex space-x-8 border-b border-gray-200 mb-6 font-primary text-lg">
              <button onClick={()=>setActiveTab("description")} className={`pb-4 transition-colors font-bold ${activeTab === "description" ? "border-b-2 border-[#1A7D80] text-gray-900" : "text-gray-400 hover:text-gray-600"}`}>Details</button>
              <button onClick={()=>setActiveTab("specs")} className={`pb-4 transition-colors font-bold ${activeTab === "specs" ? "border-b-2 border-[#1A7D80] text-gray-900" : "text-gray-400 hover:text-gray-600"}`}>Specifications</button>
              <button onClick={()=>setActiveTab("shipping")} className={`pb-4 transition-colors font-bold ${activeTab === "shipping" ? "border-b-2 border-[#1A7D80] text-gray-900" : "text-gray-400 hover:text-gray-600"}`}>Shipping</button>
            </div>
            
            <div className="text-gray-600 min-h-[150px]">
              {activeTab === "description" && (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <p>Our premium gear is crafted specifically keeping the active dog in mind. Whether you have an energetic Indian Indie or a calm Golden Retriever, this product offers unparalleled durability and comfort.</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Multi-layer breathable mesh padding.</li>
                    <li>Reflective threading for night visibility.</li>
                    <li>Quick-release buckle mechanisms.</li>
                  </ul>
                </div>
              )}
              {activeTab === "specs" && (
                <div className="animate-in fade-in duration-500 border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <tbody>
                      <tr className="border-b border-gray-100"><td className="py-3 px-4 bg-gray-50 font-medium w-1/3">SKU</td><td className="py-3 px-4 font-mono">{product.sku}</td></tr>
                      <tr className="border-b border-gray-100"><td className="py-3 px-4 bg-gray-50 font-medium w-1/3">Material</td><td className="py-3 px-4">High-density Nylon, Neoprene</td></tr>
                      <tr className="border-b border-gray-100"><td className="py-3 px-4 bg-gray-50 font-medium w-1/3">Washing</td><td className="py-3 px-4">Hand wash cold, air dry</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === "shipping" && (
                <div className="animate-in fade-in duration-500">
                  <p className="flex items-start gap-3"><AlertCircle className="w-5 h-5 text-[#F2A65A] flex-shrink-0" /> Orders are processed within 24 hours.</p>
                  <p className="mt-4">Delivery times range between 3-7 business days depending on your location in India. Expedited shipping is available at checkout.</p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
