import Link from "next/link";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
    });
    // In a real app, use a toast.
    alert("Added to cart!");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert("Added to wishlist!");
  }

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-premium-hover transition-premium overflow-hidden border border-gray-100 flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-0"></Link>
      
      {/* Image Container */}
      <div className="aspect-[4/5] relative overflow-hidden bg-gray-50 flex items-center justify-center">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={product.image_url} 
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-premium duration-700"
          />
        ) : (
          <div className="text-gray-300">No Image</div>
        )}
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-[#1A7D80] shadow-sm tracking-wide lowercase">
            {product.category}
          </span>
        </div>

        {/* Floating Actions on Hover */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-premium translate-x-4 group-hover:translate-x-0">
          <button onClick={handleWishlist} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-gray-50 shadow-md transition-colors relative z-20">
            <Heart className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-[#1A7D80] hover:bg-gray-50 shadow-md transition-colors relative z-20 hidden md:flex">
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow bg-white z-10">
        <h3 className="font-primary font-bold text-gray-900 mb-2 truncate text-lg group-hover:text-[#1A7D80] transition-colors pr-2">{product.name}</h3>
        
        {/* Rating Placeholder */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < 4} />)}
          <span className="text-xs text-gray-400 ml-1">(24)</span>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="font-primary font-bold text-xl text-[#F2A65A]">₹{product.price.toFixed(2)}</span>
          <button 
            onClick={handleAddToCart}
            className="bg-[#1A7D80] text-white p-3 rounded-full hover:bg-teal-800 transition-premium shadow-sm hover:shadow-md relative z-20 group/btn"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg className={`w-3.5 h-3.5 ${filled ? 'text-[#FFD166] fill-[#FFD166]' : 'text-gray-300'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
