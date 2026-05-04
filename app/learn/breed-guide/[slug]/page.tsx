import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Check, X, ShoppingBag, Activity, Scissors, Heart, Clock } from 'lucide-react';
import { getBreedBySlug, getRelatedBreeds } from '@/lib/learn-queries';
import BreadcrumbNav from '@/components/learn/BreadcrumbNav';
import BreedCard from '@/components/learn/BreedCard';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const breed = await getBreedBySlug(slug);
  if (!breed) return { title: 'Breed Not Found' };
  return {
    title: `${breed.name} — Breed Guide`,
    description: (breed.full_description ?? '').slice(0, 155) || `Complete guide for the ${breed.name} — temperament, care, nutrition, and health in India.`,
    openGraph: { images: breed.image_url ? [breed.image_url] : [] },
  };
}

const SIZE_LABEL: Record<string, string> = { small: 'Small', medium: 'Medium', large: 'Large', xlarge: 'Extra Large' };
const EXERCISE_LABEL: Record<string, string> = { low: 'Low', moderate: 'Moderate', high: 'High', very_high: 'Very High' };
const GROOMING_LABEL: Record<string, string> = { minimal: 'Minimal', moderate: 'Moderate', high: 'High', very_high: 'Very High' };
const DIFFICULTY_LABEL: Record<string, string> = { easy: 'Easy', moderate: 'Moderate', difficult: 'Difficult' };

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2.5 border-b border-neutral-100 last:border-0">
      <span className="text-body-sm text-neutral-500 flex-shrink-0">{label}</span>
      <span className="text-body-sm font-medium text-neutral-900 text-right">{value}</span>
    </div>
  );
}

function BoolIcon({ value }: { value: boolean }) {
  return value
    ? <span className="flex items-center gap-1 text-success-600"><Check size={13} /> Yes</span>
    : <span className="flex items-center gap-1 text-neutral-400"><X size={13} /> No</span>;
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="font-display font-bold text-display-sm text-neutral-900 mb-4 pt-2">{children}</h2>;
}

export default async function BreedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const breed = await getBreedBySlug(slug);
  if (!breed) notFound();

  const relatedBreeds = await getRelatedBreeds(slug, breed.size);

  return (
    <div className="space-y-8">
      <BreadcrumbNav items={[
        { label: 'Learn', href: '/learn' },
        { label: 'Breed Guide', href: '/learn/breed-guide' },
        { label: breed.name },
      ]} />

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-neutral-100 h-64 md:h-80">
        {breed.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={breed.image_url} alt={breed.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl">🐕</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <div>
            <span className="inline-block bg-white/20 text-white text-label-sm px-3 py-1 rounded-full mb-2">
              {SIZE_LABEL[breed.size] ?? breed.size} · {breed.origin ?? 'Unknown origin'}
            </span>
            <h1 className="font-display font-bold text-display-md text-white">{breed.name}</h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-10">

          {/* Quick stats (mobile) */}
          <div className="lg:hidden bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm">
            <h2 className="font-display font-semibold text-neutral-900 text-heading-md mb-4">Quick Stats</h2>
            <StatRow label="Size" value={SIZE_LABEL[breed.size] ?? breed.size} />
            <StatRow label="Weight" value={breed.weight_range ?? '—'} />
            <StatRow label="Height" value={breed.height_range ?? '—'} />
            <StatRow label="Life Expectancy" value={breed.life_expectancy ?? '—'} />
            <StatRow label="Exercise" value={EXERCISE_LABEL[breed.exercise_level] ?? breed.exercise_level} />
            <StatRow label="Grooming" value={GROOMING_LABEL[breed.grooming_needs] ?? breed.grooming_needs} />
            <StatRow label="Training" value={DIFFICULTY_LABEL[breed.training_difficulty] ?? breed.training_difficulty} />
            <StatRow label="Good with Kids" value={<BoolIcon value={breed.good_with_kids} />} />
            <StatRow label="Good with Pets" value={<BoolIcon value={breed.good_with_pets} />} />
          </div>

          {/* Overview */}
          {breed.full_description && (
            <section>
              <SectionHeading id="overview">About the {breed.name}</SectionHeading>
              <p className="text-body-md text-neutral-700 leading-relaxed">{breed.full_description}</p>
            </section>
          )}

          {/* Temperament */}
          {breed.temperament.length > 0 && (
            <section>
              <SectionHeading id="temperament">Temperament</SectionHeading>
              <div className="flex flex-wrap gap-2 mb-4">
                {breed.temperament.map((t) => (
                  <span key={t} className="bg-primary-50 border border-primary-200 text-primary-700 px-3 py-1.5 rounded-full text-body-sm font-medium capitalize">
                    {t}
                  </span>
                ))}
              </div>
              {breed.behavioral_traits && (
                <p className="text-body-md text-neutral-700 leading-relaxed">{breed.behavioral_traits}</p>
              )}
            </section>
          )}

          {/* Care tips */}
          {breed.care_tips && (
            <section>
              <SectionHeading id="care">Care & Grooming</SectionHeading>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <p className="text-body-md text-neutral-700 leading-relaxed">{breed.care_tips}</p>
              </div>
            </section>
          )}

          {/* Nutrition */}
          {breed.nutrition_notes && (
            <section>
              <SectionHeading id="nutrition">Nutritional Needs</SectionHeading>
              <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                <p className="text-body-md text-neutral-700 leading-relaxed">{breed.nutrition_notes}</p>
              </div>
              <p className="mt-4 text-body-sm text-neutral-500">
                For detailed feeding schedules and quantity charts, see our{' '}
                <Link href="/learn/nutrition" className="text-primary-600 hover:underline">Nutrition Guide →</Link>
              </p>
            </section>
          )}

          {/* Health */}
          {breed.common_health_issues.length > 0 && (
            <section>
              <SectionHeading id="health">Common Health Issues</SectionHeading>
              <ul className="space-y-2">
                {breed.common_health_issues.map((issue) => (
                  <li key={issue} className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                    <Heart size={15} className="text-rose-400 flex-shrink-0 mt-0.5" />
                    <span className="text-body-sm text-neutral-700 capitalize">{issue}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-body-sm text-neutral-500">
                Learn more in our{' '}
                <Link href="/learn/health-wellness" className="text-primary-600 hover:underline">Health & Wellness Guide →</Link>
              </p>
            </section>
          )}

          {/* Shop CTA */}
          <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display font-bold text-heading-lg mb-1">Shop gear for your {breed.name}</h3>
                <p className="text-primary-100 text-body-sm">
                  Harnesses, leashes and collars suited for {SIZE_LABEL[breed.size]?.toLowerCase() ?? ''} breeds
                </p>
              </div>
              <Link
                href={`/products?category=Harnesses`}
                className="flex-shrink-0 bg-white text-primary-700 font-medium px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors text-body-sm flex items-center gap-2"
              >
                <ShoppingBag size={15} /> Browse Products
              </Link>
            </div>
          </section>

          {/* Related breeds */}
          {relatedBreeds.length > 0 && (
            <section>
              <SectionHeading id="related">Similar Breeds</SectionHeading>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedBreeds.map((b) => (
                  <BreedCard
                    key={b.slug}
                    breed={{ name: b.name, slug: b.slug, image_url: b.image_url, size: b.size, temperament: b.temperament, exercise_level: b.exercise_level }}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-32 space-y-4">
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm">
              <h2 className="font-display font-semibold text-neutral-900 text-heading-sm mb-4">Quick Stats</h2>
              <StatRow label="Size" value={SIZE_LABEL[breed.size] ?? breed.size} />
              <StatRow label="Weight" value={breed.weight_range ?? '—'} />
              <StatRow label="Height" value={breed.height_range ?? '—'} />
              <StatRow label="Life Expectancy" value={<span className="flex items-center gap-1"><Clock size={12} /> {breed.life_expectancy ?? '—'}</span>} />
              <StatRow label="Exercise" value={<span className="flex items-center gap-1"><Activity size={12} /> {EXERCISE_LABEL[breed.exercise_level] ?? breed.exercise_level}</span>} />
              <StatRow label="Grooming" value={<span className="flex items-center gap-1"><Scissors size={12} /> {GROOMING_LABEL[breed.grooming_needs] ?? breed.grooming_needs}</span>} />
              <StatRow label="Training" value={DIFFICULTY_LABEL[breed.training_difficulty] ?? breed.training_difficulty} />
              <StatRow label="Kids" value={<BoolIcon value={breed.good_with_kids} />} />
              <StatRow label="Other pets" value={<BoolIcon value={breed.good_with_pets} />} />
            </div>

            {/* TOC */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm">
              <p className="text-label-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">On this page</p>
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'temperament', label: 'Temperament' },
                { id: 'care', label: 'Care & Grooming' },
                { id: 'nutrition', label: 'Nutrition' },
                { id: 'health', label: 'Health Issues' },
              ].map(({ id, label }) => (
                <a key={id} href={`#${id}`} className="block text-body-sm text-neutral-500 hover:text-primary-600 py-1 transition-colors">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
