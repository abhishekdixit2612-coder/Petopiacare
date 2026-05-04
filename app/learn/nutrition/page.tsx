import type { Metadata } from 'next';
import Link from 'next/link';
import { Utensils, ArrowRight, AlertTriangle } from 'lucide-react';
import { getNutritionalGuides } from '@/lib/learn-queries';
import BreadcrumbNav from '@/components/learn/BreadcrumbNav';
import type { NutritionCategory } from '@/types/database';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Dog Nutrition Guide — Feeding Your Dog Right',
  description: 'Complete nutrition guides for Indian dogs — kibble, homemade food, BARF diet, portion sizes, feeding schedules, and toxic foods to avoid.',
};

const CATEGORY_META: Record<NutritionCategory, { label: string; icon: string; description: string; bg: string }> = {
  food_types:        { label: 'Food Types',        icon: '🍗', description: 'Dry kibble, wet food, raw BARF diet, and homemade Indian options compared.',       bg: 'bg-green-50 border-green-200' },
  feeding_schedules: { label: 'Feeding Schedules', icon: '🕐', description: 'How often to feed and how much — by age, weight, and activity level.',              bg: 'bg-blue-50 border-blue-200' },
  special_diets:     { label: 'Special Diets',     icon: '⚖️', description: 'Weight management, senior nutrition, vegetarian diets, and breed-specific needs.',  bg: 'bg-purple-50 border-purple-200' },
  foods_to_avoid:    { label: 'Foods to Avoid',    icon: '☠️', description: 'Indian kitchen ingredients that are toxic to dogs — onion, garlic, grapes, and more.', bg: 'bg-rose-50 border-rose-200' },
  supplements:       { label: 'Supplements',       icon: '💊', description: 'Omega-3, probiotics, joint supplements, and what Indian dogs actually need.',        bg: 'bg-amber-50 border-amber-200' },
};

const CATEGORY_ORDER: NutritionCategory[] = ['food_types', 'feeding_schedules', 'special_diets', 'foods_to_avoid', 'supplements'];

export default async function NutritionPage() {
  const guides = await getNutritionalGuides();

  const byCategory = CATEGORY_ORDER.reduce<Record<string, typeof guides>>((acc, cat) => {
    acc[cat] = guides.filter((g) => g.category === cat);
    return acc;
  }, {});

  return (
    <div className="space-y-12">
      <BreadcrumbNav items={[{ label: 'Learn', href: '/learn' }, { label: 'Nutrition' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-green-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl">🍗</div>
          <div>
            <h1 className="font-display font-bold text-display-md mb-3">Complete Dog Nutrition Guide</h1>
            <p className="text-body-lg text-green-100 max-w-xl leading-relaxed">
              Feeding your dog correctly is one of the most impactful things you can do for their health.
              These guides cover everything specific to Indian dogs, ingredients, and budgets.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency: foods to avoid callout */}
      <div className="bg-rose-50 border-l-4 border-rose-500 rounded-r-2xl p-5 flex gap-4 items-start">
        <AlertTriangle size={20} className="text-rose-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-display font-semibold text-neutral-900 text-heading-sm mb-1">
            Common Indian foods that are toxic to dogs
          </p>
          <p className="text-body-sm text-neutral-700">
            Onion, garlic, grapes, raisins, xylitol (artificial sweetener), chocolate, and cooked bones can be fatal.
            {' '}<Link href="/learn/nutrition/foods-to-avoid-india" className="text-rose-600 font-semibold hover:underline">Read the full list →</Link>
          </p>
        </div>
      </div>

      {/* Category navigation */}
      <section>
        <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-6">Browse by Topic</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            const count = byCategory[cat]?.length ?? 0;
            return (
              <div key={cat} className={`rounded-2xl border p-5 ${meta.bg}`}>
                <div className="text-3xl mb-3">{meta.icon}</div>
                <h3 className="font-display font-semibold text-neutral-900 text-heading-md mb-2">{meta.label}</h3>
                <p className="text-body-sm text-neutral-600 leading-relaxed mb-4">{meta.description}</p>
                {byCategory[cat]?.slice(0, 3).map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/learn/nutrition/${guide.slug}`}
                    className="block text-body-sm text-primary-600 hover:underline mb-1"
                  >
                    → {guide.title}
                  </Link>
                ))}
                {count === 0 && (
                  <p className="text-body-sm text-neutral-400 italic">Coming soon</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* All guides list */}
      {guides.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-6">All Nutrition Guides</h2>
          <div className="space-y-2">
            {guides.map((guide) => {
              const meta = CATEGORY_META[guide.category];
              return (
                <Link
                  key={guide.slug}
                  href={`/learn/nutrition/${guide.slug}`}
                  className="flex items-center gap-4 p-4 bg-white border border-neutral-100 rounded-xl hover:border-primary-200 hover:shadow-sm transition-all group"
                >
                  <span className="text-xl flex-shrink-0">{meta?.icon ?? '📖'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 text-body-md group-hover:text-primary-600 transition-colors">{guide.title}</p>
                    <p className="text-label-sm text-neutral-400 mt-0.5">{meta?.label ?? guide.category}</p>
                  </div>
                  <ArrowRight size={15} className="text-neutral-300 group-hover:text-primary-400 flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Nutrition basics */}
      <section className="bg-neutral-50 rounded-2xl p-6 md:p-8">
        <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Nutrition Basics for Indian Dogs</h2>
        <div className="space-y-3 text-body-md text-neutral-700">
          <p><strong>Protein first:</strong> Real meat (chicken, fish, mutton) should be the primary ingredient in any food — kibble or homemade.</p>
          <p><strong>Two meals a day:</strong> Most adult dogs thrive on two measured meals. Free-feeding (leaving food out all day) is the leading cause of obesity in Indian dogs.</p>
          <p><strong>Homemade is valid but needs supplements:</strong> Homemade food lacks calcium, Vitamin D, and zinc. A vet-recommended supplement powder is non-negotiable.</p>
          <p><strong>Water always:</strong> Indian summers cause rapid dehydration. Fresh, cool water must be available at all times — especially for brachycephalic breeds.</p>
        </div>
      </section>
    </div>
  );
}
