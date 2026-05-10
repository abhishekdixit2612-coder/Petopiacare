'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, Plus, ArrowLeft, AlertCircle } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  view_count: number;
  created_at: string;
}

const statusStyles: Record<string, string> = {
  published: 'bg-success-50 text-success-700',
  draft: 'bg-warning-50 text-warning-700',
};

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableExists, setTableExists] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/admin/blog-posts');
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          if (res.status === 500 && err.error?.includes('does not exist')) setTableExists(false);
          return;
        }
        const { posts } = await res.json();
        setPosts(posts || []);
      } catch (e) {
        console.error('Error fetching blog posts:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to permanently delete this post?')) return;
    const res = await fetch(`/api/admin/blog-posts/${id}`, { method: 'DELETE' });
    if (res.ok) setPosts(posts.filter(p => p.id !== id));
    else console.error('Delete failed', await res.json());
  };

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-bold mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-display text-display-sm font-semibold text-neutral-900">Blog Management</h1>
            <p className="text-neutral-500 text-body-sm mt-1">Write, edit, and publish SEO optimized articles.</p>
          </div>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
          >
            <Plus size={20} />
            Write New Post
          </Link>
        </div>

        <div className="mb-6 bg-white p-2 rounded-xl shadow-sm border border-neutral-100 flex items-center">
          <input
            type="text"
            placeholder="Search by post title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-transparent text-neutral-900 outline-none text-body-sm"
          />
        </div>

        {/* Database setup required banner */}
        {!tableExists && !loading && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-start gap-4 mb-2">
            <AlertCircle size={20} className="text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-rose-800 mb-1">Database table not set up yet</p>
              <p className="text-sm text-rose-700 mb-3">The <code className="bg-rose-100 px-1 rounded">blog_posts</code> table doesn&apos;t exist in Supabase. Run the one-time setup to create it and import all 25 posts.</p>
              <Link href="/admin/blog/seed" className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
                Run Setup &amp; Import Posts →
              </Link>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-neutral-400 font-bold animate-pulse">Loading Articles...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 border-b border-neutral-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider w-2/5">Article Title</th>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-center">Views</th>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Date Published</th>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-neutral-900 text-body-sm mb-1 line-clamp-1">{post.title}</p>
                        <p className="text-xs text-neutral-400 font-mono">/{post.slug}</p>
                      </td>
                      <td className="px-6 py-4 text-neutral-600 text-body-sm">
                        <span className="bg-neutral-100 px-2 py-1 rounded text-xs tracking-wide">{post.category}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[post.status] || 'bg-neutral-100 text-neutral-700'}`}>
                          {post.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-neutral-500 font-mono text-center text-body-sm">{post.view_count || 0}</td>
                      <td className="px-6 py-4 text-neutral-500 text-body-sm">
                        {new Date(post.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 flex items-center justify-end gap-3 text-body-sm">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="text-neutral-400 hover:text-primary-600 transition-colors p-2 rounded-md hover:bg-primary-50"
                          title="Edit Post"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-neutral-400 hover:text-error-600 transition-colors p-2 rounded-md hover:bg-error-50"
                          title="Delete Post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-300 mt-4">
            <p className="text-neutral-500 font-semibold mb-4 text-body-md">No articles match your search.</p>
            <button onClick={() => setSearchTerm('')} className="text-primary-600 font-bold hover:underline text-body-sm">Clear Search Filter</button>
          </div>
        )}
      </div>
    </div>
  );
}
