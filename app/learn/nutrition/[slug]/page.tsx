import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Check, X, AlertTriangle } from 'lucide-react';
import { getNutritionalGuideBySlug, getNutritionalGuides } from '@/lib/learn-queries';
import BreadcrumbNav from '@/components/learn/BreadcrumbNav';
import ComparisonTable from '@/components/learn/ComparisonTable';
import type { NutritionCategory } from '@/types/database';

export const revalidate = 3600;

const CATEGORY_LABEL: Record<NutritionCategory, string> = {
  food_types: 'Food Types', feeding_schedules: 'Feeding Schedules',
  special_diets: 'Special Diets', foods_to_avoid: 'Foods to Avoid', supplements: 'Supplements',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getNutritionalGuideBySlug(slug);
  if (!guide) return { title: 'Guide Not Found' };
  return {
    title: `${guide.title} — Nutrition Guide`,
    description: (guide.description ?? '').slice(0, 155) || `Detailed nutrition guide: ${guide.title}`,
  };
}

function buildQuantitiesTable(chart: Record<string, unknown>) {
  if (!chart || Object.keys(chart).length === 0) return null;
  const stages = Object.keys(chart);
  const allProps = new Set<string>();
  stages.forEach((s) => {
    const v = chart[s] as Record<string, unknown>;
    if (v && typeof v === 'object') Object.keys(v).forEach((k) => allProps.add(k));
  });
  const items = stages.map((stage) => {
    const v = chart[stage] as Record<string, unknown> ?? {};
    const props: Record<string, string | number | boolean | null> = {};
    allProps.forEach((p) => { props[p] = String(v[p] ?? '—'); });
    return { name: stage.replace(/_/g, ' '), properties: props };
  });
  return items;
}

export default async function NutritionGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [guide, allGuides] = await Promise.all([
    getNutritionalGuideBySlug(slug),
    getNutritionalGuides(),
  ]);

  if (!guide) notFound();

  const related = allGuides.filter((g) => g.slug !== slug && g.category === guide.category).slice(0, 3);
  const tableItems = buildQuantitiesTable(guide.quantities_chart as Record<string, unknown>);

  return (
    <div className="space-y-10">
      <BreadcrumbNav items={[
        { label: 'Learn', href: '/learn' },
        { label: 'Nutrition', href: '/learn/nutrition' },
        { label: guide.title },
      ]} />

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1568572933382-74d440642117?w=1200&q=80"
          alt={guide.title} className="w-full h-48 md:h-60 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-forest-500/70" />
        <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
          <span className="inline-block bg-white/20 text-white text-label-sm font-semibold px-3 py-1 rounded-full mb-3 w-fit">
            {CATEGORY_LABEL[guide.category] ?? guide.category}
          </span>
          <h1 className="font-display font-bold italic text-white text-display-sm md:text-display-md mb-3 leading-tight">{guide.title}</h1>
          {guide.description && (
            <p className="text-white/80 text-body-md leading-relaxed max-w-2xl line-clamp-2">{guide.description}</p>
          )}
        </div>
      </div>

      {/* Quantities chart */}
      {tableItems && tableItems.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Quantities by Life Stage</h2>
          <ComparisonTable items={tableItems} />
        </section>
      )}

      {/* Recommended foods */}
      {guide.recommended_foods.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Recommended Foods</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {guide.recommended_foods.map((food) => (
              <div key={food} className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                <Check size={15} className="text-success-600 flex-shrink-0 mt-0.5" />
                <p className="text-body-sm text-neutral-700">{food}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Foods to avoid */}
      {guide.foods_to_avoid.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-rose-500" /> Foods to Avoid
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {guide.foods_to_avoid.map((food) => (
              <div key={food} className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                <X size={15} className="text-error-500 flex-shrink-0 mt-0.5" />
                <p className="text-body-sm text-neutral-700">{food}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Supplements */}
      {guide.supplements_info && (
        <section>
          <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Supplements</h2>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <p className="text-body-md text-neutral-700 leading-relaxed">{guide.supplements_info}</p>
          </div>
        </section>
      )}

      {/* Special diets */}
      {guide.special_diets.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Special Diet Options</h2>
          <div className="flex flex-wrap gap-2">
            {guide.special_diets.map((diet) => (
              <span key={diet} className="bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-full text-body-sm font-medium">
                {diet}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Transition guide */}
      {guide.transitions_guide && (
        <section>
          <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Transition Guide</h2>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <p className="text-body-md text-neutral-700 leading-relaxed">{guide.transitions_guide}</p>
          </div>
        </section>
      )}

      {/* Related guides */}
      {related.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Related Guides</h2>
          <div className="space-y-2">
            {related.map((g) => (
              <Link key={g.slug} href={`/learn/nutrition/${g.slug}`}
                className="flex items-center gap-3 p-4 bg-white border border-neutral-100 rounded-xl hover:border-primary-200 hover:shadow-sm transition-all group"
              >
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 text-body-sm group-hover:text-primary-600 transition-colors">{g.title}</p>
                </div>
                <span className="text-primary-400 text-body-sm">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
