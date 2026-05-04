'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Package, BookOpen, Settings, Upload, Download } from 'lucide-react';
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
        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        const { count: blogCount } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true });

        const { count: orderCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

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
    document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/logos/primary.png" alt="PetopiaCare" width={120} height={50} className="mr-6" />
            <h1 className="font-display text-heading-md font-semibold text-neutral-900 border-l border-neutral-200 pl-6">Admin Control</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white border border-neutral-300 hover:bg-neutral-50 hover:text-error-600 text-neutral-700 px-4 py-2 rounded-lg transition-all font-semibold shadow-sm text-body-sm"
          >
            <LogOut size={16} />
            Secure Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32 text-neutral-400 font-bold animate-pulse">Syncing Vault Data...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-neutral-500 text-label font-semibold uppercase tracking-wider">Total Products</p>
                  <Package size={24} className="text-primary-600" />
                </div>
                <p className="font-display text-display-sm font-bold text-neutral-900">{stats.totalProducts}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-neutral-500 text-label font-semibold uppercase tracking-wider">Blog Posts</p>
                  <BookOpen size={24} className="text-primary-600" />
                </div>
                <p className="font-display text-display-sm font-bold text-neutral-900">{stats.totalBlogPosts}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-neutral-500 text-label font-semibold uppercase tracking-wider">Total Orders</p>
                  <Package size={24} className="text-success-700" />
                </div>
                <p className="font-display text-display-sm font-bold text-neutral-900">{stats.totalOrders}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-neutral-500 text-label font-semibold uppercase tracking-wider">Total Revenue</p>
                  <span className="text-secondary-300 font-bold text-heading-md">₹</span>
                </div>
                <p className="font-display text-display-sm font-bold text-neutral-900">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Products Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                    <Package size={24} />
                  </div>
                  <h2 className="font-display text-heading-lg font-bold text-neutral-900">Inventory</h2>
                </div>
                <p className="text-neutral-600 text-body-sm mb-8 max-w-sm">Manage physical products, update stock quantities, and adjust pricing.</p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/admin/products"
                    className="w-full bg-white border-2 border-neutral-200 hover:border-primary-500 text-neutral-700 hover:text-primary-600 font-bold py-3 px-4 rounded-xl text-center transition-all"
                  >
                    View All
                  </Link>
                  <Link
                    href="/admin/products/new"
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-xl text-center shadow-md transition-all"
                  >
                    + Add Product
                  </Link>
                  <Link
                    href="/admin/import-variants"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl text-center shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Upload size={18} />
                    Import Variants
                  </Link>
                </div>
              </div>

              {/* Blog Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                    <BookOpen size={24} />
                  </div>
                  <h2 className="font-display text-heading-lg font-bold text-neutral-900">Content Hub</h2>
                </div>
                <p className="text-neutral-600 text-body-sm mb-8 max-w-sm">Write SEO-optimized blog posts, manage metadata, and launch priority content.</p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/admin/blog"
                    className="w-full bg-white border-2 border-neutral-200 hover:border-primary-500 text-neutral-700 hover:text-primary-600 font-bold py-3 px-4 rounded-xl text-center transition-all"
                  >
                    View Posts
                  </Link>
                  <Link
                    href="/admin/blog/new"
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-xl text-center shadow-md transition-all"
                  >
                    + Write Post
                  </Link>
                  <Link
                    href="/admin/blog/seed"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-xl text-center shadow-md transition-all"
                  >
                    Seed Content
                  </Link>
                </div>
              </div>

              {/* Digital Products Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-success-50 rounded-full flex items-center justify-center text-success-700">
                    <Download size={24} />
                  </div>
                  <h2 className="font-display text-heading-lg font-bold text-neutral-900">Digital Products</h2>
                </div>
                <p className="text-neutral-600 text-body-sm mb-8 max-w-sm">Seed free downloads and paid courses for your customers.</p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/digital-products"
                    className="w-full bg-white border-2 border-neutral-200 hover:border-success-500 text-neutral-700 hover:text-success-700 font-bold py-3 px-4 rounded-xl text-center transition-all"
                  >
                    View Catalog
                  </Link>
                  <Link
                    href="/admin/digital-products/new"
                    className="w-full bg-success-500 hover:bg-success-700 text-white font-bold py-3 px-4 rounded-xl text-center shadow-md transition-all"
                  >
                    + Add Digital Products
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center opacity-40 hover:opacity-100 transition-opacity">
              <Link href="/admin/settings" className="inline-flex items-center gap-2 text-neutral-500 font-bold uppercase tracking-widest text-label">
                <Settings size={16} /> Advanced Settings
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
