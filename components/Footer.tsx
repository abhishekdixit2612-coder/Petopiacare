"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-primary-500 text-white pt-20 pb-8 border-t-4 border-secondary-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Image src="/logos/secondary.png" alt="PetopiaCare" width={140} height={50} className="object-contain" />
            </div>
            <p className="text-primary-200 mb-6 font-body text-body-md leading-relaxed max-w-sm">
              Premium dog products trusted by thousands of Indian pet parents. Quality you can feel, comfort they can sense. Designed with care for Indian dogs and families.
            </p>
            <div className="space-y-2 text-body-sm text-primary-200">
              <p>📞 +91 9667742377</p>
              <p>💬 <a href="https://wa.me/919667742377" className="text-white hover:text-secondary-300 transition-colors">WhatsApp</a></p>
              <p>📧 support@petopiacare.in</p>
              <p>📍 Indirapuram, Ghaziabad</p>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="font-display text-heading-sm font-semibold mb-6 text-white tracking-wide">About</h3>
            <ul className="space-y-4 text-body-md text-primary-200">
              <li><Link href="/about" className="hover:text-white hover:translate-x-1 inline-block transition-all">About Us</Link></li>
              <li><Link href="/about#mission" className="hover:text-white hover:translate-x-1 inline-block transition-all">Our Mission</Link></li>
              <li><Link href="/about#values" className="hover:text-white hover:translate-x-1 inline-block transition-all">Why PetopiaCare</Link></li>
              <li><Link href="/about#team" className="hover:text-white hover:translate-x-1 inline-block transition-all">Team</Link></li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-display text-heading-sm font-semibold mb-6 text-white tracking-wide">Shop</h3>
            <ul className="space-y-4 text-body-md text-primary-200">
              <li><Link href="/products" className="hover:text-white hover:translate-x-1 inline-block transition-all">All Products</Link></li>
              <li><Link href="/products?category=Harnesses" className="hover:text-white hover:translate-x-1 inline-block transition-all">Harnesses</Link></li>
              <li><Link href="/products?category=Leashes" className="hover:text-white hover:translate-x-1 inline-block transition-all">Leashes</Link></li>
              <li><Link href="/products?category=Grooming" className="hover:text-white hover:translate-x-1 inline-block transition-all">Grooming</Link></li>
              <li><Link href="/products?category=Accessories" className="hover:text-white hover:translate-x-1 inline-block transition-all">Accessories</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display text-heading-sm font-semibold mb-6 text-white tracking-wide">Resources</h3>
            <ul className="space-y-4 text-body-md text-primary-200">
              <li><Link href="/blog" className="hover:text-white hover:translate-x-1 inline-block transition-all">Blog</Link></li>
              <li><Link href="/digital-products" className="hover:text-white hover:translate-x-1 inline-block transition-all">Digital Products</Link></li>
              <li><Link href="/digital-products?category=Checklist" className="hover:text-white hover:translate-x-1 inline-block transition-all">Free Guides</Link></li>
              <li><Link href="/faq" className="hover:text-white hover:translate-x-1 inline-block transition-all">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-all">Shipping Info</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-primary-400 pt-10 mb-10">
          <div className="max-w-xl mx-auto text-center">
            <h4 className="font-display text-heading-sm text-white mb-2">Get 10% Off Your First Order</h4>
            <p className="text-body-sm text-primary-200 mb-4">Join our newsletter for exclusive deals and free guides.</p>
            {subscribed ? (
              <p className="text-success-500 font-medium">✓ Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-4 py-2 rounded-md bg-primary-400 border border-primary-300 text-white placeholder-primary-200 text-body-md outline-none focus:border-secondary-300 transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-secondary-300 hover:bg-secondary-400 text-neutral-900 font-medium rounded-md text-body-sm transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-400 pt-8 flex flex-col md:flex-row justify-between items-center text-body-sm text-primary-200">
          <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} PetopiaCare. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
