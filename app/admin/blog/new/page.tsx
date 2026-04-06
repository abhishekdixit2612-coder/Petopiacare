'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

export default function WriteBlogPost() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seo_title: title.substring(0, 60)
    }));
  };

  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const excerpt = e.target.value;
    setFormData(prev => ({
      ...prev,
      excerpt,
      seo_description: excerpt.substring(0, 160)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const readTime = Math.max(1, Math.ceil(formData.content.split(' ').length / 200));

      const { error: err } = await supabase.from('blog_posts').insert([
        {
          title: formData.title,
          slug: formData.slug || generateSlug(formData.title),
          excerpt: formData.excerpt,
          content: formData.content,
          featured_image: formData.featured_image,
          category: formData.category,
          seo_title: formData.seo_title,
          seo_description: formData.seo_description,
          seo_keywords: formData.seo_keywords,
          status: formData.status,
          read_time_minutes: readTime,
        },
      ]);

      if (err) throw err;

      router.push('/admin/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Content Hub
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
            <h1 className="text-3xl font-bold font-primary text-gray-900">Write New Article</h1>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button 
                onClick={(e) => { e.preventDefault(); setFormData(f => ({...f, status: 'draft'})) }}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${formData.status === 'draft' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >Draft</button>
              <button
                onClick={(e) => { e.preventDefault(); setFormData(f => ({...f, status: 'published'})) }}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${formData.status === 'published' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >Publish</button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 font-semibold text-sm">
              ERROR: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Article Body</h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Headline</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                  placeholder="e.g., The Ultimate Guide to Dog Nutrition in India"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Excerpt (displayed on cards)</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleExcerptChange}
                  rows={3}
                  required
                  placeholder="Write a compelling 2-sentence hook..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Content (supports HTML/MD tags structurally)</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={14}
                  required
                  placeholder="Start writing..."
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm leading-relaxed"
                />
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Metadata & SEO Options</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 font-mono text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Topic Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white outline-none cursor-pointer"
                  >
                    <option value="">Select category...</option>
                    <option>Nutrition</option>
                    <option>Training</option>
                    <option>Health</option>
                    <option>Breed Guide</option>
                    <option>Behaviorology</option>
                    <option>Lifestyle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Featured Hero Image URL</label>
                <input
                  type="url"
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-sm outline-none"
                />
              </div>
            </div>

            <div className="space-y-6 bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">S</div>
                <h3 className="font-bold text-blue-900">Search Engine Tuning</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-blue-900 mb-2">Meta Title</label>
                  <input
                    type="text"
                    name="seo_title"
                    value={formData.seo_title}
                    onChange={handleChange}
                    maxLength={60}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-blue-500 mt-2 font-mono text-right">{formData.seo_title.length}/60 chars</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-900 mb-2">Focus Keywords (comma separated)</label>
                  <input
                    type="text"
                    name="seo_keywords"
                    value={formData.seo_keywords}
                    onChange={handleChange}
                    placeholder="dog training, harness guide..."
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">Meta Description</label>
                <textarea
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={handleChange}
                  maxLength={160}
                  rows={2}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-blue-500 mt-2 font-mono text-right">{formData.seo_description.length}/160 chars</p>
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 text-white font-bold py-4 px-6 rounded-xl transition-premium shadow-md flex justify-center items-center gap-2 ${
                  formData.status === 'published' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Processing...' : <><Send size={20} /> {formData.status === 'published' ? 'Publish Live' : 'Save as Draft'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
