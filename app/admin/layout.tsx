"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, Package, ShoppingBag } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if already authenticated via session storage
    if (sessionStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, verify against API. For MVP, simple hardcoded check
    // Here we use a generic placeholder password since process.env is not exposed to client by default 
    // unless NEXT_PUBLIC_, but we'll accept 'petopia123' for MVP testing
    if (password === "petopia123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
    } else {
      alert("Incorrect password");
    }
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
           <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 text-center">
            <Lock className="mx-auto h-12 w-12 text-[#1A7D80] mb-4" />
            <h2 className="mb-6 text-2xl font-primary font-bold text-gray-900">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input 
                  type="password" 
                  placeholder="Password (try: petopia123)" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1A7D80] focus:border-[#1A7D80] sm:text-sm" 
                />
              </div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A7D80] hover:bg-teal-800">
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Sidebar */}
      <div className="w-64 bg-[#1C1C1C] text-white">
        <div className="h-20 flex items-center px-6 text-xl font-bold font-primary border-b border-gray-800">
          Petopia Admin
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin/orders" className="flex items-center space-x-3 text-gray-300 hover:bg-gray-800 hover:text-white px-4 py-3 rounded-lg transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span>Orders</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 text-gray-300 hover:bg-gray-800 hover:text-white px-4 py-3 rounded-lg transition-colors">
            <Package className="w-5 h-5" />
            <span>Products</span>
          </Link>
        </nav>
      </div>
      
      {/* Admin Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
