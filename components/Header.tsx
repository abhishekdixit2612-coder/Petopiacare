'use client';

import Link from 'next/link';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import GlobalSearch from '@/components/GlobalSearch';

const navItems = [
  { label: 'Shop',             href: '/products' },
  { label: 'Learn',            href: '/learn' },
  { label: 'Digital Products', href: '/digital-products' },
  { label: 'Companion',        href: '/companion' },
  { label: 'About',            href: '/about' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => { setMounted(true); }, []);

  const cartCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <header className="sticky top-0 z-50 bg-forest-500 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo — white inverted on forest */}
          <Link href="/" className="flex items-center flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/primary.png"
              alt="PetopiaCare"
              className="h-9 w-auto object-contain brightness-0 invert"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body-md text-white/70 hover:text-white transition-colors font-medium whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2">
            <GlobalSearch />

            {/* Cart */}
            <Link href="/cart" className="relative p-2">
              <ShoppingCart size={20} className="text-white/80 hover:text-white transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-forest-600 rounded-lg transition-colors"
            >
              {mobileMenuOpen
                ? <X size={24} className="text-white" />
                : <Menu size={24} className="text-white" />
              }
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-forest-600 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-body-md text-white/80 hover:bg-forest-600 hover:text-white rounded-lg transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
