import Link from 'next/link';
import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import type { RelatedContentProps, ContentType } from '@/types/components';

const TYPE_CONFIG: Record<ContentType, { label: string; badge: string; path: string }> = {
  breed:     { label: 'Breed',     badge: 'bg-purple-100 text-purple-700', path: '/learn/breeds' },
  health:    { label: 'Health',    badge: 'bg-error-100 text-error-700',   path: '/learn/health' },
  nutrition: { label: 'Nutrition', badge: 'bg-success-100 text-success-700', path: '/learn/nutrition' },
  behavior:  { label: 'Behavior',  badge: 'bg-blue-100 text-blue-700',     path: '/learn/behavior' },
};

function RelatedContent({
  items,
  maxItems = 4,
  title = 'Related Content',
  layout = 'grid',
}: RelatedContentProps) {
  const visible = items.slice(0, maxItems);
  const hasMore = items.length > maxItems;

  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-body-sm text-neutral-400 italic border border-dashed border-neutral-200 rounded-xl">
        No related content available.
      </div>
    );
  }

  return (
    <section aria-label={title}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-neutral-900 text-heading-md">{title}</h2>
        {hasMore && (
          <Link href="/learn" className="text-primary-600 text-body-sm font-medium hover:underline inline-flex items-center gap-1">
            View all <ArrowRight size={13} />
          </Link>
        )}
      </div>

      {layout === 'list' ? (
        <ul className="space-y-2" role="list">
          {visible.map((item) => {
            const config = TYPE_CONFIG[item.type];
            return (
              <li key={item.slug}>
                <Link
                  href={`${config.path}/${item.slug}`}
                  className="flex items-center gap-3 p-3 bg-white border border-neutral-100 rounded-xl hover:shadow-sm hover:border-primary-200 transition-all group"
                >
                  {item.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt={item.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-neutral-100" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-medium text-neutral-900 truncate group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </p>
                    {item.excerpt && (
                      <p className="text-label-sm text-neutral-500 truncate mt-0.5">{item.excerpt}</p>
                    )}
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${config.badge}`}>
                    {config.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" role="list">
          {visible.map((item) => {
            const config = TYPE_CONFIG[item.type];
            return (
              <Link
                key={item.slug}
                href={`${config.path}/${item.slug}`}
                role="listitem"
                className="group flex flex-col bg-white border border-neutral-100 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="h-28 bg-neutral-50 overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl bg-neutral-100">📖</div>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit mb-2 ${config.badge}`}>
                    {config.label}
                  </span>
                  <p className="text-body-sm font-medium text-neutral-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                    {item.title}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default memo(RelatedContent);
