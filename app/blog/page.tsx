"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  category: string;
  author: string;
  date: string;
  read_time_minutes: number;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        setBlogs(data.posts || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Blog Header */}
      <div className="bg-[#1A7D80] py-20 text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-primary text-4xl md:text-5xl font-bold mb-6">The Petopia Care Blog</h1>
          <p className="text-xl text-[#C8E3E2] font-secondary leading-relaxed">
            Expert advice, training guides, and nutrition tips curated specifically for Indian pet parents.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content (Left) */}
        <div className="lg:w-2/3">
          {loading ? (
             <div className="animate-pulse space-y-8">
               {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-200 rounded-2xl w-full"></div>)}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredBlogs.map(blog => (
                <Link href={`/blog/${blog.slug}`} key={blog.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-premium transition-premium border border-gray-100">
                  <div className="h-56 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={blog.featured_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-premium duration-500" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1A7D80] uppercase tracking-wider shadow-sm">
                      {blog.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-primary font-bold text-xl text-gray-900 mb-3 group-hover:text-[#1A7D80] transition-colors leading-snug">{blog.title}</h3>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                       <span className="text-xs text-gray-500 font-medium tracking-wide">By {blog.author} • {blog.date}</span>
                       <span className="text-xs font-bold text-[#F2A65A]">{blog.read_time_minutes} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {!loading && filteredBlogs.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
              <p className="text-gray-500 text-lg">No articles found matching "{searchQuery}".</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredBlogs.length > 0 && (
              <div className="flex justify-center mt-12 border-t border-gray-200 pt-10">
                <nav className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors opacity-50 cursor-not-allowed">&lt;</button>
                  <button className="w-10 h-10 rounded-full bg-[#1A7D80] text-white flex items-center justify-center font-bold shadow-md">1</button>
                  <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors">2</button>
                  <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors">&gt;</button>
                </nav>
              </div>
          )}
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:w-1/3">
          <div className="sticky top-28 space-y-10">
            
            {/* Search Box */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-primary font-bold text-lg mb-4 text-gray-900 border-b border-gray-100 pb-3">Search the Blog</h3>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Nutrition, Training..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7D80] focus:ring-1 focus:ring-[#1A7D80] transition-colors"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-primary font-bold text-lg mb-4 text-gray-900 border-b border-gray-100 pb-3">Categories</h3>
              <ul className="space-y-3 pb-2">
                {["Nutrition & Recipes", "Training & Behavior", "Health & Wellness", "Breeds & Characteristics", "Seasonal Lifestyle"].map((cat) => (
                  <li key={cat}>
                    <button 
                      onClick={() => setSearchQuery(cat === "All" ? "" : cat.split(" ")[0])}
                      className="flex items-center justify-between w-full text-left text-gray-600 hover:text-[#1A7D80] group transition-colors"
                    >
                      <span>{cat}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1A7D80] transition-transform group-hover:translate-x-1" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="bg-[#2B7A8F] p-8 rounded-2xl shadow-lg border border-[#1A7D80] text-center text-white">
              <h3 className="font-primary font-bold text-xl mb-3 text-[#FFD166]">Never Miss a Tip</h3>
              <p className="text-sm text-[#C8E3E2] mb-6">Get weekly expert dog care guides delivered straight to your inbox.</p>
              <form onSubmit={(e)=>e.preventDefault()}>
                <input type="email" placeholder="Your email address" className="w-full py-3 px-4 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/50 mb-3 outline-none focus:border-[#FFD166] text-sm" />
                <button type="submit" className="w-full bg-[#FFD166] hover:bg-[#F2A65A] text-[#1C1C1C] font-bold py-3 px-4 rounded-lg transition-premium">Subscribe Now</button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
