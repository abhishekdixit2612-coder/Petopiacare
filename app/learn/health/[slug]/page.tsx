import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import { getHealthConditionBySlug, getAllHealthConditions } from '@/lib/learn-queries';
import BreadcrumbNav from '@/components/learn/BreadcrumbNav';
import DoAndDontsList from '@/components/learn/DoAndDontsList';

export const revalidate = 3600;

const SEVERITY_CONFIG = {
  mild:     { label: 'Mild',     badge: 'bg-amber-100 text-amber-700',  hero: 'from-amber-600 to-orange-600' },
  moderate: { label: 'Moderate', badge: 'bg-orange-100 text-orange-700', hero: 'from-orange-600 to-rose-600' },
  severe:   { label: 'Severe — Emergency', badge: 'bg-rose-100 text-rose-700', hero: 'from-rose-700 to-red-800' },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const condition = await getHealthConditionBySlug(slug);
  if (!condition) return { title: 'Condition Not Found' };
  return {
    title: `${condition.name} in Dogs — Symptoms, Treatment & Prevention`,
    description: (condition.description ?? '').slice(0, 155) || `Learn about ${condition.name} in dogs — symptoms, when to see a vet, and prevention tips.`,
  };
}

export default async function HealthConditionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [condition, allConditions] = await Promise.all([
    getHealthConditionBySlug(slug),
    getAllHealthConditions(),
  ]);

  if (!condition) notFound();

  const cfg = SEVERITY_CONFIG[condition.severity] ?? SEVERITY_CONFIG.mild;
  const related = allConditions.filter((c) => c.slug !== slug).slice(0, 4);

  // Build do's/don'ts from prevention tips (dos) and when_to_see_vet context
  const preventionDos = condition.prevention_tips.slice(0, 5);
  const generalDonts = [
    'Wait to see if symptoms resolve on their own when they are worsening',
    'Give human medication without veterinary guidance',
    'Attempt home treatment for a severe or emergency condition',
    'Skip follow-up appointments once the dog seems better',
  ];

  return (
    <div className="space-y-10">
      <BreadcrumbNav items={[
        { label: 'Learn', href: '/learn' },
        { label: 'Health', href: '/learn/health-wellness' },
        { label: condition.name },
      ]} />

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80"
          alt={condition.name} className="w-full h-52 md:h-64 object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-br ${cfg.hero} opacity-90`} />
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
          <span className="inline-block bg-white/20 text-white text-label-sm font-semibold px-3 py-1 rounded-full mb-4 w-fit">
            {cfg.label}
          </span>
          <h1 className="font-display font-bold italic text-white text-display-sm md:text-display-md mb-3 leading-tight">{condition.name}</h1>
          {condition.description && (
            <p className="text-white/85 text-body-lg max-w-xl leading-relaxed">{condition.description}</p>
          )}
        </div>
      </div>

      {/* Emergency banner for severe conditions */}
      {condition.severity === 'severe' && (
        <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-5 flex gap-4 items-start">
          <AlertTriangle size={22} className="text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-bold text-rose-800 text-heading-md mb-1">This is a medical emergency</p>
            <p className="text-body-sm text-rose-700">{condition.when_to_see_vet}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0 space-y-10">
          {/* Symptoms */}
          {condition.symptoms.length > 0 && (
            <section>
              <h2 id="symptoms" className="font-display font-bold text-display-sm text-neutral-900 mb-4">Symptoms to Watch For</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {condition.symptoms.map((s) => (
                  <div key={s} className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                    <span className="text-rose-400 flex-shrink-0 mt-0.5">⚠</span>
                    <p className="text-body-sm text-neutral-700">{s}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* When to see vet (non-severe — already shown in banner for severe) */}
          {condition.when_to_see_vet && condition.severity !== 'severe' && (
            <section>
              <h2 id="vet" className="font-display font-bold text-display-sm text-neutral-900 mb-4 flex items-center gap-2">
                <ShieldCheck size={20} className="text-primary-500" /> When to See a Vet
              </h2>
              <div className="bg-primary-50 border border-primary-200 rounded-2xl p-5">
                <p className="text-body-md text-neutral-700 leading-relaxed">{condition.when_to_see_vet}</p>
              </div>
            </section>
          )}

          {/* Home remedies */}
          {condition.home_remedies && (
            <section>
              <h2 id="home-care" className="font-display font-bold text-display-sm text-neutral-900 mb-4">Home Management</h2>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                <p className="text-body-md text-neutral-700 leading-relaxed">{condition.home_remedies}</p>
              </div>
            </section>
          )}

          {/* Affected breeds */}
          {condition.affected_breeds.length > 0 && (
            <section>
              <h2 id="breeds" className="font-display font-bold text-display-sm text-neutral-900 mb-4">Breeds Most Affected</h2>
              <div className="flex flex-wrap gap-2">
                {condition.affected_breeds.map((breed) => (
                  <Link key={breed} href={`/learn/breed-guide/${breed.toLowerCase().replace(/\s+/g, '-')}`}
                    className="bg-neutral-100 hover:bg-primary-50 border border-neutral-200 hover:border-primary-300 text-neutral-700 hover:text-primary-700 px-3 py-1.5 rounded-full text-body-sm font-medium transition-colors"
                  >
                    {breed}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Vaccinations */}
          {condition.vaccinations_needed.length > 0 && (
            <section>
              <h2 id="vaccines" className="font-display font-bold text-display-sm text-neutral-900 mb-4">Vaccinations That Help</h2>
              <div className="space-y-2">
                {condition.vaccinations_needed.map((v) => (
                  <div key={v} className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                    <ShieldCheck size={15} className="text-success-600 flex-shrink-0 mt-0.5" />
                    <p className="text-body-sm text-neutral-700">{v}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-body-sm text-neutral-500">
                <Link href="/learn/health/vaccination" className="text-primary-600 hover:underline">View complete vaccination schedule →</Link>
              </p>
            </section>
          )}

          {/* Prevention + Do's and Don'ts */}
          {preventionDos.length > 0 && (
            <section>
              <h2 id="prevention" className="font-display font-bold text-display-sm text-neutral-900 mb-4">Prevention</h2>
              <DoAndDontsList dos={preventionDos} donts={generalDonts} />
            </section>
          )}

          {/* Shop CTA */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display font-bold text-heading-lg mb-1">Shop preventive gear</h3>
              <p className="text-primary-100 text-body-sm">Tick prevention collars, cooling vests, and quality harnesses</p>
            </div>
            <Link href="/products" className="flex-shrink-0 bg-white text-primary-700 font-medium px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors text-body-sm flex items-center gap-2">
              <ShoppingBag size={15} /> Browse Products
            </Link>
          </div>

          {/* Related conditions */}
          {related.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Related Conditions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((c) => {
                  const rcfg = SEVERITY_CONFIG[c.severity] ?? SEVERITY_CONFIG.mild;
                  return (
                    <Link key={c.slug} href={`/learn/health/${c.slug}`}
                      className="flex items-center gap-3 p-4 bg-white border border-neutral-100 rounded-xl hover:border-primary-200 hover:shadow-sm transition-all group"
                    >
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${rcfg.badge}`}>{c.severity}</span>
                      <p className="font-medium text-neutral-900 text-body-sm group-hover:text-primary-600 transition-colors flex-1 min-w-0 truncate">{c.name}</p>
                      <ArrowRight size={13} className="text-neutral-300 flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Desktop sidebar TOC */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-32 bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm">
            <p className="text-label-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">On this page</p>
            {[
              { id: 'symptoms', label: 'Symptoms' },
              { id: 'vet', label: 'When to See a Vet' },
              { id: 'home-care', label: 'Home Management' },
              { id: 'breeds', label: 'Affected Breeds' },
              { id: 'vaccines', label: 'Vaccinations' },
              { id: 'prevention', label: 'Prevention' },
            ].map(({ id, label }) => (
              <a key={id} href={`#${id}`} className="block text-body-sm text-neutral-500 hover:text-primary-600 py-1 transition-colors">
                {label}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
