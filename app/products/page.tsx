"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/Badge";

function getImageSrc(url: string): string {
  if (!url) return '';
  let match = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
  match = url.match(/drive\.google\.com\/uc[^?]*\?.*[?&]id=([^&]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
  return url;
}

interface ProductCard {
  id: string;
  name: string;
  image_url: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  variantCount: number;
}

const FALLBACK_PRODUCTS: ProductCard[] = [
  { id: 'p1', name: 'Saffron Comfort Dog Harness', image_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80', category: 'Harnesses', minPrice: 899, maxPrice: 1299, variantCount: 3 },
  { id: 'p2', name: 'Eco Leash with Leather Handle', image_url: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80', category: 'Leashes', minPrice: 499, maxPrice: 699, variantCount: 2 },
  { id: 'p3', name: 'Cooling Mesh Dog Bed', image_url: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=800&q=80', category: 'Beds', minPrice: 1399, maxPrice: 1899, variantCount: 4 },
  { id: 'p4', name: 'Gentle Grooming Kit', image_url: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&q=80', category: 'Grooming', minPrice: 599, maxPrice: 599, variantCount: 1 },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await supabase
          .from("products")
          .select("id,name,image_url,category,variants(price)")
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          const formatted = data.map((product: any) => {
            const prices = Array.isArray(product.variants)
              ? product.variants.map((v: any) => Number(v.price)).filter((p: number) => !Number.isNaN(p))
              : [];
            return {
              id: product.id,
              name: product.name,
              image_url: product.image_url,
              category: product.category || "Uncategorized",
              minPrice: prices.length > 0 ? Math.min(...prices) : 0,
              maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
              variantCount: Array.isArray(product.variants) ? product.variants.length : 0,
            };
          });
          setProducts(formatted);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
      } catch {
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      if (sort === "Price: Low to High") return a.minPrice - b.minPrice;
      if (sort === "Price: High to Low") return b.maxPrice - a.maxPrice;
      return 0;
    });
    return sorted.filter(p => filter === "All" || p.category === filter);
  }, [products, filter, sort]);

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="mb-10 text-center md:text-left">
          <span className="inline-block text-label font-medium text-primary-500 uppercase tracking-widest mb-3">Our Collection</span>
          <h1 className="text-display-md font-display text-neutral-900 mb-4">Shop All Gear</h1>
          <p className="text-body-lg text-neutral-600 max-w-2xl">
            Discover premium collars, leashes, harnesses and more. Choose the right size variant before checkout.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filter toggle */}
          <button
            className="lg:hidden flex items-center justify-center gap-2 w-full bg-white border border-neutral-300 py-3 rounded-lg font-medium text-body-md shadow-sm hover:border-primary-400 transition-colors"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <span>Filters & Sort</span>
          </button>

          {/* Sidebar filters */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block w-full lg:w-60 flex-shrink-0 bg-white p-6 rounded-xl shadow-sm border border-neutral-100 h-max sticky top-28`}>
            <div className="flex items-center gap-2 mb-6 text-neutral-900 border-b border-neutral-100 pb-4">
              <span className="font-display font-semibold text-heading-sm">Filters</span>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="font-medium text-neutral-900 text-body-md mb-4">Category</h3>
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li key={category}>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={filter === category}
                          onChange={() => setFilter(category)}
                          className="w-4 h-4 accent-primary-500 border-neutral-300"
                        />
                        <span className={`text-body-sm transition-colors ${filter === category ? 'text-primary-600 font-medium' : 'text-neutral-600 group-hover:text-neutral-900'}`}>
                          {category}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 text-body-md mb-4">Sort</h3>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full border-neutral-200 rounded-lg py-2 pl-3 pr-8 text-body-sm bg-neutral-50 outline-none focus:border-primary-500 border"
                >
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
              <p className="text-body-sm text-neutral-500 font-medium">
                {loading ? 'Loading products...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
              </p>
              <div className="flex items-center gap-3 mt-3 sm:mt-0">
                <span className="text-body-sm text-neutral-600 hidden sm:block">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border-neutral-200 rounded-lg py-2 pl-3 pr-8 text-body-sm bg-neutral-50 outline-none focus:border-primary-500 border"
                >
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-80 bg-neutral-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-xl border border-dashed border-neutral-300">
                <p className="text-body-lg text-neutral-500 mb-4">No products found matching your filters.</p>
                <button onClick={() => setFilter('All')} className="text-primary-600 font-medium hover:underline text-body-md">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-neutral-100"
                  >
                    <div className="relative aspect-square overflow-hidden bg-neutral-100">
                      {product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={getImageSrc(product.image_url)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-neutral-400 text-body-sm">No Image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <Badge variant="neutral" size="small" className="mb-2">{product.category}</Badge>
                      <h3 className="font-display font-semibold text-neutral-900 text-heading-sm mb-2 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                      <div className="flex items-baseline gap-2 mb-1">
                        <p className="text-heading-md font-display font-semibold text-primary-600">₹{product.minPrice}</p>
                        {product.minPrice !== product.maxPrice && (
                          <p className="text-body-sm text-neutral-500">– ₹{product.maxPrice}</p>
                        )}
                      </div>
                      <p className="text-body-sm text-neutral-500">{product.variantCount} sizes available</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
