'use client';

import Link from 'next/link';
import { memo, useState } from 'react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import type { BreadcrumbNavProps } from '@/types/components';

function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  const visibleItems = !expanded && items.length > 3
    ? [items[0], null, ...items.slice(-2)]
    : items;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1 text-body-sm">
        {visibleItems.map((item, i) => {
          if (item === null) {
            return (
              <li key="ellipsis" className="flex items-center gap-1">
                <ChevronRight size={13} className="text-neutral-300" aria-hidden />
                <button
                  onClick={() => setExpanded(true)}
                  className="p-0.5 text-neutral-400 hover:text-primary-600 transition-colors rounded"
                  aria-label="Show full path"
                >
                  <MoreHorizontal size={15} />
                </button>
              </li>
            );
          }

          const isLast = i === visibleItems.length - 1 || (item === null ? false : false);
          const actualIsLast = item === items[items.length - 1];

          return (
            <li key={item.href ?? item.label} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={13} className="text-neutral-300" aria-hidden />}
              {item.href && !actualIsLast ? (
                <Link
                  href={item.href}
                  className="text-neutral-500 hover:text-primary-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={actualIsLast ? 'font-medium text-neutral-900' : 'text-neutral-500'}
                  aria-current={actualIsLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default memo(BreadcrumbNav);
