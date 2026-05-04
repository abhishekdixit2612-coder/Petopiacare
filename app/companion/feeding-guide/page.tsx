'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UtensilsCrossed, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';
import { calculateFeeding, type ActivityLevel, type LifeStage } from '@/lib/companion-utils';

const STAGE_OPTIONS: { value: LifeStage; label: string; desc: string }[] = [
  { value: 'puppy_young', label: 'Young Puppy (< 4 months)', desc: 'Rapid growth, highest calorie needs per kg' },
  { value: 'puppy_older', label: 'Older Puppy (4–12 months)', desc: 'Still growing, high energy requirements' },
  { value: 'adult',       label: 'Adult (1–7 years)',         desc: 'Maintenance phase' },
  { value: 'senior',      label: 'Senior (7+ years)',         desc: 'Reduced metabolism, lower calorie needs' },
];

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: 'sedentary',   label: 'Sedentary',    desc: 'Mostly indoors, minimal walks' },
  { value: 'moderate',    label: 'Moderate',     desc: '30–45 min exercise daily' },
  { value: 'active',      label: 'Active',       desc: '1–2 hours daily, active dog' },
  { value: 'very_active', label: 'Very Active',  desc: 'Working dog, 2+ hours of vigorous activity' },
];

const TRANSITION_PLAN = [
  { day: 'Days 1–3',  old: 75, new: 25, tip: 'Watch for loose stools or gas — completely normal' },
  { day: 'Days 4–6',  old: 50, new: 50, tip: 'Some dogs need a slower transition — stay here longer if needed' },
  { day: 'Days 7–9',  old: 25, new: 75, tip: 'Most dogs are fully adjusted by now' },
  { day: 'Day 10+',   old: 0,  new: 100, tip: 'Transition complete. If any issues persist, consult your vet.' },
];

const inputCls = 'w-full border border-neutral-200 rounded-xl px-4 py-3 text-body-md focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all bg-white';

export default function FeedingGuide() {
  const [weight, setWeight] = useState('');
  const [stage, setStage] = useState<LifeStage>('adult');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [neutered, setNeutered] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof calculateFeeding> | null>(null);
  const [showTransition, setShowTransition] = useState(false);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const kg = parseFloat(weight);
    if (!kg || kg <= 0 || kg > 100) return;
    setResult(calculateFeeding(kg, stage, activity, neutered));
  };

  const stageLabel = STAGE_OPTIONS.find((s) => s.value === stage)?.label ?? '';
  const actLabel   = ACTIVITY_OPTIONS.find((a) => a.value === activity)?.label ?? '';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-display-sm text-neutral-900 mb-1">Feeding Calculator</h1>
        <p className="text-body-md text-neutral-500">Calculate daily food portions based on your dog&apos;s weight, age, and activity level</p>
      </div>

      <div className={`flex flex-col gap-8 ${result ? 'lg:flex-row' : ''}`}>
        {/* Form */}
        <div className={`bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm ${result ? 'lg:w-96 flex-shrink-0' : 'max-w-xl'}`}>
          <h2 className="font-display font-semibold text-neutral-900 text-heading-md mb-5">Enter Dog Details</h2>
          <form onSubmit={calculate} className="space-y-5">
            <div>
              <label className="block text-label font-medium text-neutral-700 mb-2">Current Weight (kg) *</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
                min="0.5" max="100" step="0.1" required placeholder="e.g. 15.5" className={inputCls} />
            </div>

            <div>
              <label className="block text-label font-medium text-neutral-700 mb-2">Life Stage *</label>
              <div className="space-y-2">
                {STAGE_OPTIONS.map((opt) => (
                  <label key={opt.value} className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition-all ${stage === opt.value ? 'bg-primary-50 border-primary-400' : 'border-neutral-200 hover:border-neutral-300'}`}>
                    <input type="radio" name="stage" value={opt.value} checked={stage === opt.value} onChange={() => setStage(opt.value)} className="mt-0.5 accent-primary-500" />
                    <div>
                      <p className="text-body-sm font-medium text-neutral-900">{opt.label}</p>
                      <p className="text-label-sm text-neutral-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {stage === 'adult' && (
              <div>
                <label className="block text-label font-medium text-neutral-700 mb-2">Activity Level *</label>
                <div className="space-y-2">
                  {ACTIVITY_OPTIONS.map((opt) => (
                    <label key={opt.value} className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition-all ${activity === opt.value ? 'bg-primary-50 border-primary-400' : 'border-neutral-200 hover:border-neutral-300'}`}>
                      <input type="radio" name="activity" value={opt.value} checked={activity === opt.value} onChange={() => setActivity(opt.value)} className="mt-0.5 accent-primary-500" />
                      <div>
                        <p className="text-body-sm font-medium text-neutral-900">{opt.label}</p>
                        <p className="text-label-sm text-neutral-500">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={neutered} onChange={(e) => setNeutered(e.target.checked)} className="w-4 h-4 accent-primary-500" />
              <span className="text-body-sm text-neutral-700">Spayed / Neutered <span className="text-neutral-400">(reduces calorie needs by ~15%)</span></span>
            </label>

            <button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3.5 rounded-xl transition-colors text-body-md">
              Calculate Portions
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="flex-1 space-y-5">
            {/* Summary */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
              <p className="text-primary-200 text-body-sm mb-1">For a {weight}kg {stageLabel}{stage === 'adult' ? ` · ${actLabel}` : ''}{neutered ? ' · Neutered' : ''}</p>
              <h2 className="font-display font-bold text-display-sm mb-4">Daily Food Recommendation</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Calories/day', value: `${result.mer} kcal` },
                  { label: 'Dry food/day', value: `${result.dryFoodGrams}g` },
                  { label: 'Meals/day',    value: `${result.mealsPerDay}×` },
                  { label: 'Per meal',     value: `${result.gramsPerMeal}g` },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="font-display font-bold text-xl">{stat.value}</p>
                    <p className="text-primary-200 text-[11px] mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Diet options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Dry Kibble', emoji: '🥩', color: 'bg-amber-50 border-amber-200',
                  lines: [`${result.dryFoodGrams}g per day`, `~${result.gramsPerMeal}g per meal`, `₹${result.monthlyBudget}/month estimate`, `${result.monthlyKg}kg bag per month`],
                  note: 'Use a measuring cup, not guesswork.' },
                { title: 'Wet Food', emoji: '🍖', color: 'bg-blue-50 border-blue-200',
                  lines: [`${Math.round(result.dryFoodGrams * 3.5)}g wet food/day`, `${result.mealsPerDay} meals/day`, `Wet food ~80% water`, 'Add dry for dental health'],
                  note: 'Wet food has ~70-80% water content, so volume is much higher.' },
                { title: 'Mixed Diet', emoji: '🥗', color: 'bg-green-50 border-green-200',
                  lines: [`${Math.round(result.dryFoodGrams * 0.5)}g dry kibble`, `+ ${Math.round(result.dryFoodGrams * 1.5)}g wet food`, `Best of both worlds`, 'Great palatability'],
                  note: 'Mix half dry, half wet for improved taste and hydration.' },
                { title: 'Homemade', emoji: '🍳', color: 'bg-purple-50 border-purple-200',
                  lines: [`${result.mealsPerDay} meals/day`, `~${result.mer} kcal total`, 'Add vet supplement', 'Rotate proteins weekly'],
                  note: 'Always add a vet-approved supplement — homemade food is typically deficient in Ca, Zn, and D3.' },
              ].map((opt) => (
                <div key={opt.title} className={`rounded-2xl border p-5 ${opt.color}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{opt.emoji}</span>
                    <h3 className="font-display font-semibold text-neutral-900 text-heading-sm">{opt.title}</h3>
                  </div>
                  <ul className="space-y-1 mb-3">
                    {opt.lines.map((l) => (
                      <li key={l} className="text-body-sm text-neutral-700 flex gap-2"><span className="text-neutral-400">·</span>{l}</li>
                    ))}
                  </ul>
                  <p className="text-label-sm text-neutral-500 italic">{opt.note}</p>
                </div>
              ))}
            </div>

            {/* Monthly budget */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-display font-semibold text-neutral-900 text-heading-md">Monthly Food Budget (Dry Kibble)</p>
                <p className="text-body-sm text-neutral-500">Based on mid-range Indian kibble at ₹200/kg</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-display-sm text-primary-600">₹{result.monthlyBudget}</p>
                <p className="text-label-sm text-neutral-400">{result.monthlyKg}kg bag/month</p>
              </div>
            </div>

            {/* Transition plan */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm">
              <button onClick={() => setShowTransition((v) => !v)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="font-display font-semibold text-neutral-900 text-heading-md">Switching Foods? Follow This Plan</h3>
                <ArrowRight size={16} className={`text-neutral-400 transition-transform ${showTransition ? 'rotate-90' : ''}`} />
              </button>
              {showTransition && (
                <div className="mt-4 space-y-2">
                  {TRANSITION_PLAN.map((step) => (
                    <div key={step.day} className="flex gap-4 p-3 bg-neutral-50 rounded-xl">
                      <div className="w-20 flex-shrink-0">
                        <p className="text-body-sm font-semibold text-neutral-700">{step.day}</p>
                      </div>
                      <div className="flex-1">
                        <div className="flex gap-3 mb-1">
                          {step.old > 0 && <span className="text-label-sm bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full">{step.old}% old</span>}
                          {step.new > 0 && <span className="text-label-sm bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{step.new}% new</span>}
                        </div>
                        <p className="text-label-sm text-neutral-500">{step.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Important note */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
              <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-body-sm text-amber-800">
                <span className="font-semibold">These are estimates.</span> Every dog is individual — adjust based on your dog&apos;s body condition. You should be able to feel ribs easily but not see them. Consult your vet for medical conditions.
              </p>
            </div>

            {/* Shop CTA */}
            <Link href="/products"
              className="flex items-center justify-between p-5 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl text-white hover:opacity-95 transition-opacity"
            >
              <div>
                <p className="font-display font-bold text-heading-lg">Shop feeding essentials</p>
                <p className="text-primary-100 text-body-sm">Bowls, slow feeders, measuring cups, treats</p>
              </div>
              <ShoppingBag size={22} className="flex-shrink-0" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
