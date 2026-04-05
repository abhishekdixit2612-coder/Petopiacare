"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Search, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Hydration fix for zustand persist
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Basic implementation for MVP. Can route to a search results page
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className={`sticky top-0 z-50 transition-premium w-full ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-premium' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex justify-between items-center h-[40px] md:h-[50px]">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="block">
              {/* Desktop Logo */}
              <div className="hidden md:block">
                <Image src="/logos/primary.png" alt="PetopiaCare" width={150} height={50} className="object-contain w-auto h-[50px]" priority />
              </div>
              {/* Mobile Logo */}
              <div className="block md:hidden">
                <Image src="/logos/primary.png" alt="PetopiaCare" width={120} height={40} className="object-contain w-auto h-[40px]" priority />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8 items-center">
            <Link href="/" className="text-gray-700 hover:text-[#1A7D80] font-medium transition-premium tracking-wide">Home</Link>
            <Link href="/products" className="text-gray-700 hover:text-[#1A7D80] font-medium transition-premium tracking-wide">Shop</Link>
            <Link href="/blog" className="text-gray-700 hover:text-[#1A7D80] font-medium transition-premium tracking-wide">Blog</Link>
            <Link href="/digital-products" className="text-gray-700 hover:text-[#1A7D80] font-medium transition-premium tracking-wide">Digital Products</Link>
            <Link href="/about" className="text-gray-700 hover:text-[#1A7D80] font-medium transition-premium tracking-wide">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#1A7D80] font-medium transition-premium tracking-wide">Contact</Link>
          </nav>

          {/* Actions (Search, Cart, User, Toggle) */}
          <div className="flex items-center space-x-3 md:space-x-5">
            
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex relative items-center">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7D80]/20 focus:border-[#1A7D80] transition-premium w-48 xl:w-64 bg-gray-50 hover:bg-white"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
            </form>

            {/* Account Icon */}
            <Link href="/admin/layout" className="hidden sm:block p-2 text-gray-700 hover:text-[#1A7D80] transition-premium">
              <User className="w-[22px] h-[22px]" />
            </Link>

            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-[#1A7D80] transition-premium flex items-center group">
              <ShoppingCart className="w-[22px] h-[22px]" />
              {mounted && cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#F2A65A] rounded-full shadow-sm group-hover:scale-110 transition-premium">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-gray-700 hover:text-[#1A7D80] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[64px] md:top-[82px] bg-black/40 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="w-[85%] max-w-sm h-full bg-white shadow-2xl p-6 flex flex-col space-y-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="relative mb-4">
              <input 
                type="text" 
                placeholder="Search products & blogs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#1A7D80]"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </form>

            <div className="flex flex-col space-y-4">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">Home</Link>
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">Shop</Link>
              <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">Blog</Link>
              <Link href="/digital-products" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">Digital Products</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">About Us</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">Contact</Link>
              <Link href="/admin/layout" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-900 pb-3">My Account</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
