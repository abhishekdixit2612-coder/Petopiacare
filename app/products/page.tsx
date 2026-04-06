"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
  {
    id: 'p1',
    name: 'Saffron Comfort Dog Harness',
    image_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80',
    category: 'Harnesses',
    minPrice: 899,
    maxPrice: 1299,
    variantCount: 3,
  },
  {
    id: 'p2',
    name: 'Eco Leash with Leather Handle',
    image_url: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80',
    category: 'Leashes',
    minPrice: 499,
    maxPrice: 699,
    variantCount: 2,
  },
  {
    id: 'p3',
    name: 'Cooling Mesh Dog Bed',
    image_url: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=800&q=80',
    category: 'Beds',
    minPrice: 1399,
    maxPrice: 1899,
    variantCount: 4,
  },
  {
    id: 'p4',
    name: 'Gentle Grooming Kit',
    image_url: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&q=80',
    category: 'Grooming',
    minPrice: 599,
    maxPrice: 599,
    variantCount: 1,
  },
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
              ? product.variants.map((variant: any) => Number(variant.price)).filter((price: number) => !Number.isNaN(price))
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
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(products.map((product) => product.category).filter(Boolean))),
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      if (sort === "Price: Low to High") return a.minPrice - b.minPrice;
      if (sort === "Price: High to Low") return b.maxPrice - a.maxPrice;
      return 0;
    });

    return sorted.filter((product) => filter === "All" || product.category === filter);
  }, [products, filter, sort]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-primary font-bold text-[#1C1C1C] mb-4">Shop All Gear</h1>
          <p className="text-gray-600 text-lg max-w-2xl">Discover premium collars, leashes, harnesses and more. Choose the right size variant before checkout.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <button
            className="lg:hidden flex items-center justify-center gap-2 w-full bg-white border border-gray-300 py-3 rounded-lg font-semibold shadow-sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <span className="text-sm">Filters & Sort</span>
          </button>

          <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-max sticky top-28`}>
            <div className="flex items-center gap-2 mb-6 text-gray-900 border-b border-gray-100 pb-4">
              <span className="text-lg font-semibold">Filters</span>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Category</h3>
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li key={category}>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={filter === category}
                          onChange={() => setFilter(category)}
                          className="w-4 h-4 text-[#1A7D80] border-gray-300 focus:ring-[#1A7D80]"
                        />
                        <span className={`text-sm transition-colors ${filter === category ? 'text-[#1A7D80] font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                          {category}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Sort</h3>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full border-gray-200 rounded-lg shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80] py-2 pl-3 pr-10 text-sm bg-gray-50 outline-none"
                >
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm font-medium">
                {loading ? 'Loading products...' : `Showing ${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'}`}
              </p>
              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border-gray-200 rounded-lg shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80] py-2 pl-3 pr-10 text-sm bg-gray-50 outline-none"
                >
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-gray-500">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-300 mt-8">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                <button onClick={() => setFilter('All')} className="mt-4 text-[#1A7D80] font-bold hover:underline">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`} className="group bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-lg transition">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      {product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                      <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                      <div className="flex items-baseline gap-2 mb-2">
                        <p className="text-lg font-bold text-teal-600">₹{product.minPrice}</p>
                        {product.minPrice !== product.maxPrice && (
                          <p className="text-sm text-gray-600">- ₹{product.maxPrice}</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{product.variantCount} sizes available</p>
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
