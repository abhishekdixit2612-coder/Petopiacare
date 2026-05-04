"use client";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

function getImageSrc(url: string): string {
  if (!url) return '';
  let match = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
  match = url.match(/drive\.google\.com\/uc[^?]*\?.*[?&]id=([^&]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
  return url;
}
import { Plus, Minus, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeFromCart, updateQuantity, cartTotal } = useCartStore();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-10 h-10 text-neutral-300" />
        </div>
        <h1 className="font-display text-display-sm text-neutral-900 mb-4">Your Cart is Empty</h1>
        <p className="text-body-lg text-neutral-500 mb-10">Paws a moment... looks like you haven&apos;t added any gear yet!</p>
        <Button size="large" onClick={() => window.location.href = '/products'}>
          Start Shopping <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-display text-display-sm text-neutral-900 mb-10">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items */}
          <div className="lg:w-2/3 flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-5 bg-neutral-50 border-b border-neutral-100 text-label-sm font-medium text-neutral-500 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              <div className="divide-y divide-neutral-100">
                {items.map((item) => (
                  <div key={item.id} className="grid sm:grid-cols-12 gap-5 p-5 items-center hover:bg-neutral-50 transition-colors">
                    <div className="col-span-6 flex gap-4 items-center">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={getImageSrc(item.image_url)} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-neutral-900 text-heading-sm leading-tight mb-1">{item.name}</h3>
                        <p className="text-label-sm text-neutral-400 mb-1">SKU: {item.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-primary-600 font-medium text-body-sm sm:hidden">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="col-span-3 flex justify-start sm:justify-center items-center">
                      <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-2 hover:bg-neutral-50 text-neutral-500 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium text-body-md">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-2 hover:bg-neutral-50 text-neutral-500 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-3 flex justify-between sm:justify-end items-center gap-4">
                      <span className="hidden sm:block font-display font-semibold text-neutral-900 text-heading-sm">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-error-500 hover:bg-error-50 p-2 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/products" className="inline-flex items-center text-primary-600 font-medium hover:underline gap-2 self-start text-body-md">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md border border-neutral-100 p-8 sticky top-32">
              <h2 className="font-display text-display-sm text-neutral-900 mb-6 border-b border-neutral-100 pb-4">Order Summary</h2>

              <div className="space-y-4 text-body-md text-neutral-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  <span className="font-medium text-neutral-900">₹{cartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-success-600 font-medium uppercase text-label tracking-wide">Free</span>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-6 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-display font-semibold text-neutral-900 text-heading-md">Estimated Total</span>
                  <span className="font-display font-semibold text-display-sm text-primary-600">₹{cartTotal().toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-neutral-900 hover:bg-black text-white font-medium py-4 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 text-body-lg"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="mt-6 flex items-center justify-center gap-2 text-neutral-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-label-sm font-medium uppercase tracking-widest">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
