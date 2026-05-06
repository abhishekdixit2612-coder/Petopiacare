import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, User, ArrowRight, Calendar } from 'lucide-react';
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
  { id:'b1',  title:'Best Dog Food Brands in India for 2026',                     slug:'best-dog-food-brands-india',            excerpt:"Find India's top dog food brands, nutrition ratings, and matching recipes for every breed and budget.",              featured_image:'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=900&q=85&auto=format&fit=crop',  category:'Nutrition', author:'PetopiaCare Experts',  read_time_minutes:8,  created_at:'2026-04-01' },
  { id:'b2',  title:'Homemade Dog Food Recipe for Indian Dogs',                    slug:'homemade-dog-food-recipe-indian-dogs',   excerpt:'Nutritious, budget-friendly dog food recipes using Indian kitchen ingredients. Step-by-step guide.',                 featured_image:'https://images.unsplash.com/photo-1568572933382-74d440642117?w=900&q=85&auto=format&fit=crop',  category:'Nutrition', author:'PetopiaCare Experts',  read_time_minutes:10, created_at:'2026-04-06' },
  { id:'b3',  title:'Stop Dog Pulling on Leash: Training Tips That Work',          slug:'stop-dog-pulling-on-leash',             excerpt:'Turn daily walks into a calm experience with proven positive-reinforcement leash training techniques.',               featured_image:'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=900&q=85&auto=format&fit=crop',  category:'Training',  author:'PetopiaCare Experts',  read_time_minutes:7,  created_at:'2026-03-28' },
  { id:'b4',  title:'Summer Dog Care in India: Hydration & Heat Safety',           slug:'summer-dog-care-india',                 excerpt:"Keep your dog safe during India's hot months. Heatstroke prevention, hydration tips, and summer grooming.",           featured_image:'https://images.unsplash.com/photo-1537151608804-ea6f25dc1005?w=900&q=85&auto=format&fit=crop',  category:'Health',    author:'PetopiaCare Experts',  read_time_minutes:8,  created_at:'2026-03-20' },
  { id:'b5',  title:'How to Choose the Right Dog Harness',                         slug:'choosing-safe-dog-harness',             excerpt:'A complete buying guide — comparing no-pull, padded, and polymer harnesses for Indian breeds.',                       featured_image:'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=900&q=85&auto=format&fit=crop',  category:'Products',  author:'PetopiaCare Experts',  read_time_minutes:6,  created_at:'2026-03-14' },
  { id:'b6',  title:'Dog Grooming Guide for Indian Breeds',                        slug:'grooming-tips-indian-dogs',             excerpt:'Coat care, nail trimming, ear cleaning and skin health routines tailored for Indian weather and breeds.',               featured_image:'https://images.unsplash.com/photo-1625213327543-b24c2fc0d6ee?w=900&q=85&auto=format&fit=crop',  category:'Grooming',  author:'PetopiaCare Experts',  read_time_minutes:7,  created_at:'2026-03-10' },
  { id:'b7',  title:'Puppy Training Basics Every New Owner Needs',                 slug:'puppy-training-basics',                excerpt:'Start your puppy right — house training, socialisation, bite inhibition, and reward-based first commands.',              featured_image:'https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&q=85&auto=format&fit=crop',  category:'Training',  author:'PetopiaCare Experts',  read_time_minutes:9,  created_at:'2026-03-05' },
  { id:'b8',  title:'Common Dog Health Issues in India & When to See a Vet',       slug:'common-dog-health-issues',              excerpt:"Tick fever, mange, parvovirus and more — symptoms to watch for and when it's a vet emergency.",                      featured_image:'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=85&auto=format&fit=crop',  category:'Health',    author:'Dr. Priya Sharma',     read_time_minutes:10, created_at:'2026-02-28' },
  { id:'b9',  title:'Indian Pariah Dog: The Complete Breed Guide',                 slug:'indian-pariah-dog-guide',               excerpt:'Everything about the Desi dog — temperament, care, training, and why adopting an INDog is the best decision.',         featured_image:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=85&auto=format&fit=crop',  category:'Breeds',    author:'PetopiaCare Experts',  read_time_minutes:9,  created_at:'2026-02-20' },
  { id:'b10', title:'Vaccination Schedule for Dogs in India — 2026 Guide',         slug:'dog-vaccination-schedule-india',        excerpt:'Core vaccines, timing, cost, and what to expect — the complete guide for Indian dog owners.',                         featured_image:'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=900&q=85&auto=format&fit=crop',  category:'Health',    author:'Dr. Priya Sharma',     read_time_minutes:8,  created_at:'2026-02-15' },
  { id:'b11', title:'Tick Prevention for Dogs in India: Year-Round Guide',         slug:'tick-prevention-dogs-india',            excerpt:'Spot-on treatments, tick collars, and environmental control — comprehensive tick prevention for Indian conditions.',     featured_image:'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=900&q=85&auto=format&fit=crop',  category:'Health',    author:'PetopiaCare Experts',  read_time_minutes:7,  created_at:'2026-02-10' },
  { id:'b12', title:"Labrador Retriever in India: Owner's Complete Care Guide",    slug:'labrador-care-guide-india',             excerpt:"Labs are India's most popular breed. Here's everything you need to raise one well in the Indian climate.",             featured_image:'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=900&q=85&auto=format&fit=crop',  category:'Breeds',    author:'PetopiaCare Experts',  read_time_minutes:11, created_at:'2026-02-01' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Nutrition:'bg-green-100 text-green-700',  Training:'bg-amber-100 text-amber-700',
  Health:'bg-rose-100 text-rose-700',       Products:'bg-primary-100 text-primary-700',
  Grooming:'bg-purple-100 text-purple-700', Breeds:'bg-blue-100 text-blue-700',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

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

        {/* ── Hero ── */}
        <div className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
          <div className="relative max-w-3xl mx-auto px-6 pt-24 pb-16 text-center text-white">
            <span className="inline-block text-label font-semibold text-primary-200 uppercase tracking-[0.18em] mb-5">Knowledge Hub</span>
            <h1 className="font-display font-bold text-display-lg leading-tight mb-5">The PetopiaCare Blog</h1>
            <p className="text-body-lg text-primary-100/80 max-w-xl mx-auto leading-relaxed">
              Veterinary-backed advice on nutrition, training, health, and breeds — written for Indian dog parents.
            </p>
          </div>
          <div className="relative border-t border-white/10">
            <div className="max-w-2xl mx-auto px-6 py-8 grid grid-cols-3 divide-x divide-white/10 text-center text-white">
              {([['12+', 'Expert Articles'], ['6', 'Topics Covered'], ['100%', 'India-Focused']] as const).map(([n, l]) => (
                <div key={l} className="px-4">
                  <div className="font-display font-bold text-2xl mb-0.5">{n}</div>
                  <div className="text-label-sm text-white/50 uppercase tracking-wider">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* ── Featured post ── */}
          {featured && (
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-7">
                <span className="text-label font-bold text-neutral-400 uppercase tracking-widest">Featured Story</span>
                <div className="flex-1 h-px bg-neutral-100" />
              </div>
              <Link href={`/blog/${featured.slug}`} className="group flex flex-col lg:flex-row gap-0 bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-neutral-100 block">
                <div className="lg:w-3/5 h-72 lg:h-auto overflow-hidden flex-shrink-0 bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={featured.featured_image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                  <span className={`text-label-sm font-semibold px-3 py-1 rounded-full w-fit mb-5 ${CATEGORY_COLORS[featured.category] ?? 'bg-neutral-100 text-neutral-600'}`}>{featured.category}</span>
                  <h2 className="font-display font-bold text-display-sm lg:text-display-md text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors leading-tight">{featured.title}</h2>
                  <p className="text-body-md text-neutral-500 mb-8 leading-relaxed line-clamp-3">{featured.excerpt}</p>
                  <div className="flex items-center gap-6 text-label-sm text-neutral-400 mb-6">
                    <span className="flex items-center gap-1.5"><User size={13} /> {featured.author}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={13} /> {formatDate(featured.created_at)}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13} /> {featured.read_time_minutes} min read</span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-primary-600 font-semibold text-body-sm group-hover:gap-3 transition-all">
                    Read Article <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            </div>
          )}

          {/* ── Article grid ── */}
          {rest.length > 0 && (
            <>
              <div className="flex items-center gap-4 mb-9">
                <span className="text-label font-bold text-neutral-400 uppercase tracking-widest">Latest Articles</span>
                <div className="flex-1 h-px bg-neutral-100" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    <div className="relative h-52 overflow-hidden bg-neutral-100 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <span className={`absolute top-4 left-4 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${CATEGORY_COLORS[post.category] ?? 'bg-neutral-100 text-neutral-600'}`}>{post.category}</span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h2 className="font-display font-semibold text-neutral-900 text-heading-lg mb-3 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">{post.title}</h2>
                      <p className="text-body-sm text-neutral-500 line-clamp-2 flex-1 mb-5 leading-relaxed">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-label-sm text-neutral-400 pt-4 border-t border-neutral-100">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5"><Clock size={11} /> {post.read_time_minutes} min</span>
                          <span className="flex items-center gap-1.5"><Calendar size={11} /> {formatDate(post.created_at)}</span>
                        </div>
                        <span className="flex items-center gap-1 text-primary-600 font-semibold group-hover:gap-2 transition-all text-[12px]">Read <ArrowRight size={11} /></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Bottom CTA band ── */}
        <div className="border-t border-neutral-100 bg-neutral-50 py-14">
          <div className="max-w-2xl mx-auto text-center px-6">
            <p className="font-display font-bold text-display-sm text-neutral-900 mb-3">Looking for quality dog gear?</p>
            <p className="text-body-md text-neutral-500 mb-7">Harnesses, leashes, collars and toys — designed for Indian dogs and Indian conditions.</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-7 py-3 rounded-xl hover:bg-primary-700 transition-colors text-body-sm">
              Browse Products <ArrowRight size={15} />
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
