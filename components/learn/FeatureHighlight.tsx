import Link from 'next/link';
import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import type { FeatureHighlightProps } from '@/types/components';

function FeatureHighlight({
  title,
  description,
  image,
  cta,
  layout = 'left',
  gradient = false,
}: FeatureHighlightProps) {
  const wrapperClass = gradient
    ? 'bg-gradient-to-br from-primary-600 to-primary-800'
    : 'bg-white border border-neutral-100';

  const textClass = gradient ? 'text-white' : 'text-neutral-900';
  const subTextClass = gradient ? 'text-primary-100' : 'text-neutral-600';

  if (layout === 'center') {
    return (
      <section className={`rounded-2xl overflow-hidden ${wrapperClass}`}>
        <div className="max-w-2xl mx-auto px-6 py-12 md:py-16 text-center flex flex-col items-center gap-6">
          {image && (
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h2 className={`font-display font-bold text-display-sm mb-3 ${textClass}`}>{title}</h2>
            <p className={`text-body-lg leading-relaxed ${subTextClass}`}>{description}</p>
          </div>
          {cta && (
            <Link
              href={cta.href}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                gradient
                  ? 'bg-white text-primary-700 hover:bg-primary-50'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              {cta.text} <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </section>
    );
  }

  const imageBlock = image ? (
    <div className="flex-shrink-0 w-full md:w-2/5 h-56 md:h-auto min-h-[240px] overflow-hidden rounded-xl bg-neutral-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
  ) : null;

  const contentBlock = (
    <div className="flex-1 flex flex-col justify-center gap-4 py-2">
      <h2 className={`font-display font-bold text-display-sm leading-tight ${textClass}`}>{title}</h2>
      <p className={`text-body-lg leading-relaxed ${subTextClass}`}>{description}</p>
      {cta && (
        <Link
          href={cta.href}
          className={`self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-body-md transition-all ${
            gradient
              ? 'bg-white text-primary-700 hover:bg-primary-50'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          {cta.text} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );

  return (
    <section className={`rounded-2xl overflow-hidden ${wrapperClass}`}>
      <div className={`flex flex-col gap-6 md:flex-row md:gap-10 p-6 md:p-10 ${layout === 'right' ? 'md:flex-row-reverse' : ''}`}>
        {imageBlock}
        {contentBlock}
      </div>
    </section>
  );
}

export default memo(FeatureHighlight);
