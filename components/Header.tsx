'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { designTokens } from '@/lib/design-tokens';
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
    <header
      className="sticky top-0 z-50 bg-white border-b border-neutral-200"
      style={{ boxShadow: designTokens.shadows.sm }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/primary.png" alt="PetopiaCare" className="h-10 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body-md text-neutral-700 hover:text-primary-600 transition-colors font-medium whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Global search (renders its own trigger button + modal) */}
            <GlobalSearch />

            {/* Cart */}
            <Link href="/cart" className="relative p-2">
              <ShoppingCart size={20} className="text-neutral-700 hover:text-primary-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-error-500 text-white text-label-sm rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-md transition-colors"
            >
              {mobileMenuOpen ? <X size={24} className="text-neutral-900" /> : <Menu size={24} className="text-neutral-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-neutral-200 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-body-md text-neutral-700 hover:bg-primary-50 hover:text-primary-600 rounded-md transition-colors"
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
