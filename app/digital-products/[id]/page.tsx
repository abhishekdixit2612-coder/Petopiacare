"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Download, CheckCircle2, ShieldCheck, ArrowLeft, Star, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";

declare global {
  interface Window { Razorpay: any }
}

interface Product {
  id: string; title: string; slug: string; price: number; category: string;
  tier: string; short_description: string; thumbnail_url: string; download_url: string;
  rating: number; review_count: number; badge?: string; features: string[];
}

export default function DigitalProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [paying, setPaying] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetch(`/api/digital-products/${params.id}`)
      .then(r => r.json())
      .then(d => { setProduct(d.product); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  // Load Razorpay script
  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  }, []);

  const handleCTA = () => {
    setShowModal(true);
    setDownloadUrl(null);
    setFormError('');
    setForm({ name: '', email: '' });
  };

  const handleFreeDownload = async () => {
    if (!form.name.trim() || !form.email.trim()) { setFormError('Please fill in your name and email.'); return; }
    if (!product) return;
    setPaying(true);
    try {
      await fetch('/api/digital-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id, productTitle: product.title, downloadUrl: product.download_url,
          customerName: form.name, customerEmail: form.email, amountPaid: 0, isFree: true,
        }),
      });
      setDownloadUrl(product.download_url);
    } catch { setDownloadUrl(product.download_url); }
    finally { setPaying(false); }
  };

  const handlePaidCheckout = async () => {
    if (!form.name.trim() || !form.email.trim()) { setFormError('Please fill in your name and email.'); return; }
    if (!product || !window.Razorpay) { setFormError('Payment not ready. Please refresh and try again.'); return; }
    setPaying(true);
    setFormError('');

    try {
      const orderRes = await fetch('/api/digital-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, productTitle: product.title, amount: product.price }),
      });
      const { orderId, error: orderErr } = await orderRes.json();
      if (orderErr || !orderId) throw new Error(orderErr ?? 'Could not create order');

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        order_id: orderId,
        amount: product.price * 100,
        currency: 'INR',
        name: 'PetopiaCare',
        description: product.title,
        image: product.thumbnail_url,
        prefill: { name: form.name, email: form.email },
        theme: { color: '#1A7D80' },
        handler: async (response: any) => {
          // Verify + record order
          const saveRes = await fetch('/api/digital-orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: product.id, productTitle: product.title, downloadUrl: product.download_url,
              customerName: form.name, customerEmail: form.email, amountPaid: product.price,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              isFree: false,
            }),
          });
          const saved = await saveRes.json();
          setDownloadUrl(saved.downloadUrl ?? product.download_url);
          setPaying(false);
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      rzp.open();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Payment failed. Try again.');
      setPaying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-display-sm font-display text-neutral-900">Product not found.</p>
    </div>
  );

  const isFree = product.price === 0;

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <Link href="/digital-products"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary-600 transition-colors mb-10 text-body-sm font-medium hover:-translate-x-1 duration-300">
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
            <h1 className="font-display text-display-md font-semibold text-neutral-900 mb-4 leading-tight">{product.title}</h1>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-secondary-300 text-secondary-300' : 'text-neutral-300'}`} />
                ))}
              </div>
              <span className="font-medium text-neutral-700 text-body-md">{product.rating}</span>
              <span className="text-neutral-400 text-body-sm">{product.review_count} reviews</span>
            </div>
            <p className="text-body-lg text-neutral-600 mb-10 leading-relaxed">{product.short_description}</p>

            {/* Pricing + CTA */}
            <div className="p-8 bg-neutral-50 rounded-xl border border-neutral-200 mb-10">
              <div className="mb-6">
                <span className="font-display text-display-sm font-semibold text-neutral-900">
                  {isFree ? 'FREE' : `₹${product.price.toFixed(0)}`}
                </span>
                {!isFree && <span className="ml-2 text-neutral-400 text-body-sm">One-time purchase</span>}
              </div>
              <button
                onClick={handleCTA}
                className="w-full bg-neutral-900 hover:bg-black text-white font-medium py-4 px-8 rounded-lg transition-all shadow-md flex items-center justify-center gap-3 text-body-lg"
              >
                <Download className="w-5 h-5" />
                {isFree ? 'Get Free Download' : `Buy Now — ₹${product.price.toFixed(0)}`}
              </button>
              <p className="text-center text-label-sm text-neutral-400 mt-3">
                {isFree ? 'Instant access · No credit card needed' : 'Secure payment via Razorpay · Instant download'}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-display text-display-sm font-semibold text-neutral-900 mb-6">What&apos;s Included</h3>
              <ul className="space-y-4">
                {product.features?.map((f, i) => (
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

      {/* Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
            <button onClick={() => setShowModal(false)} disabled={paying}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X size={18} />
            </button>

            {downloadUrl ? (
              /* ── Success state ── */
              <div className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="font-display text-heading-lg font-bold text-neutral-900 mb-2">
                  {isFree ? 'Your download is ready!' : 'Payment successful!'}
                </h2>
                <p className="text-body-sm text-neutral-500 mb-6">
                  Click the button below to download <strong>{product.title}</strong>.
                </p>
                <a href={downloadUrl} target="_blank" rel="noreferrer" download
                  className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-colors shadow-md text-body-md">
                  <Download className="w-5 h-5" /> Download Now
                </a>
                <button onClick={() => setShowModal(false)} className="mt-3 w-full text-neutral-500 hover:text-neutral-700 text-body-sm py-2 transition-colors">
                  Close
                </button>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                <div className="flex items-center gap-3 mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.thumbnail_url} alt="" className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <p className="font-bold text-neutral-900 text-body-md leading-snug">{product.title}</p>
                    <p className="text-body-sm text-neutral-500">{isFree ? 'Free download' : `₹${product.price}`}</p>
                  </div>
                </div>

                <h2 className="font-display text-heading-md font-bold text-neutral-900 mb-5">
                  {isFree ? 'Where should we send it?' : 'Complete your purchase'}
                </h2>

                <div className="space-y-3 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Rahul Sharma"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="rahul@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none text-sm" />
                  </div>
                </div>

                {formError && (
                  <p className="text-sm text-red-600 font-medium mb-4 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>
                )}

                <button
                  onClick={isFree ? handleFreeDownload : handlePaidCheckout}
                  disabled={paying}
                  className="w-full bg-neutral-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-body-md disabled:opacity-60"
                >
                  {paying
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                    : isFree
                      ? <><Download className="w-4 h-4" /> Get Free Download</>
                      : <><Download className="w-4 h-4" /> Pay ₹{product.price} & Download</>
                  }
                </button>

                {!isFree && (
                  <div className="flex items-center justify-center gap-2 mt-3 text-neutral-400 text-label-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Secured by Razorpay · UPI, Cards, Net Banking
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
