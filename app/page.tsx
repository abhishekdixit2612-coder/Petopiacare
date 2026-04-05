"use client";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import BannerCarousel from "@/components/BannerCarousel";
import { ArrowRight, ShieldCheck, Heart, Truck, Star, Award, BookOpen } from "lucide-react";

const featuredProducts = [
  { id: "1", name: "Classic Teal Collar", price: 499, category: "Collars", image_url: "https://images.unsplash.com/photo-1605365859556-9dccdb0e3092?w=800&q=80" },
  { id: "2", name: "Comfort Harness Orange", price: 899, category: "Harnesses", image_url: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80" },
  { id: "3", name: "Durable Training Leash", price: 599, category: "Leashes", image_url: "https://images.unsplash.com/photo-1605365859346-a4a3501a4fc6?w=800&q=80" },
  { id: "4", name: "Premium Squeaky Toy", price: 299, category: "Toys", image_url: "https://images.unsplash.com/photo-1576624933939-9d54e4708709?w=800&q=80" },
];

const mockBlogs = [
  { id: "b1", title: "Best Dog Food Brands in India (2025 Review)", category: "Nutrition", date: "Mar 15, 2025", readTime: "5 min", image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&q=80", slug: "best-dog-food-brands-india" },
  { id: "b2", title: "Stop Dog Pulling on Leash: Training Tips", category: "Training", date: "Mar 10, 2025", readTime: "4 min", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80", slug: "stop-dog-pulling-leash" },
  { id: "b3", title: "Summer Dog Care in India: Hydration Guide", category: "Health", date: "Mar 05, 2025", readTime: "6 min", image: "https://images.unsplash.com/photo-1537151608804-ea6f25dc1005?w=800&q=80", slug: "summer-dog-care-india" }
];

const testimonials = [
  { name: "Priya Sharma", dog: "Luna (Golden Retriever)", text: "The teal collar is stunning and the quality is unmatched. Luna looks so beautiful!" },
  { name: "Rahul Deshmukh", dog: "Bruno (Indie)", text: "Finally an Indian brand that understands our pets' needs. The harness fits Bruno perfectly." },
  { name: "Anjali Gupta", dog: "Max (Beagle)", text: "Fast delivery to Bangalore and the training leash has been a life saver for our walks." },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION (Banner Carousel) */}
      <BannerCarousel />

      {/* 2. VALUE PROPOSITION (Why Choose Us) */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-primary text-3xl md:text-4xl font-bold text-[#1C1C1C]">Why Choose PetopiaCare?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div className="bg-white p-8 rounded-2xl shadow-premium text-center hover:-translate-y-2 transition-premium border border-gray-100">
              <div className="w-16 h-16 mx-auto bg-[#C8E3E2] text-[#1A7D80] rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="font-primary font-bold text-xl text-gray-900 mb-4">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Every single product is field-tested with our own pets to guarantee strength, durability, and absolute safety for your furry companion.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-premium text-center hover:-translate-y-2 transition-premium border border-gray-100 mt-0 md:-mt-6">
              <div className="w-16 h-16 mx-auto bg-[#FFD166]/30 text-[#F2A65A] rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-primary font-bold text-xl text-gray-900 mb-4">India-First Design</h3>
              <p className="text-gray-600 leading-relaxed">
                Tired of imported gear tearing apart? We engineer materials specifically suited for the unpredictable Indian climates and active Indies.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-premium text-center hover:-translate-y-2 transition-premium border border-gray-100">
              <div className="w-16 h-16 mx-auto bg-[#C8E3E2] text-[#1A7D80] rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="font-primary font-bold text-xl text-gray-900 mb-4">Expert Guidance</h3>
              <p className="text-gray-600 leading-relaxed">
                We don't just sell products. Access our library of free training guides, nutrition tips, and behavioral advice from certified experts.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (Best Sellers) */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="font-primary text-3xl md:text-4xl font-bold text-[#1C1C1C] mb-4">Best Sellers</h2>
              <p className="text-gray-600 text-lg">Top-rated gear rigorously tested for the perfect walk.</p>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-2 text-[#1A7D80] font-semibold hover:text-teal-800 transition-premium">
              Shop All Products <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/products" className="inline-flex items-center gap-2 border-2 border-[#1A7D80] text-[#1A7D80] hover:bg-[#1A7D80] hover:text-white font-semibold py-3 px-8 rounded-full transition-premium">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS */}
      <section className="py-24 bg-[#1A7D80] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-primary text-3xl md:text-4xl font-bold mb-4 text-[#FFD166]">Happy Pups & Parents</h2>
            <p className="text-[#C8E3E2] text-lg max-w-2xl mx-auto">Join the ever-growing PetopiaCare family.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-[#0d4648] p-8 rounded-2xl shadow-lg border border-[#2B7A8F]">
                <div className="flex text-[#FFD166] mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-lg leading-relaxed text-gray-100 mb-6 italic">"{t.text}"</p>
                <div>
                  <h4 className="font-bold text-white font-primary">{t.name}</h4>
                  <p className="text-[#F2A65A] text-sm">{t.dog}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LATEST BLOG POSTS */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-primary text-3xl md:text-4xl font-bold text-[#1C1C1C] mb-4">Latest from the Blog</h2>
              <p className="text-gray-600 text-lg">Expert advice, nutrition tips, and training tricks.</p>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-[#F2A65A] font-semibold hover:text-orange-600 transition-premium">
              Read Our Blog <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockBlogs.map(blog => (
              <Link href={`/blog/${blog.slug}`} key={blog.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-premium border border-gray-100">
                <div className="h-60 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-premium duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1A7D80] uppercase tracking-wider">
                    {blog.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-sm text-gray-500 mb-3 font-medium">{blog.date} • {blog.readTime}</div>
                  <h3 className="font-primary font-bold text-xl text-gray-900 mb-4 group-hover:text-[#1A7D80] transition-colors">{blog.title}</h3>
                  <div className="mt-auto pt-6 border-t border-gray-100 text-[#F2A65A] font-semibold flex items-center gap-2">
                    Read Post <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER FULL WIDTH */}
      <section className="py-20 bg-[#F2A65A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-primary text-3xl md:text-4xl font-bold mb-4">Get 10% Off Your First Order</h2>
          <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
            Join the PetopiaCare newsletter for exclusive discounts, free training resources, and first access to new drops!
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address..." 
              required
              className="flex-1 py-4 px-6 rounded-lg text-gray-900 border-none focus:ring-4 focus:ring-white/30 outline-none"
            />
            <button className="bg-[#1C1C1C] hover:bg-black text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-premium tracking-wide">
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
