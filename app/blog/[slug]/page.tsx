"use client";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User, Facebook, Twitter, Link as LinkIcon } from "lucide-react";

export default function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/${params.slug}`)
      .then(res => res.json())
      .then(data => {
        setPost(data.post);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <div className="min-h-screen py-32 text-center text-xl font-bold">Loading...</div>;
  if (!post) return <div className="min-h-screen py-32 text-center text-xl font-bold">Post not found. <Link href="/blog" className="text-[#1A7D80] underline">Go back</Link></div>;

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Featured Header Area */}
      <div className="w-full h-[400px] md:h-[500px] relative">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
        
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full text-white text-center md:text-left mt-16">
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 text-sm font-semibold tracking-wide hover:-translate-x-1 duration-300">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            
            <div className="mb-4">
              <span className="bg-[#F2A65A] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {post.category}
              </span>
            </div>
            
            <h1 className="font-primary text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm font-medium text-white/90">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#FFD166]" /> {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FFD166]" /> {post.date || new Date(post.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FFD166]" /> {post.read_time_minutes} min read
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col md:flex-row gap-12">
        
        {/* Left Side: Social Share Sticky */}
        <div className="hidden md:block w-12 flex-shrink-0">
          <div className="sticky top-32 flex flex-col gap-4">
             <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-colors shadow-sm bg-white">
               <Facebook className="w-4 h-4" />
             </button>
             <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-400 transition-colors shadow-sm bg-white">
               <Twitter className="w-4 h-4" />
             </button>
             <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-600 transition-colors shadow-sm bg-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
             </button>
             <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:border-gray-800 transition-colors shadow-sm bg-white cursor-pointer" onClick={() => navigator.clipboard.writeText(window.location.href)}>
               <LinkIcon className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Main Article Content */}
        <div className="flex-1">
          <div className="mb-10 p-6 bg-gray-50 border-l-4 border-[#1A7D80] rounded-r-2xl italic text-lg text-gray-700 font-secondary leading-relaxed">
            "{post.excerpt}"
          </div>

          <div 
            className="prose prose-lg prose-teal max-w-none text-gray-700 font-secondary leading-loose prose-headings:font-primary prose-a:text-[#1A7D80] prose-img:rounded-xl prose-img:shadow-sm"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                <Image src="/logos/icon.png" alt="Author" width={64} height={64} className="object-cover opacity-50" unoptimized />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 font-primary">Written by {post.author}</h4>
                <p className="text-sm text-gray-500">Expert at PetopiaCare India</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Recommended Products Banner */}
      <div className="max-w-4xl mx-auto px-4 mt-20">
        <div className="bg-[#1A7D80] rounded-3xl p-10 text-center text-white shadow-xl relative overflow-hidden">
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#F2A65A] rounded-full opacity-20 blur-3xl"></div>
           <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#C8E3E2] rounded-full opacity-20 blur-3xl"></div>
           
           <h3 className="font-primary text-3xl font-bold mb-4 relative z-10">Care for your dog with top-tier gear.</h3>
           <p className="text-white/90 mb-8 max-w-md mx-auto relative z-10 text-lg">Shop the same products mentioned in this article, rigorously tested by our experts.</p>
           <Link href="/products" className="relative z-10 inline-block bg-white text-[#1A7D80] font-bold py-4 px-10 rounded-xl hover:bg-gray-100 transition-premium shadow-lg">
             Explore Shop
           </Link>
        </div>
      </div>
    </div>
  );
}
