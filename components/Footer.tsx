"use client";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if(email) {
      // In real app, push to supbase
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#2B7A8F] text-white pt-20 pb-8 border-t-[6px] border-[#F2A65A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2">
             <div className="mb-6">
                <Image src="/logos/secondary.png" alt="PetopiaCare" width={140} height={50} className="object-contain" />
             </div>
            <p className="text-[#C8E3E2] mb-6 font-secondary text-sm leading-relaxed max-w-sm">
              Premium dog products trusted by thousands of Indian pet parents. Quality you can feel, comfort they can sense. Designed with care for Indian dogs and families.
            </p>
            <div className="space-y-3 text-sm text-[#C8E3E2]">
              <p>📞 +91 9667742377</p>
              <p>💬 <a href="https://wa.me/919667742377" className="text-white hover:text-[#FFD166]">WhatsApp</a></p>
              <p>📧 support@petopiacare.in</p>
              <p>📍 Indirapuram, Ghaziabad</p>
            </div>
          </div>

          <div>
            <h3 className="font-primary text-xl font-bold mb-6 text-white tracking-wide">About</h3>
            <ul className="space-y-4 text-[15px] text-[#C8E3E2]">
              <li><Link href="/about" className="hover:text-white hover:translate-x-1 inline-block transition-premium">About Us</Link></li>
              <li><Link href="/about#mission" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Our Mission</Link></li>
              <li><Link href="/about#values" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Why PetopiaCare</Link></li>
              <li><Link href="/about#team" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Team</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-primary text-xl font-bold mb-6 text-white tracking-wide">Shop</h3>
            <ul className="space-y-4 text-[15px] text-[#C8E3E2]">
              <li><Link href="/products" className="hover:text-white hover:translate-x-1 inline-block transition-premium">All Products</Link></li>
              <li><Link href="/products?category=Harnesses" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Harnesses</Link></li>
              <li><Link href="/products?category=Leashes" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Leashes</Link></li>
              <li><Link href="/products?category=Grooming" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Grooming</Link></li>
              <li><Link href="/products?category=Accessories" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-primary text-xl font-bold mb-6 text-white tracking-wide">Resources</h3>
            <ul className="space-y-4 text-[15px] text-[#C8E3E2]">
              <li><Link href="/blog" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Blog</Link></li>
              <li><Link href="/digital-products" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Digital Products</Link></li>
              <li><Link href="/digital-products?category=Checklist" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Free Guides</Link></li>
              <li><Link href="/faq" className="hover:text-white hover:translate-x-1 inline-block transition-premium">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Shipping Info</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1A7D80] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#C8E3E2]">
          <p className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} PetopiaCare. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-white transition-premium">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-premium">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
