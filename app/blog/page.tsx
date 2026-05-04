import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, User, ArrowRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { JsonLd, itemListLD } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Dog Care Blog — Expert Advice for Indian Dog Parents',
  description: 'Expert dog care articles covering nutrition, training, health, grooming, and breed guides for Indian dog parents. Written by veterinary professionals.',
  openGraph: {
    title: 'PetopiaCare Blog — Dog Care Guides for India',
    description: 'Nutrition tips, training guides, health advice and more — written for Indian dog parents.',
    url: 'https://petopiacare.in/blog',
  },
};

interface BlogPost {
  id: string; title: string; slug: string; excerpt: string;
  featured_image: string; category: string; author: string;
  read_time_minutes: number; created_at: string;
}

const MOCK_BLOGS: BlogPost[] = [
  { id:'b1',  title:'Best Dog Food Brands in India for 2026',                     slug:'best-dog-food-brands-india',            excerpt:"Find India's top dog food brands, nutrition ratings, and matching recipes for every breed and budget.",              featured_image:'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80',  category:'Nutrition', author:'PetopiaCare Experts',  read_time_minutes:8,  created_at:'2026-04-01' },
  { id:'b2',  title:'Homemade Dog Food Recipe for Indian Dogs',                    slug:'homemade-dog-food-recipe-indian-dogs',   excerpt:'Nutritious, budget-friendly dog food recipes using Indian kitchen ingredients. Step-by-step guide.',                 featured_image:'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80',  category:'Nutrition', author:'PetopiaCare Experts',  read_time_minutes:10, created_at:'2026-04-06' },
  { id:'b3',  title:'Stop Dog Pulling on Leash: Training Tips That Work',          slug:'stop-dog-pulling-on-leash',             excerpt:'Turn daily walks into a calm experience with proven positive-reinforcement leash training techniques.',               featured_image:'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80',  category:'Training',  author:'PetopiaCare Experts',  read_time_minutes:7,  created_at:'2026-03-28' },
  { id:'b4',  title:'Summer Dog Care in India: Hydration & Heat Safety',           slug:'summer-dog-care-india',                 excerpt:"Keep your dog safe during India's hot months. Heatstroke prevention, hydration tips, and summer grooming.",           featured_image:'https://images.unsplash.com/photo-1537151608804-ea6f25dc1005?w=800&q=80',  category:'Health',    author:'PetopiaCare Experts',  read_time_minutes:8,  created_at:'2026-03-20' },
  { id:'b5',  title:'How to Choose the Right Dog Harness',                         slug:'choosing-safe-dog-harness',             excerpt:'A complete buying guide — comparing no-pull, padded, and polymer harnesses for Indian breeds.',                       featured_image:'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80',  category:'Products',  author:'PetopiaCare Experts',  read_time_minutes:6,  created_at:'2026-03-14' },
  { id:'b6',  title:'Dog Grooming Guide for Indian Breeds',                        slug:'grooming-tips-indian-dogs',             excerpt:'Coat care, nail trimming, ear cleaning and skin health routines tailored for Indian weather and breeds.',               featured_image:'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&q=80',  category:'Grooming',  author:'PetopiaCare Experts',  read_time_minutes:7,  created_at:'2026-03-10' },
  { id:'b7',  title:'Puppy Training Basics Every New Owner Needs',                 slug:'puppy-training-basics',                excerpt:'Start your puppy right — house training, socialisation, bite inhibition, and reward-based first commands.',              featured_image:'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',  category:'Training',  author:'PetopiaCare Experts',  read_time_minutes:9,  created_at:'2026-03-05' },
  { id:'b8',  title:'Common Dog Health Issues in India & When to See a Vet',       slug:'common-dog-health-issues',              excerpt:"Tick fever, mange, parvovirus and more — symptoms to watch for and when it's a vet emergency.",                      featured_image:'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',  category:'Health',    author:'Dr. Priya Sharma',     read_time_minutes:10, created_at:'2026-02-28' },
  { id:'b9',  title:'Indian Pariah Dog: The Complete Breed Guide',                 slug:'indian-pariah-dog-guide',               excerpt:'Everything about the Desi dog — temperament, care, training, and why adopting an INDog is the best decision.',         featured_image:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',  category:'Breeds',    author:'PetopiaCare Experts',  read_time_minutes:9,  created_at:'2026-02-20' },
  { id:'b10', title:'Vaccination Schedule for Dogs in India — 2026 Guide',         slug:'dog-vaccination-schedule-india',        excerpt:'Core vaccines, timing, cost, and what to expect — the complete guide for Indian dog owners.',                         featured_image:'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80',  category:'Health',    author:'Dr. Priya Sharma',     read_time_minutes:8,  created_at:'2026-02-15' },
  { id:'b11', title:'Tick Prevention for Dogs in India: Year-Round Guide',         slug:'tick-prevention-dogs-india',            excerpt:'Spot-on treatments, tick collars, and environmental control — comprehensive tick prevention for Indian conditions.',     featured_image:'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=800&q=80',  category:'Health',    author:'PetopiaCare Experts',  read_time_minutes:7,  created_at:'2026-02-10' },
  { id:'b12', title:"Labrador Retriever in India: Owner's Complete Care Guide",    slug:'labrador-care-guide-india',             excerpt:"Labs are India's most popular breed. Here's everything you need to raise one well in the Indian climate.",             featured_image:'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',  category:'Breeds',    author:'PetopiaCare Experts',  read_time_minutes:11, created_at:'2026-02-01' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Nutrition:'bg-green-100 text-green-700', Training:'bg-amber-100 text-amber-700',
  Health:'bg-rose-100 text-rose-700',      Products:'bg-primary-100 text-primary-700',
  Grooming:'bg-purple-100 text-purple-700', Breeds:'bg-blue-100 text-blue-700',
};

async function getPosts(): Promise<BlogPost[]> {
  try {
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '');
    const { data } = await db.from('blog_posts').select('id,title,slug,excerpt,featured_image,category,author,read_time_minutes,created_at').eq('status','published').order('created_at',{ascending:false});
    if (data && data.length > 0) return data as BlogPost[];
  } catch {}
  return MOCK_BLOGS;
}

export default async function BlogPage() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;
  const listLD = itemListLD('PetopiaCare Dog Care Blog', posts.map(p => ({ name: p.title, url: `/blog/${p.slug}` })));

  return (
    <>
      <JsonLd data={listLD} />
      <div className="bg-white min-h-screen">
        <div className="bg-gradient-to-br from-primary-700 to-primary-900 py-20 text-center text-white">
          <div className="max-w-3xl mx-auto px-4">
            <span className="inline-block text-label font-semibold text-primary-200 uppercase tracking-widest mb-4">Knowledge Hub</span>
            <h1 className="font-display font-bold text-display-lg mb-5">The PetopiaCare Blog</h1>
            <p className="text-body-lg text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Expert dog care advice — nutrition, training, health, breeds — written for Indian dog parents.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="group mb-12 flex flex-col md:flex-row gap-8 bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden hover:shadow-lg transition-all block">
              <div className="md:w-1/2 h-64 md:h-auto overflow-hidden flex-shrink-0 bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.featured_image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
                <span className={`text-label-sm font-semibold px-2.5 py-1 rounded-full w-fit mb-4 ${CATEGORY_COLORS[featured.category] ?? 'bg-neutral-100 text-neutral-600'}`}>{featured.category}</span>
                <h2 className="font-display font-bold text-display-sm md:text-display-md text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors leading-tight">{featured.title}</h2>
                <p className="text-body-md text-neutral-600 mb-6 leading-relaxed">{featured.excerpt}</p>
                <div className="flex items-center gap-5 text-label-sm text-neutral-400">
                  <span className="flex items-center gap-1.5"><User size={12} /> {featured.author}</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} /> {featured.read_time_minutes} min read</span>
                </div>
              </div>
            </Link>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
                <div className="h-48 overflow-hidden bg-neutral-100 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full w-fit mb-3 ${CATEGORY_COLORS[post.category] ?? 'bg-neutral-100 text-neutral-600'}`}>{post.category}</span>
                  <h2 className="font-display font-semibold text-neutral-900 text-heading-md mb-2 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">{post.title}</h2>
                  <p className="text-body-sm text-neutral-500 line-clamp-2 flex-1 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-label-sm text-neutral-400 pt-3 border-t border-neutral-100">
                    <span className="flex items-center gap-1"><Clock size={11} /> {post.read_time_minutes} min</span>
                    <span className="flex items-center gap-1 text-primary-600 font-medium group-hover:gap-2 transition-all">Read <ArrowRight size={12} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
