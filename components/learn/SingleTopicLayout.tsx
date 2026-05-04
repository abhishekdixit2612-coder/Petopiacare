'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Share2, ShoppingBag, BookOpen } from 'lucide-react';
import BreadcrumbNav from './BreadcrumbNav';
import RelatedContent from './RelatedContent';
import type { SingleTopicLayoutProps } from '@/types/components';

function TableOfContents({ toc }: { toc: NonNullable<SingleTopicLayoutProps['toc']> }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  return (
    <nav aria-label="Table of contents">
      <p className="text-label-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">On this page</p>
      <ul className="space-y-1">
        {toc.map(({ id, label, level = 1 }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block text-body-sm transition-colors py-1 border-l-2 pl-3 ${
                level === 2 ? 'pl-5 text-[13px]' : level === 3 ? 'pl-7 text-xs' : ''
              } ${
                activeId === id
                  ? 'border-primary-500 text-primary-600 font-medium'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-300'
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-body-sm text-neutral-500 hover:text-primary-600 border border-neutral-200 hover:border-primary-300 rounded-lg transition-all"
    >
      <Share2 size={13} />
      {copied ? 'Copied!' : 'Share'}
    </button>
  );
}

export default function SingleTopicLayout({
  children,
  breadcrumbs,
  toc,
  relatedContent,
  productCta,
}: SingleTopicLayoutProps) {
  return (
    <div className="flex gap-8 min-w-0">
      {/* Main content */}
      <article className="flex-1 min-w-0">
        {/* Breadcrumb + Share */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <BreadcrumbNav items={breadcrumbs} />
          <ShareButton />
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 md:p-8 lg:p-10 prose-custom">
          {children}
        </div>

        {/* Product CTA */}
        {productCta && (
          <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-6 md:p-8 text-white">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-heading-lg mb-1">{productCta.title}</h3>
                <p className="text-primary-100 text-body-sm">{productCta.description}</p>
              </div>
              <Link
                href={productCta.href}
                className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-primary-700 font-medium px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors text-body-sm"
              >
                <ShoppingBag size={15} />
                {productCta.buttonText}
              </Link>
            </div>
          </div>
        )}

        {/* Related content */}
        {relatedContent && relatedContent.length > 0 && (
          <div className="mt-8">
            <RelatedContent items={relatedContent} title="Related Articles" />
          </div>
        )}
      </article>

      {/* Right sidebar — TOC */}
      {toc && toc.length > 0 && (
        <aside className="hidden xl:block w-52 flex-shrink-0">
          <div className="sticky top-32 bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
            <TableOfContents toc={toc} />
            <div className="mt-6 pt-5 border-t border-neutral-100">
              <Link href="/learn" className="flex items-center gap-1.5 text-body-sm text-neutral-500 hover:text-primary-600 transition-colors">
                <BookOpen size={13} /> Back to Learn Hub
              </Link>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
