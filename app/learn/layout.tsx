import type { Metadata } from 'next';
import Link from 'next/link';
import SidebarNav from '@/components/learn/SidebarNav';
import { BookOpen, Heart, Utensils, Brain, Home, Dog } from 'lucide-react';

export const metadata: Metadata = {
  title: { default: 'Learn Hub | PetopiaCare', template: '%s | PetopiaCare Learn' },
  description: 'Expert dog care guides covering breeds, health, nutrition, life stages, and behaviour — built for Indian dog parents.',
};

const NAV_ITEMS = [
  { label: 'Learn Hub Home', href: '/learn', icon: <Home size={15} /> },
  {
    label: 'Dog Breeds',
    href: '/learn/breeds',
    icon: <Dog size={15} />,
    children: [
      { label: 'All Breeds',        href: '/learn/breeds' },
      { label: 'Small Breeds',      href: '/learn/breeds?size=small' },
      { label: 'Medium Breeds',     href: '/learn/breeds?size=medium' },
      { label: 'Large Breeds',      href: '/learn/breeds?size=large' },
      { label: 'Indian Pariah Dog', href: '/learn/breeds/indian-pariah-dog' },
    ],
  },
  {
    label: 'Life Stages',
    href: '/learn/life-stages',
    icon: <BookOpen size={15} />,
    children: [
      { label: 'All Stages',  href: '/learn/life-stages' },
      { label: 'Puppy',       href: '/learn/life-stages/puppy-socialisation' },
      { label: 'Adolescent',  href: '/learn/life-stages/adolescent' },
      { label: 'Adult',       href: '/learn/life-stages/adult' },
      { label: 'Senior',      href: '/learn/life-stages/senior-small' },
    ],
  },
  {
    label: 'Health',
    href: '/learn/health',
    icon: <Heart size={15} />,
    children: [
      { label: 'All Conditions',    href: '/learn/health' },
      { label: 'Tick Fever',        href: '/learn/health/tick-fever-ehrlichiosis' },
      { label: 'Heat Stroke',       href: '/learn/health/heat-stroke' },
      { label: 'Skin Conditions',   href: '/learn/health/skin-allergies-atopy' },
      { label: 'Emergency Signs',   href: '/learn/health#emergency' },
    ],
  },
  {
    label: 'Nutrition',
    href: '/learn/nutrition',
    icon: <Utensils size={15} />,
    children: [
      { label: 'All Guides',         href: '/learn/nutrition' },
      { label: 'Homemade Food',      href: '/learn/nutrition/homemade-indian-dog-food' },
      { label: 'Puppy Feeding',      href: '/learn/nutrition/puppy-feeding-schedule' },
      { label: 'Foods to Avoid',     href: '/learn/nutrition/foods-to-avoid-india' },
      { label: 'Supplements',        href: '/learn/nutrition/supplements-guide' },
    ],
  },
  {
    label: 'Behaviour',
    href: '/learn/behavior',
    icon: <Brain size={15} />,
    children: [
      { label: 'All Topics',        href: '/learn/behavior' },
      { label: 'Potty Training',    href: '/learn/behavior/potty-training' },
      { label: 'Leash Pulling',     href: '/learn/behavior/leash-pulling' },
      { label: 'Separation Anxiety',href: '/learn/behavior/separation-anxiety' },
      { label: 'Basic Commands',    href: '/learn/behavior/basic-obedience-commands' },
    ],
  },
];

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Learn Hub sub-header */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-6 overflow-x-auto scrollbar-none">
          <Link href="/learn" className="text-label font-semibold text-primary-600 whitespace-nowrap flex items-center gap-1.5 flex-shrink-0">
            <BookOpen size={14} /> Learn Hub
          </Link>
          <div className="h-4 w-px bg-neutral-200 flex-shrink-0" />
          {NAV_ITEMS.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-body-sm text-neutral-600 hover:text-primary-600 transition-colors whitespace-nowrap flex-shrink-0"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-32 bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
              <SidebarNav items={NAV_ITEMS} searchable title="Topics" />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Mobile nav */}
            <div className="lg:hidden mb-6">
              <SidebarNav items={NAV_ITEMS} searchable title="Topics" />
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
