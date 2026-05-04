import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, Heart, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { getAllHealthConditions } from '@/lib/learn-queries';
import BreadcrumbNav from '@/components/learn/BreadcrumbNav';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Dog Health & Wellness Guide — India',
  description: 'Common health conditions in Indian dogs — tick fever, mange, hip dysplasia, heat stroke. Prevention, symptoms, and when to see a vet.',
};

const EMERGENCY_SIGNS = [
  'Pale, white or blue-tinged gums',
  'Inability to stand or sudden collapse',
  'Seizures or loss of consciousness',
  'Unproductive retching with swollen belly (bloat)',
  'Severe difficulty breathing',
  'Heavy bleeding that won\'t stop',
  'Body temperature above 40°C',
  'Snake or venomous insect bite',
];

const DAILY_CHECKS = ['Fresh water available', 'Normal energy level', 'Good appetite', 'Normal stool consistency'];
const WEEKLY_CHECKS = ['Check ears for odour or discharge', 'Inspect coat for ticks', 'Trim nails if needed', 'Check eyes for discharge'];
const MONTHLY_CHECKS = ['Weigh the dog', 'Administer tick prevention', 'Administer deworming (if on monthly schedule)', 'Dental check'];

function CheckList({ items, variant }: { items: string[]; variant: 'success' | 'warning' }) {
  const colors = variant === 'success'
    ? { bg: 'bg-success-50 border-success-100', icon: 'text-success-500', text: 'text-neutral-700' }
    : { bg: 'bg-warning-50 border-warning-100', icon: 'text-warning-500', text: 'text-neutral-700' };
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className={`flex items-start gap-3 p-3 ${colors.bg} border rounded-xl`}>
          <CheckCircle size={15} className={`${colors.icon} flex-shrink-0 mt-0.5`} />
          <span className={`text-body-sm ${colors.text}`}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function HealthWellnessPage() {
  const conditions = await getAllHealthConditions();

  const severe   = conditions.filter((c) => c.severity === 'severe');
  const moderate = conditions.filter((c) => c.severity === 'moderate');
  const mild     = conditions.filter((c) => c.severity === 'mild');

  const SEVERITY_CONFIG = {
    severe:   { label: 'Severe — Emergency', bg: 'bg-rose-50 border-rose-200', badge: 'bg-rose-100 text-rose-700' },
    moderate: { label: 'Moderate — See Vet Soon', bg: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700' },
    mild:     { label: 'Mild — Monitor at Home', bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700' },
  };

  return (
    <div className="space-y-12">
      <BreadcrumbNav items={[{ label: 'Learn', href: '/learn' }, { label: 'Health & Wellness' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white">
        <h1 className="font-display font-bold text-display-md mb-3">Health & Wellness Guide</h1>
        <p className="text-body-lg text-rose-100 max-w-xl leading-relaxed">
          Know the signs, understand the risks, and learn how to prevent the most common diseases
          affecting dogs in India — from tick fever to heat stroke.
        </p>
      </div>

      {/* Emergency warning */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={20} className="text-rose-600 flex-shrink-0" />
          <h2 className="font-display font-bold text-heading-lg text-rose-800">Emergency Warning Signs — Go to Vet Immediately</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EMERGENCY_SIGNS.map((sign) => (
            <div key={sign} className="flex items-start gap-2 text-body-sm text-rose-800">
              <span className="text-rose-500 mt-0.5 flex-shrink-0">⚠</span> {sign}
            </div>
          ))}
        </div>
        <p className="mt-4 text-body-sm font-semibold text-rose-700">
          AWBI Emergency: 1962 · Your vet&apos;s number should be saved in your phone at all times.
        </p>
      </div>

      {/* 3 main sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: <Heart size={24} className="text-rose-500" />, title: 'Common Conditions', desc: 'Tick fever, mange, hip dysplasia, dental disease — symptoms, treatment, and prevention.', href: '#conditions', bg: 'bg-rose-50 border-rose-200' },
          { icon: <Shield size={24} className="text-green-600" />, title: 'Vaccination Schedule', desc: 'Core and non-core vaccines for Indian dogs — puppy schedule, adult boosters, and senior considerations.', href: '/learn/health/vaccination', bg: 'bg-green-50 border-green-200' },
          { icon: <CheckCircle size={24} className="text-primary-600" />, title: 'Preventive Care', desc: 'Daily, weekly and monthly health checks to catch problems early before they become expensive emergencies.', href: '#checklist', bg: 'bg-primary-50 border-primary-200' },
        ].map((card) => (
          <Link key={card.title} href={card.href} className={`group rounded-2xl border p-6 ${card.bg} hover:shadow-md transition-all`}>
            <div className="mb-3">{card.icon}</div>
            <h3 className="font-display font-semibold text-neutral-900 text-heading-md mb-2 group-hover:text-primary-600 transition-colors">{card.title}</h3>
            <p className="text-body-sm text-neutral-600 leading-relaxed mb-3">{card.desc}</p>
            <span className="inline-flex items-center gap-1 text-primary-600 text-body-sm font-medium group-hover:gap-2 transition-all">
              View guide <ArrowRight size={13} />
            </span>
          </Link>
        ))}
      </div>

      {/* Health conditions by severity */}
      <section id="conditions">
        <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-8">Common Health Conditions</h2>
        {([['severe', severe], ['moderate', moderate], ['mild', mild]] as const).map(([sev, items]) => {
          if (!items.length) return null;
          const cfg = SEVERITY_CONFIG[sev];
          return (
            <div key={sev} className="mb-8">
              <h3 className="font-display font-semibold text-neutral-700 text-heading-sm mb-3">{cfg.label}</h3>
              <div className="space-y-2">
                {items.map((condition) => (
                  <Link key={condition.slug} href={`/learn/health/${condition.slug}`}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${cfg.bg} hover:shadow-sm transition-all group`}
                  >
                    <span className={`text-label-sm font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${cfg.badge}`}>
                      {sev}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 text-body-md group-hover:text-primary-600 transition-colors">{condition.name}</p>
                      {condition.symptoms.length > 0 && (
                        <p className="text-label-sm text-neutral-500 mt-0.5 truncate">{condition.symptoms.slice(0, 2).join(' · ')}</p>
                      )}
                    </div>
                    <ArrowRight size={15} className="text-neutral-300 group-hover:text-primary-400 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Health checklist */}
      <section id="checklist">
        <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-6">Preventive Care Checklist</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-display font-semibold text-neutral-700 text-heading-sm mb-3">Daily</h3>
            <CheckList items={DAILY_CHECKS} variant="success" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-neutral-700 text-heading-sm mb-3">Weekly</h3>
            <CheckList items={WEEKLY_CHECKS} variant="success" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-neutral-700 text-heading-sm mb-3">Monthly</h3>
            <CheckList items={MONTHLY_CHECKS} variant="warning" />
          </div>
        </div>
      </section>
    </div>
  );
}
