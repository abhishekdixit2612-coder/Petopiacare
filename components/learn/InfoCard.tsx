import Link from 'next/link';
import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import type { InfoCardProps } from '@/types/components';

function InfoCard({ icon, title, description, cta, variant = 'default' }: InfoCardProps) {
  const wrapperClass = {
    default:   'bg-white border border-neutral-100 shadow-sm hover:shadow-md',
    highlight: 'bg-primary-50 border border-primary-200 hover:shadow-md',
    minimal:   'bg-transparent border border-neutral-200 hover:border-primary-300',
  }[variant];

  return (
    <div className={`rounded-xl p-5 transition-all ${wrapperClass}`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-neutral-900 text-heading-sm mb-1">{title}</h3>
          <p className="text-body-sm text-neutral-600 leading-relaxed">{description}</p>
          {cta && (
            <Link
              href={cta.href}
              className="inline-flex items-center gap-1 mt-3 text-primary-600 font-medium text-body-sm hover:gap-2 transition-all"
            >
              {cta.text} <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(InfoCard);
