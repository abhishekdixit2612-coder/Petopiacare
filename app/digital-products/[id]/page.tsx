"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Download, CheckCircle2, ShieldCheck, ArrowLeft, Star } from "lucide-react";

export default function DigitalProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/digital-products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="min-h-screen py-32 text-center text-xl font-bold">Loading...</div>;
  if (!product) return <div className="min-h-screen py-32 text-center text-xl font-bold">Product not found.</div>;

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        
        <Link href="/digital-products" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1A7D80] transition-colors mb-10 text-sm font-semibold tracking-wide hover:-translate-x-1 duration-300">
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Side: Mock Book Cover UI */}
          <div className="w-full lg:w-5/12 perspective-1000">
             <div className="relative aspect-[3/4] rounded-r-3xl rounded-l-md shadow-[20px_20px_50px_rgba(0,0,0,0.2)] bg-gradient-to-tr from-gray-900 to-gray-800 border-l-8 border-gray-700 overflow-hidden group transform rotate-y-[-10deg] transition-all duration-700 hover:rotate-y-0">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={product.thumbnail_url} alt={product.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-8">
                 <div className="text-[#FFD166] text-xs font-bold tracking-widest uppercase">{product.category}</div>
                 <div>
                   <h2 className="font-primary text-3xl font-bold text-white mb-2 leading-tight shadow-sm">{product.title}</h2>
                   <div className="w-12 h-1 bg-[#1A7D80] rounded"></div>
                 </div>
               </div>
             </div>
             
             {/* Guarantee Badge */}
             <div className="mt-12 flex gap-4 p-6 bg-green-50 border border-green-100 rounded-2xl items-center justify-center">
               <ShieldCheck className="w-8 h-8 text-green-600 flex-shrink-0" />
               <div>
                 <h4 className="font-bold text-gray-900 text-sm mb-1">30-Day Money Back Guarantee</h4>
                 <p className="text-xs text-gray-600">Not satisfied? Full refund. No questions asked.</p>
               </div>
             </div>
          </div>

          {/* Right Side: Details & CTA */}
          <div className="w-full lg:w-7/12">
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              PetopiaCare Originals
            </span>
            
            <h1 className="font-primary text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-8 text-sm">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-[#FFD166] text-[#FFD166]' : 'text-gray-300'}`} />)}
              </div>
              <span className="font-bold text-gray-700">{product.rating}</span>
              <span className="text-gray-400 underline cursor-pointer">Read {product.review_count} Reviews</span>
            </div>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed font-secondary">
              {product.short_description}
            </p>

            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 mb-10">
               <div className="mb-6 flex justify-between items-center">
                 <span className="font-primary text-4xl font-bold text-[#1C1C1C]">
                   {product.price === 0 ? "FREE" : `₹${product.price.toFixed(2)}`}
                 </span>
               </div>
               
               <div className="flex flex-col sm:flex-row gap-4 mb-6">
                 <button className="flex-1 bg-[#1C1C1C] hover:bg-black text-white font-bold py-4 px-8 rounded-xl transition-premium shadow-premium hover:shadow-premium-hover flex items-center justify-center gap-3 text-lg">
                   <Download className="w-5 h-5" />
                   {product.price === 0 ? "Download Now" : "Buy Now"}
                 </button>
                 {product.price > 0 && (
                   <button className="flex-1 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-premium text-lg">
                     View Free Preview
                   </button>
                 )}
               </div>

               <p className="text-center text-xs text-gray-500 font-medium">Instant Digital Delivery via Email • Secure PDF/MP4 Formats</p>
            </div>

            {/* What you'll learn */}
            <div>
              <h3 className="font-primary text-2xl font-bold text-gray-900 mb-6">What's Included</h3>
              <ul className="space-y-4">
                {product.features?.map((f: string, i: number) => (
                  <li key={i} className="flex gap-4 items-start">
                    <CheckCircle2 className="w-6 h-6 text-[#1A7D80] flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
