import type { Metadata } from 'next';
import { Brain } from 'lucide-react';
import { getAllBehavioralTopics } from '@/lib/learn-queries';
import BreadcrumbNav from '@/components/learn/BreadcrumbNav';
import BehaviorFilters from '@/components/learn/BehaviorFilters';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Dog Behaviour & Training Guide — India',
  description: 'Evidence-based solutions for common dog behaviour problems — barking, leash pulling, separation anxiety, aggression — using positive reinforcement methods.',
};

const PHILOSOPHY = [
  { title: 'Positive Reinforcement Only', desc: 'Reward what you want. Ignore or redirect what you don\'t. Punishment-based methods increase fear and aggression.' },
  { title: 'Consistency Over Intensity', desc: 'Five 3-minute sessions daily beat one 30-minute session weekly. Every family member must follow the same rules.' },
  { title: 'Address Root Cause', desc: 'Every behaviour has a cause — boredom, fear, pain, or inadequate exercise. Treating symptoms without the root cause always fails.' },
  { title: 'Patience is the Method', desc: 'Behaviour change takes weeks to months, not days. Set realistic expectations and celebrate small wins.' },
];

export default async function BehaviorTrainingPage() {
  const topics = await getAllBehavioralTopics();

  return (
    <div className="space-y-12">
      <BreadcrumbNav items={[{ label: 'Learn', href: '/learn' }, { label: 'Behaviour & Training' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 md:p-12 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Brain size={28} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-display-md mb-3">Behaviour & Training Guide</h1>
            <p className="text-body-lg text-amber-100 max-w-xl leading-relaxed">
              Evidence-based solutions for the most common dog behaviour problems in Indian homes.
              Every technique here uses positive reinforcement — no punishment, no shortcuts.
            </p>
          </div>
        </div>
      </div>

      {/* Training philosophy */}
      <section>
        <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-6">Training Philosophy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PHILOSOPHY.map((item) => (
            <div key={item.title} className="p-5 bg-amber-50 border border-amber-100 rounded-2xl">
              <h3 className="font-display font-semibold text-neutral-900 text-heading-sm mb-2">{item.title}</h3>
              <p className="text-body-sm text-neutral-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Topics with filters */}
      <section>
        <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-6">Browse All Topics</h2>
        <BehaviorFilters topics={topics} />
      </section>

      {/* When to get professional help */}
      <section className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
        <h2 className="font-display font-bold text-heading-lg text-neutral-900 mb-3">When to Get Professional Help</h2>
        <p className="text-body-md text-neutral-700 mb-4 leading-relaxed">
          Self-guided training works for most common issues. Seek a certified professional behaviourist (CPDT-KA or IAABC member) if:
        </p>
        <ul className="space-y-1.5">
          {[
            'Your dog has bitten someone — even once',
            'Aggression is escalating despite consistent training',
            'Severe separation anxiety is causing self-injury',
            'You\'ve followed guides for 4+ weeks with no improvement',
            'Your dog appears fearful of everything, not just one trigger',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-body-sm text-rose-800">
              <span className="text-rose-500 flex-shrink-0 mt-0.5">⚠</span> {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
