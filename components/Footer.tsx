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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="col-span-1">
             <div className="mb-6">
                <Image src="/logos/secondary.png" alt="PetopiaCare" width={140} height={50} className="object-contain" />
             </div>
            <p className="text-[#C8E3E2] mb-6 font-secondary text-sm leading-relaxed max-w-sm">
              Premium dog products trusted by thousands of Indian pet parents. Quality you can feel, comfort they can sense. Designed with love and expert backing.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-primary text-xl font-bold mb-6 text-white tracking-wide">Explore</h3>
            <ul className="space-y-4 text-[15px] text-[#C8E3E2]">
              <li><Link href="/products" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Shop All Gear</Link></li>
              <li><Link href="/blog" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Petopia Blog</Link></li>
              <li><Link href="/digital-products" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Guides & Courses</Link></li>
              <li><Link href="/about" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Our Story</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h3 className="font-primary text-xl font-bold mb-6 text-white tracking-wide">Support</h3>
            <ul className="space-y-4 text-[15px] text-[#C8E3E2]">
              <li><Link href="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Contact Us</Link></li>
              <li><Link href="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Track Order</Link></li>
              <li><Link href="/refund" className="hover:text-white hover:translate-x-1 inline-block transition-premium">Returns & Refunds</Link></li>
              <li className="flex items-start space-x-3 mt-6 pt-4 border-t border-[#1A7D80]/50">
                <MapPin className="w-5 h-5 text-[#FFD166] flex-shrink-0 mt-0.5" />
                <span className="text-sm">123 Pet Lane, Suite 100<br/>Mumbai, MH 400001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#FFD166]" />
                <span className="text-sm">hello@petopiacare.in</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Social */}
          <div>
            <h3 className="font-primary text-xl font-bold mb-6 text-white tracking-wide">Join the Pack</h3>
            <p className="text-sm text-[#C8E3E2] mb-4">Subscribe for exclusive training tips and early access to new drops.</p>
            
            <form onSubmit={handleSubscribe} className="relative mb-8">
              <input 
                type="email" 
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A7D80]/40 border border-[#1A7D80] rounded-lg py-3 px-4 text-white placeholder-[#C8E3E2]/70 focus:outline-none focus:border-[#FFD166] transition-premium"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-[#F2A65A] hover:bg-orange-500 text-white p-2 rounded-md transition-premium"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            {subscribed && <p className="text-[#FFD166] text-sm -mt-6 mb-6">Thanks for subscribing!</p>}

            <h4 className="text-sm font-semibold mb-4 text-[#C8E3E2] uppercase tracking-wider">Follow Us</h4>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-full bg-[#1A7D80] flex items-center justify-center hover:bg-[#F2A65A] transition-premium text-white font-bold text-sm">IG</a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1A7D80] flex items-center justify-center hover:bg-[#F2A65A] transition-premium text-white font-bold text-sm">FB</a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1A7D80] flex items-center justify-center hover:bg-[#F2A65A] transition-premium text-white font-bold text-sm">X</a>
            </div>
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
