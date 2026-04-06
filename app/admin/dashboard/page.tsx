'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Package, BookOpen, Settings, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalBlogPosts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch product count
        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Fetch blog post count
        const { count: blogCount } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true });

        // Fetch order count
        const { count: orderCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        // Fetch total revenue
        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount');

        const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

        setStats({
          totalProducts: productCount || 0,
          totalBlogPosts: blogCount || 0,
          totalOrders: orderCount || 0,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    // Clear session cookie
    document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logos/primary.png"
              alt="PetopiaCare"
              width={120}
              height={50}
              className="mr-6"
            />
            <h1 className="text-xl font-bold text-gray-900 border-l border-gray-200 pl-6">Admin Control</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 hover:text-red-600 text-gray-700 px-4 py-2 rounded-lg transition-premium font-semibold shadow-sm text-sm"
          >
            <LogOut size={16} />
            Secure Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading ? (
          <div className="flex items-center justify-center py-32 text-gray-500 font-bold animate-pulse">Syncing Vault Data...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Products */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Products</p>
                  <Package size={24} className="text-[#1A7D80]" />
                </div>
                <p className="text-4xl font-primary font-bold text-gray-900">{stats.totalProducts}</p>
              </div>

              {/* Total Blog Posts */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Blog Posts</p>
                  <BookOpen size={24} className="text-blue-600" />
                </div>
                <p className="text-4xl font-primary font-bold text-gray-900">{stats.totalBlogPosts}</p>
              </div>

              {/* Total Orders */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Orders</p>
                  <Package size={24} className="text-green-600" />
                </div>
                <p className="text-4xl font-primary font-bold text-gray-900">{stats.totalOrders}</p>
              </div>

              {/* Total Revenue */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Revenue</p>
                  <span className="text-[#F2A65A] font-bold">₹</span>
                </div>
                <p className="text-4xl font-primary font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Products Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#C8E3E2] rounded-full flex items-center justify-center text-[#1A7D80]">
                    <Package size={24} />
                  </div>
                  <h2 className="text-2xl font-bold font-primary text-gray-900">Inventory</h2>
                </div>
                <p className="text-gray-600 mb-8 max-w-sm">Manage physical products, update stock quantities, and adjust pricing.</p>
                <div className="flex gap-4">
                  <Link
                    href="/admin/products"
                    className="flex-1 bg-white border-2 border-gray-200 hover:border-[#1A7D80] text-gray-700 hover:text-[#1A7D80] font-bold py-3 px-4 rounded-xl text-center transition-premium"
                  >
                    View All
                  </Link>
                  <Link
                    href="/admin/products/new"
                    className="flex-1 bg-[#1A7D80] hover:bg-[#126265] text-white font-bold py-3 px-4 rounded-xl text-center shadow-md transition-premium"
                  >
                    + Add Product
                  </Link>
                  <Link
                    href="/admin/import"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl text-center shadow-md transition-premium flex items-center justify-center gap-2"
                  >
                    <Upload size={18} />
                    Import CSV
                  </Link>
                </div>
              </div>

              {/* Blog Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <BookOpen size={24} />
                  </div>
                  <h2 className="text-2xl font-bold font-primary text-gray-900">Content Hub</h2>
                </div>
                <p className="text-gray-600 mb-8 max-w-sm">Write SEO-optimized blog posts, manage metadata, and toggle publishing states.</p>
                <div className="flex gap-4">
                  <Link
                    href="/admin/blog"
                    className="flex-1 bg-white border-2 border-gray-200 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-bold py-3 px-4 rounded-xl text-center transition-premium"
                  >
                    View Posts
                  </Link>
                  <Link
                    href="/admin/blog/new"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-center shadow-md transition-premium"
                  >
                    + Write Post
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Settings Background Plate */}
            <div className="mt-12 text-center opacity-40 hover:opacity-100 transition-opacity">
              <Link href="/admin/settings" className="inline-flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-sm">
                <Settings size={16} /> Advanced Settings
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
