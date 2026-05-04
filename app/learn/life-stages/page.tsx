import type { Metadata } from 'next';
import BreadcrumbNav from '@/components/learn/BreadcrumbNav';
import StageCard from '@/components/learn/StageCard';
import { getAllLifeStages } from '@/lib/learn-queries';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Dog Life Stages Guide — Puppy to Senior',
  description: 'Understand what your dog needs at every life stage — nutrition, exercise, health, and training from newborn to geriatric.',
};

const STAGE_GROUPS = [
  { key: 'puppy', label: 'Puppy', slugs: ['neonatal', 'puppy-early', 'puppy-socialisation', 'puppy-juvenile'] },
  { key: 'adolescent', label: 'Adolescent & Young Adult', slugs: ['adolescent', 'young-adult'] },
  { key: 'adult', label: 'Adult', slugs: ['adult'] },
  { key: 'senior', label: 'Senior & Geriatric', slugs: ['senior-small', 'senior-large', 'geriatric'] },
];

const FAQ = [
  { q: 'When is a dog considered a senior?', a: 'Small and medium breeds are considered senior from around 8 years. Large breeds age faster — they are senior from 6–7 years, and giant breeds from as early as 5.' },
  { q: 'When should I switch from puppy food to adult food?', a: 'Small and medium breeds transition at 12 months. Large and giant breeds should stay on puppy food until 18–24 months due to the controlled calcium levels needed for proper bone development.' },
  { q: 'How much exercise does a puppy need?', a: 'The guideline is 5 minutes per month of age, twice daily. A 3-month-old puppy needs just 15 minutes of structured exercise twice a day. Over-exercising puppies risks growth plate injury.' },
  { q: 'Do senior dogs need less food?', a: 'Generally yes — metabolism slows with age. However, protein needs stay high (to prevent muscle wasting). Most senior dogs need 20–30% fewer calories than their adult peak but the same or higher protein percentage.' },
];

export default async function LifeStagesPage() {
  const stages = await getAllLifeStages();

  const stagesBySlug = Object.fromEntries(stages.map((s) => [s.slug, s]));

  const featured = stages[2] ?? stages[0]; // socialisation puppy as featured, or first

  return (
    <div className="space-y-12">
      <BreadcrumbNav items={[{ label: 'Learn', href: '/learn' }, { label: 'Life Stages' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white">
        <h1 className="font-display font-bold text-display-md mb-4 leading-tight">
          Your Dog&apos;s Life Stages
        </h1>
        <p className="text-body-lg text-blue-100 max-w-xl leading-relaxed">
          From the first day home to the golden years — understand what your dog needs at every stage of life.
          Nutrition, exercise, health, and training guidance tailored to each phase.
        </p>
      </div>

      {/* Featured stage */}
      {featured && (
        <section>
          <p className="text-label-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Most critical stage</p>
          <StageCard
            stage={{
              name: featured.name,
              slug: featured.slug,
              age_range: featured.age_range,
              image_url: featured.image_url,
              behavioral_characteristics: featured.behavioral_characteristics,
            }}
            featured
          />
        </section>
      )}

      {/* Grouped stages */}
      {STAGE_GROUPS.map((group) => {
        const groupStages = group.slugs.map((s) => stagesBySlug[s]).filter(Boolean);
        if (!groupStages.length) return null;
        return (
          <section key={group.key}>
            <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-6">{group.label}</h2>
            <div className={`grid gap-4 ${groupStages.length === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
              {groupStages.map((stage) => (
                <StageCard
                  key={stage.slug}
                  stage={{
                    name: stage.name,
                    slug: stage.slug,
                    age_range: stage.age_range,
                    image_url: stage.image_url,
                    behavioral_characteristics: stage.behavioral_characteristics,
                  }}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Life stage overview */}
      <section className="bg-neutral-50 rounded-2xl p-6 md:p-8">
        <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Why Life Stages Matter</h2>
        <p className="text-body-md text-neutral-700 leading-relaxed mb-4">
          A dog&apos;s needs change dramatically across its life. Feeding a 3-month-old puppy the same food as
          a 10-year-old senior, or exercising them the same way, can cause serious harm. Understanding each
          stage helps you prevent disease, build the right habits early, and give your dog the best quality of life.
        </p>
        <p className="text-body-md text-neutral-700 leading-relaxed">
          In India, life stage care matters even more because of environmental factors — monsoon season diseases
          (leptospirosis), summer heat stroke risks, and endemic tick fever all affect dogs differently depending
          on their age and immune system maturity.
        </p>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div key={i} className="bg-white border border-neutral-100 rounded-xl p-5">
              <p className="font-display font-semibold text-neutral-900 text-heading-sm mb-2">{item.q}</p>
              <p className="text-body-sm text-neutral-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
