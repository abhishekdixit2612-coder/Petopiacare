"use client";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { supabase } from "@/lib/supabase";
import { ShoppingCart } from "lucide-react";

interface Variant {
  id: string;
  option1_value: string;
  variant_name: string;
  price: number;
  stock_quantity: number;
  sku: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
}

const MOCK_PRODUCTS: Array<Product & { variants: Variant[] }> = [
  {
    id: 'p1',
    name: 'Saffron Comfort Dog Harness',
    description: 'A breathable, adjustable harness designed for everyday walks and active dogs.',
    image_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80',
    category: 'Harnesses',
    variants: [
      { id: 'p1v1', option1_value: 'Small', variant_name: 'Small', price: 899, stock_quantity: 12, sku: 'HARN-SM-001' },
      { id: 'p1v2', option1_value: 'Medium', variant_name: 'Medium', price: 999, stock_quantity: 18, sku: 'HARN-MD-001' },
      { id: 'p1v3', option1_value: 'Large', variant_name: 'Large', price: 1299, stock_quantity: 8, sku: 'HARN-LG-001' },
    ],
  },
  {
    id: 'p2',
    name: 'Eco Leash with Leather Handle',
    description: 'Durable, eco-friendly leash with a soft leather handle for easy grip and comfort.',
    image_url: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80',
    category: 'Leashes',
    variants: [
      { id: 'p2v1', option1_value: 'Single Size', variant_name: 'Single Size', price: 499, stock_quantity: 25, sku: 'LEAS-01' },
      { id: 'p2v2', option1_value: 'Premium', variant_name: 'Premium', price: 699, stock_quantity: 14, sku: 'LEAS-02' },
    ],
  },
  {
    id: 'p3',
    name: 'Cooling Mesh Dog Bed',
    description: 'Soft and supportive bed with cooling mesh fabric, ideal for warm weather and restful sleep.',
    image_url: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=800&q=80',
    category: 'Beds',
    variants: [
      { id: 'p3v1', option1_value: 'Small', variant_name: 'Small', price: 1399, stock_quantity: 20, sku: 'BED-SM-01' },
      { id: 'p3v2', option1_value: 'Large', variant_name: 'Large', price: 1899, stock_quantity: 10, sku: 'BED-LG-01' },
    ],
  },
];

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("id,name,description,image_url,category")
          .eq("id", params.id)
          .single();

        const { data: variantData, error: variantError } = await supabase
          .from("variants")
          .select("id,option1_value,variant_name,price,stock_quantity,sku")
          .eq("product_id", params.id)
          .order("created_at", { ascending: true });

        if (productError || !productData) {
          const fallback = MOCK_PRODUCTS.find((item) => item.id === params.id);
          if (fallback) {
            setProduct(fallback);
            setVariants(fallback.variants);
            setSelectedVariant(fallback.variants[0] || null);
            return;
          }
        }

        if (variantError || !variantData || variantData.length === 0) {
          const fallback = MOCK_PRODUCTS.find((item) => item.id === params.id);
          if (fallback) {
            setProduct(fallback);
            setVariants(fallback.variants);
            setSelectedVariant(fallback.variants[0] || null);
            return;
          }
        }

        setProduct(productData as Product | null);
        setVariants((variantData as Variant[] | null) || []);
        setSelectedVariant((variantData as Variant[] | null)?.[0] || null);
      } catch (error) {
        console.error("Error loading product:", error);
        const fallback = MOCK_PRODUCTS.find((item) => item.id === params.id);
        if (fallback) {
          setProduct(fallback);
          setVariants(fallback.variants);
          setSelectedVariant(fallback.variants[0] || null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addToCart({
      id: selectedVariant.id,
      product_id: product.id,
      variant_id: selectedVariant.id,
      sku: selectedVariant.sku,
      name: `${product.name} (${selectedVariant.option1_value})`,
      price: selectedVariant.price,
      image_url: product.image_url,
      quantity: 1,
    });

    alert("Added to cart!");
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="relative overflow-hidden rounded-3xl bg-gray-100 border border-gray-200">
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex h-96 items-center justify-center text-gray-400">No image available</div>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {variants.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Size:</label>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stock_quantity === 0}
                    className={`px-4 py-2 rounded-lg font-medium transition border ${
                      selectedVariant?.id === variant.id
                        ? 'bg-teal-600 text-white border-teal-600'
                        : variant.stock_quantity > 0
                        ? 'border-gray-300 text-gray-700 hover:border-teal-600'
                        : 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                    }`}
                  >
                    {variant.option1_value}
                    {variant.stock_quantity === 0 && ' (Out)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedVariant && (
            <div className="mb-6">
              <p className="text-3xl font-bold text-teal-600 mb-2">₹{selectedVariant.price}</p>
              <p className={`text-sm font-semibold ${selectedVariant.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {selectedVariant.stock_quantity > 0
                  ? `${selectedVariant.stock_quantity} in stock`
                  : 'Out of stock'}
              </p>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
