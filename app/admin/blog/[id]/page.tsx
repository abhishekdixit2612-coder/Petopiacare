'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Image as ImageIcon, Search, X, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import UnsplashImagePicker from '@/components/UnsplashImagePicker'
import BlockEditor from '@/components/admin/BlockEditor'
import type { UnsplashImage } from '@/types/unsplash'
import type { ContentBlock } from '@/types/blog-blocks'
import { isBlockContent, parseBlocks, parseHtmlToBlocks, serializeBlocks, countWordsInBlocks } from '@/types/blog-blocks'
import { getSearchQuery } from '@/config/imageSearchMapping'

interface FormData {
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  category: string
  seo_title: string
  seo_description: string
  seo_keywords: string
  status: string
}

export default function EditBlogPost() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    title: '', slug: '', excerpt: '', content: '',
    featured_image: '', category: '', seo_title: '',
    seo_description: '', seo_keywords: '', status: 'draft',
  })
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [selectedUnsplashImage, setSelectedUnsplashImage] = useState<UnsplashImage | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/blog-posts/${id}`)
        if (!res.ok) throw new Error('Post not found')
        const { post: data } = await res.json()

        setFormData({
          title: data.title ?? '',
          slug: data.slug ?? '',
          excerpt: data.excerpt ?? '',
          content: data.content ?? '',
          featured_image: data.featured_image ?? '',
          category: data.category ?? '',
          seo_title: data.seo_title ?? '',
          seo_description: data.seo_description ?? '',
          seo_keywords: data.seo_keywords ?? '',
          status: data.status ?? 'draft',
        })

        const raw = data.content ?? ''
        if (isBlockContent(raw)) {
          setBlocks(parseBlocks(raw))
        } else if (raw.trim()) {
          // Auto-convert legacy HTML → blocks (no manual step needed)
          setBlocks(parseHtmlToBlocks(raw))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const getAutoSearchQuery = () => {
    if (formData.category) {
      const mapped = getSearchQuery('blog', formData.category)
      if (mapped !== 'dog pet india') return mapped
    }
    return formData.title.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').slice(0, 50) || 'dog india pet'
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const excerpt = e.target.value
    setFormData(prev => ({ ...prev, excerpt, seo_description: excerpt.substring(0, 160) }))
  }

  const handleUnsplashSelect = (image: UnsplashImage) => {
    setSelectedUnsplashImage(image)
    setFormData(prev => ({ ...prev, featured_image: image.urls.regular }))
    setShowImagePicker(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const finalContent = serializeBlocks(blocks)
      const readTime = Math.max(1, Math.ceil(countWordsInBlocks(blocks) / 200))

      const res = await fetch(`/api/admin/blog-posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: finalContent,
          featured_image: formData.featured_image,
          category: formData.category,
          seo_title: formData.seo_title,
          seo_description: formData.seo_description,
          seo_keywords: formData.seo_keywords,
          status: formData.status,
          read_time_minutes: readTime,
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error ?? 'Save failed')
      router.push('/admin/blog')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 font-bold animate-pulse">Loading post...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Content Hub
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
            <h1 className="text-3xl font-bold font-primary text-gray-900">Edit Article</h1>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={e => { e.preventDefault(); setFormData(f => ({ ...f, status: 'draft' })) }}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${formData.status === 'draft' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >Draft</button>
              <button
                onClick={e => { e.preventDefault(); setFormData(f => ({ ...f, status: 'published' })) }}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${formData.status === 'published' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >Published</button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 font-semibold text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Article body */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Article Body</h3>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Headline</label>
                <input
                  type="text" name="title" value={formData.title} onChange={handleChange} required
                  placeholder="e.g., The Ultimate Guide to Dog Nutrition in India"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Excerpt</label>
                <textarea
                  name="excerpt" value={formData.excerpt} onChange={handleExcerptChange} rows={3} required
                  placeholder="Write a compelling 2-sentence hook..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Content editor — always block-based */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Article Content</label>
                <BlockEditor blocks={blocks} onChange={setBlocks} />
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Metadata & SEO</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
                  <input
                    type="text" name="slug" value={formData.slug} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 font-mono text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Topic Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white outline-none cursor-pointer">
                    <option value="">Select category...</option>
                    <option>Nutrition</option><option>Training</option><option>Health</option>
                    <option>Breed Guide</option><option>Behaviorology</option><option>Lifestyle</option>
                  </select>
                </div>
              </div>

              {/* Featured image */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Featured Hero Image</label>
                {formData.featured_image && (
                  <div className="relative mb-3 rounded-xl overflow-hidden h-40 bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.featured_image} alt="Featured" className="w-full h-full object-cover" />
                    <button onClick={() => { setSelectedUnsplashImage(null); setFormData(p => ({ ...p, featured_image: '' })) }}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-lg transition-colors">
                      <X size={14} />
                    </button>
                    {selectedUnsplashImage && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-3 py-1.5">
                        Photo by {selectedUnsplashImage.user.name} on Unsplash
                      </div>
                    )}
                  </div>
                )}
                <div className="flex gap-2 mb-2">
                  <button type="button" onClick={() => setShowImagePicker(true)}
                    className="flex items-center gap-2 bg-forest-500 hover:bg-forest-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors flex-1 justify-center">
                    <Search size={15} /> Search Unsplash
                  </button>
                  <button type="button" onClick={() => setShowImagePicker(false)}
                    className="flex items-center gap-2 border border-gray-300 text-gray-600 hover:border-gray-400 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
                    <ImageIcon size={15} /> URL
                  </button>
                </div>
                <input type="url" name="featured_image" value={formData.featured_image} onChange={handleChange}
                  placeholder="Or paste image URL directly..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-xs outline-none" />
                {showImagePicker && (
                  <UnsplashImagePicker
                    searchQuery={getAutoSearchQuery()}
                    selectedImage={selectedUnsplashImage}
                    onImageSelect={handleUnsplashSelect}
                    onClose={() => setShowImagePicker(false)}
                  />
                )}
              </div>
            </div>

            {/* SEO */}
            <div className="space-y-6 bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">S</div>
                <h3 className="font-bold text-blue-900">Search Engine Tuning</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-blue-900 mb-2">Meta Title</label>
                  <input type="text" name="seo_title" value={formData.seo_title} onChange={handleChange} maxLength={60}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  <p className="text-xs text-blue-500 mt-1 font-mono text-right">{formData.seo_title.length}/60</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-900 mb-2">Focus Keywords</label>
                  <input type="text" name="seo_keywords" value={formData.seo_keywords} onChange={handleChange}
                    placeholder="dog training, harness guide..."
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">Meta Description</label>
                <textarea name="seo_description" value={formData.seo_description} onChange={handleChange} maxLength={160} rows={2}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                <p className="text-xs text-blue-500 mt-1 font-mono text-right">{formData.seo_description.length}/160</p>
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <button type="submit" disabled={saving}
                className={`flex-1 text-white font-bold py-4 px-6 rounded-xl shadow-md flex justify-center items-center gap-2 transition-all ${
                  formData.status === 'published' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}>
                {saving ? 'Saving...' : <><Save size={18} /> {formData.status === 'published' ? 'Save & Keep Published' : 'Save Changes'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
