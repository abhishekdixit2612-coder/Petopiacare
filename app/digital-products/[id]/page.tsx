"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Download, CheckCircle2, ShieldCheck, ArrowLeft, Star } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";

export default function DigitalProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/digital-products/${params.id}`)
      .then(res => res.json())
      .then(data => { setProduct(data.product); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent mx-auto mb-4" />
        <p className="text-body-md text-neutral-600">Loading...</p>
      </div>
    </div>
  );
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-display-sm font-display text-neutral-900">Product not found.</p>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <Link
          href="/digital-products"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary-600 transition-colors mb-10 text-body-sm font-medium hover:-translate-x-1 duration-300"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Book Cover */}
          <div className="w-full lg:w-5/12">
            <div className="relative aspect-[3/4] rounded-r-2xl rounded-l-sm shadow-2xl bg-gradient-to-tr from-neutral-900 to-neutral-800 border-l-8 border-neutral-700 overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.thumbnail_url} alt={product.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-8">
                <div className="text-secondary-300 text-label-sm font-medium tracking-widest uppercase">{product.category}</div>
                <div>
                  <h2 className="font-display text-display-sm font-semibold text-white mb-2 leading-tight">{product.title}</h2>
                  <div className="w-12 h-1 bg-primary-400 rounded" />
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="mt-10 flex gap-4 p-6 bg-success-50 border border-success-100 rounded-xl items-center">
              <ShieldCheck className="w-8 h-8 text-success-600 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-neutral-900 text-body-md mb-0.5">30-Day Money Back Guarantee</h4>
                <p className="text-body-sm text-neutral-600">Not satisfied? Full refund. No questions asked.</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="w-full lg:w-7/12">
            <Badge variant="neutral" size="small" className="mb-4">PetopiaCare Originals</Badge>

            <h1 className="font-display text-display-md font-semibold text-neutral-900 mb-4 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-secondary-300 text-secondary-300' : 'text-neutral-300'}`} />
                ))}
              </div>
              <span className="font-medium text-neutral-700 text-body-md">{product.rating}</span>
              <span className="text-neutral-400 text-body-sm underline cursor-pointer">Read {product.review_count} Reviews</span>
            </div>

            <p className="text-body-lg text-neutral-600 mb-10 leading-relaxed">{product.short_description}</p>

            <div className="p-8 bg-neutral-50 rounded-xl border border-neutral-200 mb-10">
              <div className="mb-6">
                <span className="font-display text-display-sm font-semibold text-neutral-900">
                  {product.price === 0 ? "FREE" : `₹${product.price.toFixed(2)}`}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button className="flex-1 bg-neutral-900 hover:bg-black text-white font-medium py-4 px-8 rounded-lg transition-all shadow-md flex items-center justify-center gap-3 text-body-lg">
                  <Download className="w-5 h-5" />
                  {product.price === 0 ? "Download Now" : "Buy Now"}
                </button>
                {product.price > 0 && (
                  <button className="flex-1 bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-50 font-medium py-4 px-8 rounded-lg transition-all text-body-lg">
                    View Free Preview
                  </button>
                )}
              </div>
              <p className="text-center text-label-sm text-neutral-400">Instant Digital Delivery via Email • Secure PDF/MP4 Formats</p>
            </div>

            {/* What's Included */}
            <div>
              <h3 className="font-display text-display-sm font-semibold text-neutral-900 mb-6">What&apos;s Included</h3>
              <ul className="space-y-4">
                {product.features?.map((f: string, i: number) => (
                  <li key={i} className="flex gap-4 items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-body-lg text-neutral-700">{f}</span>
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
