"use client";
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
    alert("Added to cart!");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert("Added to wishlist!");
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-neutral-100 flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-0" />

      {/* Image */}
      <div className="aspect-[4/5] relative overflow-hidden bg-neutral-50 flex items-center justify-center">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-neutral-300 text-body-sm">No Image</div>
        )}

        {/* Category badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-label-sm font-medium text-primary-600 shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Hover actions */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <button
            onClick={handleWishlist}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-neutral-400 hover:text-error-500 shadow-md transition-colors relative z-20"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 bg-white rounded-full hidden md:flex items-center justify-center text-neutral-400 hover:text-primary-600 shadow-md transition-colors relative z-20">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow bg-white z-10">
        <h3 className="font-display font-semibold text-neutral-900 mb-2 truncate text-heading-sm group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled={i < 4} />
          ))}
          <span className="text-label-sm text-neutral-400 ml-1">(24)</span>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="font-display font-semibold text-heading-md text-primary-600">
            ₹{product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full transition-all shadow-sm hover:shadow-md relative z-20 group/btn"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 ${filled ? "text-secondary-300 fill-secondary-300" : "text-neutral-300"}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
