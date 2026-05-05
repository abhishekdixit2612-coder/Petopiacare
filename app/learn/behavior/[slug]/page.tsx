import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ExternalLink } from 'lucide-react';
import { getBehavioralTopicBySlug, getAllBehavioralTopics } from '@/lib/learn-queries';
import BreadcrumbNav from '@/components/learn/BreadcrumbNav';
import DoAndDontsList from '@/components/learn/DoAndDontsList';
import type { DoAndDonts, ExternalResources } from '@/types/database';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getBehavioralTopicBySlug(slug);
  if (!topic) return { title: 'Topic Not Found' };
  return {
    title: `${topic.name} — Dog Training Guide`,
    description: (topic.issue_description ?? '').slice(0, 155) || `Evidence-based guide to managing ${topic.name} in dogs using positive reinforcement.`,
  };
}

export default async function BehaviorTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [topic, allTopics] = await Promise.all([
    getBehavioralTopicBySlug(slug),
    getAllBehavioralTopics(),
  ]);

  if (!topic) notFound();

  const related = allTopics.filter((t) => t.slug !== slug).slice(0, 4);
  const doAndDonts = topic.do_and_donts as DoAndDonts | null;
  const resources = topic.external_resources as ExternalResources | null;

  return (
    <div className="space-y-10">
      <BreadcrumbNav items={[
        { label: 'Learn', href: '/learn' },
        { label: 'Behaviour', href: '/learn/behavior-training' },
        { label: topic.name },
      ]} />

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1534361960057-19f4434a4f0a?w=1200&q=80"
          alt={topic.name} className="w-full h-52 md:h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-800/90 to-orange-600/80" />
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
          <div className="flex flex-wrap gap-2 mb-3">
            {topic.applicable_stages?.map((s) => (
              <span key={s} className="bg-white/20 text-white text-label-sm font-semibold px-3 py-1 rounded-full capitalize">{s}</span>
            ))}
          </div>
          <h1 className="font-display font-bold italic text-white text-display-sm md:text-display-md mb-3 leading-tight">{topic.name}</h1>
          {topic.issue_description && (
            <p className="text-white/80 text-body-lg max-w-xl leading-relaxed">{topic.issue_description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0 space-y-10">

          {/* Causes */}
          {topic.causes.length > 0 && (
            <section>
              <h2 id="causes" className="font-display font-bold text-display-sm text-neutral-900 mb-4">Why Dogs Do This</h2>
              <div className="space-y-2">
                {topic.causes.map((cause, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-neutral-50 border border-neutral-100 rounded-xl">
                    <span className="w-5 h-5 bg-neutral-200 text-neutral-600 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-body-sm text-neutral-700">{cause}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Solutions */}
          {topic.solutions && (
            <section>
              <h2 id="solutions" className="font-display font-bold text-display-sm text-neutral-900 mb-4">Step-by-Step Solutions</h2>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                <p className="text-body-md text-neutral-700 leading-relaxed">{topic.solutions}</p>
              </div>
            </section>
          )}

          {/* Training techniques */}
          {topic.training_techniques.length > 0 && (
            <section>
              <h2 id="techniques" className="font-display font-bold text-display-sm text-neutral-900 mb-4">Training Techniques</h2>
              <div className="space-y-3">
                {topic.training_techniques.map((technique, i) => (
                  <div key={i} className="p-4 bg-white border border-neutral-100 rounded-xl">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-body-sm text-neutral-700 leading-relaxed">{technique}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Common mistakes */}
          {topic.common_mistakes.length > 0 && (
            <section>
              <h2 id="mistakes" className="font-display font-bold text-display-sm text-neutral-900 mb-4">Common Mistakes to Avoid</h2>
              <div className="space-y-2">
                {topic.common_mistakes.map((mistake, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                    <span className="text-rose-500 flex-shrink-0 mt-0.5">✗</span>
                    <p className="text-body-sm text-neutral-700">{mistake}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Do's and Don'ts */}
          {doAndDonts && (doAndDonts.dos?.length > 0 || doAndDonts.donts?.length > 0) && (
            <section>
              <h2 id="dos-donts" className="font-display font-bold text-display-sm text-neutral-900 mb-4">Do&apos;s and Don&apos;ts</h2>
              <DoAndDontsList dos={doAndDonts.dos ?? []} donts={doAndDonts.donts ?? []} />
            </section>
          )}

          {/* External resources */}
          {resources && (resources.links?.length > 0 || resources.books?.length > 0) && (
            <section>
              <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Further Reading</h2>
              <div className="space-y-4">
                {resources.links?.length > 0 && (
                  <div>
                    <p className="text-label-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">Online Resources</p>
                    <div className="space-y-2">
                      {resources.links.map((link) => (
                        <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-white border border-neutral-100 rounded-xl hover:border-primary-200 text-body-sm text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          <ExternalLink size={13} className="flex-shrink-0" />
                          {link.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {resources.books?.length > 0 && (
                  <div>
                    <p className="text-label-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">Recommended Books</p>
                    <div className="space-y-1">
                      {resources.books.map((book) => (
                        <p key={book} className="text-body-sm text-neutral-600 flex items-start gap-2">
                          <span className="text-neutral-300 flex-shrink-0">📚</span> {book}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Product CTA */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display font-bold text-heading-lg mb-1">Training aids that help</h3>
              <p className="text-amber-100 text-body-sm">Front-clip harnesses, training leashes, and enrichment toys</p>
            </div>
            <Link href="/products" className="flex-shrink-0 bg-white text-amber-700 font-medium px-5 py-2.5 rounded-xl hover:bg-amber-50 transition-colors text-body-sm flex items-center gap-2">
              <ShoppingBag size={15} /> Browse Products
            </Link>
          </div>

          {/* Related topics */}
          {related.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Related Topics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((t) => (
                  <Link key={t.slug} href={`/learn/behavior/${t.slug}`}
                    className="flex items-center gap-3 p-4 bg-white border border-neutral-100 rounded-xl hover:border-amber-200 hover:shadow-sm transition-all group"
                  >
                    <p className="font-medium text-neutral-900 text-body-sm group-hover:text-amber-700 transition-colors flex-1 min-w-0 truncate">{t.name}</p>
                    <ArrowRight size={13} className="text-neutral-300 group-hover:text-amber-400 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Desktop TOC sidebar */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-32 bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm">
            <p className="text-label-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">On this page</p>
            {[
              { id: 'causes',     label: 'Why Dogs Do This' },
              { id: 'solutions',  label: 'Solutions' },
              { id: 'techniques', label: 'Techniques' },
              { id: 'mistakes',   label: 'Common Mistakes' },
              { id: 'dos-donts',  label: "Do's & Don'ts" },
            ].map(({ id, label }) => (
              <a key={id} href={`#${id}`} className="block text-body-sm text-neutral-500 hover:text-amber-600 py-1 transition-colors">
                {label}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
