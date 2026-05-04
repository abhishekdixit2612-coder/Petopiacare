import type { Metadata } from 'next';
import Link from 'next/link';
import { Syringe, TrendingUp, ClipboardList, UtensilsCrossed } from 'lucide-react';

export const metadata: Metadata = {
  title: { default: 'Care Companion | PetopiaCare', template: '%s | Care Companion' },
  description: 'Track vaccinations, growth, daily health checks and feeding — all in one place for your dog.',
};

const NAV = [
  { label: 'Vaccinations', href: '/companion/vaccination-tracker', icon: <Syringe size={15} /> },
  { label: 'Growth',       href: '/companion/growth-tracker',       icon: <TrendingUp size={15} /> },
  { label: 'Health Check', href: '/companion/health-checklist',     icon: <ClipboardList size={15} /> },
  { label: 'Feeding',      href: '/companion/feeding-guide',        icon: <UtensilsCrossed size={15} /> },
];

export default function CompanionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sub-header */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-1 overflow-x-auto scrollbar-none">
          <Link href="/companion" className="text-label font-bold text-primary-600 whitespace-nowrap mr-3 flex-shrink-0">
            🐾 Companion
          </Link>
          <div className="h-4 w-px bg-neutral-200 mr-3 flex-shrink-0" />
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-sm text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-colors whitespace-nowrap flex-shrink-0"
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
