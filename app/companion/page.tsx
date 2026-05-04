import type { Metadata } from 'next';
import Link from 'next/link';
import { Syringe, TrendingUp, ClipboardList, UtensilsCrossed, ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: 'Care Companion — PetopiaCare' };

const TOOLS = [
  {
    icon: <Syringe size={28} className="text-primary-600" />,
    title: 'Vaccination Tracker',
    desc: 'Track your dog\'s entire vaccination history. Know what\'s due, what\'s overdue, and what\'s coming up — with a full timeline from puppy to adult.',
    href: '/companion/vaccination-tracker',
    cta: 'Track vaccinations',
    bg: 'bg-primary-50 border-primary-200',
  },
  {
    icon: <TrendingUp size={28} className="text-green-600" />,
    title: 'Growth Tracker',
    desc: 'Log your dog\'s weight over time and see it charted against breed averages. Get alerts if growth is too fast, too slow, or on track.',
    href: '/companion/growth-tracker',
    cta: 'Track growth',
    bg: 'bg-green-50 border-green-200',
  },
  {
    icon: <ClipboardList size={28} className="text-blue-600" />,
    title: 'Health Checklist',
    desc: 'Daily, weekly, and monthly health checks that take 2 minutes. Build healthy habits and catch problems early before they become expensive.',
    href: '/companion/health-checklist',
    cta: 'Start checking',
    bg: 'bg-blue-50 border-blue-200',
  },
  {
    icon: <UtensilsCrossed size={28} className="text-amber-600" />,
    title: 'Feeding Calculator',
    desc: 'Calculate exactly how much to feed your dog based on weight, age, activity level, and life stage. Get a complete meal plan with portion sizes.',
    href: '/companion/feeding-guide',
    cta: 'Calculate portions',
    bg: 'bg-amber-50 border-amber-200',
  },
];

export default function CompanionPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 md:p-14 text-white">
        <h1 className="font-display font-bold text-display-md mb-4">Care Companion Tools</h1>
        <p className="text-body-lg text-primary-100 max-w-xl leading-relaxed mb-6">
          Four free tools to help you raise a healthier dog — vaccination tracking, growth monitoring,
          daily health checks, and feeding calculators, all in one place.
        </p>
        <p className="text-body-sm text-primary-200 flex items-center gap-2">
          🔒 All data stays on your device. No account required.
        </p>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href}
            className={`group flex flex-col p-6 rounded-2xl border ${tool.bg} hover:shadow-lg transition-all`}
          >
            <div className="mb-4">{tool.icon}</div>
            <h2 className="font-display font-bold text-neutral-900 text-heading-lg mb-2 group-hover:text-primary-600 transition-colors">
              {tool.title}
            </h2>
            <p className="text-body-sm text-neutral-600 leading-relaxed flex-1 mb-4">{tool.desc}</p>
            <span className="inline-flex items-center gap-1 text-primary-600 font-medium text-body-sm group-hover:gap-2 transition-all">
              {tool.cta} <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
