"use client";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeFromCart, updateQuantity, cartTotal } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="font-primary text-4xl font-bold mb-4 text-[#1C1C1C]">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-10 text-lg">Paws a moment... looks like you haven't added any gear yet!</p>
        <Link href="/products" className="inline-flex bg-[#1A7D80] text-white px-10 py-4 rounded-xl hover:bg-teal-800 transition-premium shadow-premium hover:shadow-premium-hover font-bold text-lg items-center gap-2">
          Start Shopping <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-primary text-4xl font-bold mb-10 text-[#1C1C1C]">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="grid sm:grid-cols-12 gap-6 p-6 items-center hover:bg-gray-50 transition-colors">
                    
                    {/* Item Details */}
                    <div className="col-span-6 flex gap-4 items-center">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-primary font-bold text-lg text-gray-900 leading-tight mb-1">{item.name}</h3>
                        <p className="text-gray-500 text-sm mb-2">SKU: {item.id.slice(0,8).toUpperCase()}</p>
                        <p className="text-[#F2A65A] font-bold sm:hidden">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {/* Quantity Control */}
                    <div className="col-span-3 flex justify-start sm:justify-center items-center">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-2 hover:bg-gray-50 text-gray-500 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-2 hover:bg-gray-50 text-gray-500 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Total & Remove */}
                    <div className="col-span-3 flex justify-between sm:justify-end items-center gap-4">
                      <span className="hidden sm:block font-primary font-bold text-lg text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
            
            <Link href="/products" className="inline-flex items-center text-[#1A7D80] font-bold hover:underline transition-all gap-2 self-start mt-4">
              &larr; Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-premium border border-gray-100 p-8 sticky top-32">
              <h2 className="font-primary text-2xl font-bold mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
              
              <div className="space-y-4 text-base text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-gray-900">₹{cartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Estimate</span>
                  <span className="text-green-600 font-bold tracking-wide uppercase text-sm">Free</span>
                </div>
                <div className="flex justify-between items-center text-sm text-[#1A7D80] cursor-pointer hover:underline mt-2">
                  <span className="flex items-center gap-2"><Tag className="w-4 h-4" /> Add a promo code</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-8 bg-gray-50 -mx-8 px-8 pb-8 rounded-b-3xl mt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-primary font-bold text-gray-900 text-xl">Estimated Total</span>
                  <span className="font-primary font-bold text-3xl text-[#1A7D80]">₹{cartTotal().toFixed(2)}</span>
                </div>

                <Link href="/checkout" className="w-full bg-[#1C1C1C] hover:bg-black text-white font-bold py-4 rounded-xl transition-premium shadow-lg flex items-center justify-center gap-2 text-lg">
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </Link>
                
                <div className="mt-6 flex justify-center items-center gap-4 text-gray-400 opacity-60">
                   {/* Decorative Mock badges for Premium feel */}
                   <ShieldCheck className="w-6 h-6" />
                   <span className="text-xs font-bold uppercase tracking-widest">Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
