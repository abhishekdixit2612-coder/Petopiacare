'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/store/cartStore';

interface Variant {
  id: string;
  sku: string;
  variant_name: string;
  option1_name: string;
  option1_value: string;
  price: number;
  stock_quantity: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
}

interface RelatedProduct {
  id: string;
  name: string;
  image_url: string;
  category: string;
  minPrice: number;
}

// Converts any Google Drive URL to an embeddable thumbnail URL
function getImageSrc(url: string): string {
  if (!url) return '';
  let match = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200`;
  match = url.match(/drive\.google\.com\/uc[^?]*\?.*[?&]id=([^&]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200`;
  return url;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const addToCart = useCartStore((state) => state.addToCart);

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<'added' | 'error' | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const [{ data: prod }, { data: vars }] = await Promise.all([
          supabase.from('products').select('*').eq('id', id).single(),
          supabase.from('variants').select('*').eq('product_id', id).order('price', { ascending: true }),
        ]);

        if (!prod) {
          setLoading(false);
          return;
        }

        setProduct(prod);
        setVariants(vars || []);
        setSelectedVariant(vars?.[0] ?? null);

        // Fetch related products (same category, different id)
        if (prod.category) {
          const { data: relatedData } = await supabase
            .from('products')
            .select('id,name,image_url,category,variants(price)')
            .eq('category', prod.category)
            .neq('id', id)
            .limit(4);

          if (relatedData) {
            setRelated(
              relatedData.map((p: any) => {
                const prices = Array.isArray(p.variants)
                  ? p.variants.map((v: any) => Number(v.price)).filter(Boolean)
                  : [];
                return {
                  id: p.id,
                  name: p.name,
                  image_url: p.image_url,
                  category: p.category,
                  minPrice: prices.length ? Math.min(...prices) : 0,
                };
              })
            );
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const showToast = (type: 'added' | 'error') => {
    setToast(type);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    if (selectedVariant.stock_quantity === 0) {
      showToast('error');
      return;
    }
    addToCart({
      id: selectedVariant.id,
      product_id: product.id,
      variant_id: selectedVariant.id,
      sku: selectedVariant.sku,
      name: `${product.name}${selectedVariant.option1_value !== 'Default' ? ` — ${selectedVariant.option1_value}` : ''}`,
      price: selectedVariant.price,
      image_url: product.image_url,
      quantity,
    });
    showToast('added');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square rounded-2xl bg-neutral-200" />
          <div className="space-y-4 py-4">
            <div className="h-5 w-24 bg-neutral-200 rounded-full" />
            <div className="h-9 w-3/4 bg-neutral-200 rounded-lg" />
            <div className="h-4 w-full bg-neutral-100 rounded" />
            <div className="h-4 w-5/6 bg-neutral-100 rounded" />
            <div className="h-4 w-4/6 bg-neutral-100 rounded" />
            <div className="h-12 w-40 bg-neutral-200 rounded-xl mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <p className="text-display-sm font-display text-neutral-900 mb-3">Product not found</p>
        <p className="text-body-md text-neutral-500 mb-8">This product may have been removed or the link is incorrect.</p>
        <Link href="/products">
          <Button>Browse all products</Button>
        </Link>
      </div>
    );
  }

  const inStock = (selectedVariant?.stock_quantity ?? 0) > 0;
  const lowStock = inStock && (selectedVariant?.stock_quantity ?? 0) <= 3;
  const optionName = variants[0]?.option1_name || 'Size';
  const showVariants = variants.length > 1 || (variants.length === 1 && variants[0].option1_value !== 'Default');

  return (
    <div className="bg-white">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-body-sm font-medium transition-all ${
            toast === 'added' ? 'bg-success-500' : 'bg-error-500'
          }`}
        >
          {toast === 'added' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast === 'added' ? 'Added to cart!' : 'Out of stock'}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-body-sm text-neutral-400 mb-8">
          <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-primary-600 transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-neutral-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 shadow-sm sticky top-24">
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getImageSrc(product.image_url)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-300 text-body-sm">
                No image
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <Badge variant="neutral" size="small" className="mb-4">{product.category}</Badge>

            <h1 className="text-display-sm md:text-display-md font-display text-neutral-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-body-md text-neutral-600 mb-6 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Variant selector */}
            {showVariants && (
              <div className="mb-6">
                <p className="text-label font-medium text-neutral-700 mb-3">{optionName}</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => {
                    const selected = selectedVariant?.id === v.id;
                    const outOfStock = v.stock_quantity === 0;
                    return (
                      <button
                        key={v.id}
                        onClick={() => { if (!outOfStock) { setSelectedVariant(v); setQuantity(1); } }}
                        disabled={outOfStock}
                        className={`px-4 py-2 rounded-lg text-body-sm font-medium border transition-all ${
                          selected
                            ? 'bg-primary-500 border-primary-500 text-white shadow-sm'
                            : outOfStock
                            ? 'bg-neutral-50 border-neutral-200 text-neutral-300 cursor-not-allowed line-through'
                            : 'bg-white border-neutral-300 text-neutral-700 hover:border-primary-400 hover:text-primary-600'
                        }`}
                      >
                        {v.option1_value}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price + stock */}
            {selectedVariant && (
              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                <p className="text-display-sm font-display font-bold text-primary-600">
                  ₹{selectedVariant.price.toLocaleString('en-IN')}
                </p>
                <Badge variant={!inStock ? 'error' : lowStock ? 'warning' : 'success'} size="small">
                  {!inStock ? 'Out of stock' : lowStock ? `Only ${selectedVariant.stock_quantity} left` : 'In stock'}
                </Badge>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex gap-3 mb-8">
              <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-11 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors text-lg"
                >
                  −
                </button>
                <span className="w-10 text-center text-body-md font-medium text-neutral-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(selectedVariant?.stock_quantity ?? 1, q + 1))}
                  disabled={quantity >= (selectedVariant?.stock_quantity ?? 0)}
                  className="w-10 h-11 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors text-lg disabled:opacity-30"
                >
                  +
                </button>
              </div>

              <Button
                size="large"
                disabled={!inStock}
                icon={<ShoppingCart size={18} />}
                iconPosition="left"
                className="flex-1"
                onClick={handleAddToCart}
              >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="border-t border-neutral-100 pt-6 space-y-2.5">
              {[
                '30-day money-back guarantee',
                'Free shipping on orders above ₹999',
                'Tested with real Indian dogs',
                'Washable & weather-resistant',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <CheckCircle size={15} className="text-success-500 flex-shrink-0" />
                  <p className="text-body-sm text-neutral-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16 md:mt-24 border-t border-neutral-100 pt-12">
            <h2 className="text-display-sm font-display text-neutral-900 mb-8">More from {product.category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.id}`}
                  className="group rounded-xl overflow-hidden border border-neutral-100 bg-white hover:shadow-md transition-all"
                >
                  <div className="aspect-square bg-neutral-50 overflow-hidden">
                    {rel.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getImageSrc(rel.image_url)}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-100" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-body-sm font-medium text-neutral-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                      {rel.name}
                    </p>
                    {rel.minPrice > 0 && (
                      <p className="text-body-sm font-semibold text-primary-600 mt-1">
                        ₹{rel.minPrice.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
