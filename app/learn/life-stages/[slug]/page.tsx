import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { getLifeStageBySlug, getAllLifeStages } from '@/lib/learn-queries';
import BreadcrumbNav from '@/components/learn/BreadcrumbNav';
import DoAndDontsList from '@/components/learn/DoAndDontsList';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const stage = await getLifeStageBySlug(slug);
  if (!stage) return { title: 'Stage Not Found' };
  return {
    title: `${stage.name} Dog (${stage.age_range}) — Life Stage Guide`,
    description: (stage.behavioral_characteristics ?? '').slice(0, 155) || `Complete care guide for the ${stage.name} life stage in dogs.`,
  };
}

function ContentSection({ id, title, content, bg = 'bg-white' }: { id: string; title: string; content: string | null; bg?: string }) {
  if (!content) return null;
  return (
    <section>
      <h2 id={id} className="font-display font-bold text-display-sm text-neutral-900 mb-4">{title}</h2>
      <div className={`${bg} border border-neutral-100 rounded-2xl p-5`}>
        <p className="text-body-md text-neutral-700 leading-relaxed">{content}</p>
      </div>
    </section>
  );
}

function TagList({ items, label }: { items: string[]; label: string }) {
  if (!items?.length) return null;
  return (
    <section>
      <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">{label}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 p-3 bg-white border border-neutral-100 rounded-xl">
            <span className="text-warning-500 mt-0.5">⚠</span>
            <p className="text-body-sm text-neutral-700">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function LifeStagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [stage, allStages] = await Promise.all([
    getLifeStageBySlug(slug),
    getAllLifeStages(),
  ]);

  if (!stage) notFound();

  const otherStages = allStages.filter((s) => s.slug !== slug).slice(0, 4);

  // Build training dos/donts from training_tips text (split by newlines as rough heuristic)
  const trainingDos = stage.training_tips
    ? stage.training_tips.split('.').filter((s) => s.trim().length > 10).slice(0, 4).map((s) => s.trim())
    : [];

  return (
    <div className="space-y-10">
      <BreadcrumbNav items={[
        { label: 'Learn', href: '/learn' },
        { label: 'Life Stages', href: '/learn/life-stages' },
        { label: stage.name },
      ]} />

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-primary-700 p-8 md:p-12 text-white">
        <span className="inline-block bg-white/20 text-white text-label-sm px-3 py-1 rounded-full mb-3">
          {stage.age_range}
        </span>
        <h1 className="font-display font-bold text-display-md mb-3">{stage.name}</h1>
        {stage.behavioral_characteristics && (
          <p className="text-blue-100 text-body-lg max-w-xl leading-relaxed">{stage.behavioral_characteristics}</p>
        )}
      </div>

      {/* Nutrition */}
      <ContentSection id="nutrition" title="Nutritional Needs" content={stage.nutrition_needs} bg="bg-green-50" />

      {/* Exercise */}
      <ContentSection id="exercise" title="Exercise & Activity" content={stage.exercise_requirements} bg="bg-blue-50" />

      {/* Health concerns */}
      <TagList items={stage.health_concerns} label="Health Concerns at This Stage" />

      {/* Common issues */}
      <TagList items={stage.common_issues} label="Common Behaviour Issues" />

      {/* Special care */}
      <ContentSection id="special-care" title="Special Care" content={stage.special_care} bg="bg-amber-50" />

      {/* Training */}
      {stage.training_tips && (
        <section>
          <h2 id="training" className="font-display font-bold text-display-sm text-neutral-900 mb-4">Training Focus</h2>
          <div className="bg-white border border-neutral-100 rounded-2xl p-5 mb-4">
            <p className="text-body-md text-neutral-700 leading-relaxed">{stage.training_tips}</p>
          </div>
          {trainingDos.length > 0 && (
            <DoAndDontsList
              dos={trainingDos}
              donts={[
                'Use punishment or harsh corrections',
                'Train for too long in one session',
                'Skip socialisation opportunities',
                'Repeat commands the dog doesn\'t yet know',
              ]}
            />
          )}
        </section>
      )}

      {/* Product CTA */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display font-bold text-heading-lg mb-1">Shop gear for this life stage</h3>
          <p className="text-primary-100 text-body-sm">Harnesses, collars and leashes suited to your dog&apos;s current needs</p>
        </div>
        <Link href="/products" className="flex-shrink-0 bg-white text-primary-700 font-medium px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors text-body-sm flex items-center gap-2">
          <ShoppingBag size={15} /> Browse Products
        </Link>
      </div>

      {/* Other stages */}
      {otherStages.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Other Life Stages</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {otherStages.map((s) => (
              <Link key={s.slug} href={`/learn/life-stages/${s.slug}`}
                className="p-4 bg-white border border-neutral-100 rounded-xl hover:border-primary-200 hover:shadow-sm transition-all group"
              >
                <p className="text-body-sm font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">{s.name}</p>
                <p className="text-label-sm text-neutral-400 mt-1">{s.age_range}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
