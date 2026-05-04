// ============================================================
// SEO utilities — JSON-LD structured data generators
// ============================================================

const BASE = 'https://petopiacare.in';

export function organizationLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PetopiaCare',
    url: BASE,
    logo: `${BASE}/logos/primary.png`,
    description: 'Premium dog accessories, expert care guides, and companion tools for Indian dog parents.',
    address: { '@type': 'PostalAddress', addressCountry: 'IN' },
    sameAs: [
      'https://www.instagram.com/petopiacare',
      'https://www.facebook.com/petopiacare',
    ],
  };
}

export function websiteLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PetopiaCare',
    url: BASE,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function articleLD({
  title,
  excerpt,
  image,
  author,
  datePublished,
  dateModified,
  url,
  category,
}: {
  title: string;
  excerpt: string;
  image?: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    image: image ? [image] : [`${BASE}/logos/og-image.png`],
    author: { '@type': 'Person', name: author ?? 'PetopiaCare Experts' },
    publisher: {
      '@type': 'Organization',
      name: 'PetopiaCare',
      logo: { '@type': 'ImageObject', url: `${BASE}/logos/primary.png` },
    },
    datePublished,
    dateModified: dateModified ?? datePublished,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}${url}` },
    articleSection: category ?? 'Dog Care',
    inLanguage: 'en-IN',
  };
}

export function breadcrumbLD(items: { label: string; href?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.href ? `${BASE}${item.href}` : undefined,
    })),
  };
}

export function faqLD(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function productLD({
  name,
  description,
  image,
  price,
  currency = 'INR',
  url,
  sku,
  availability = 'InStock',
}: {
  name: string;
  description?: string;
  image?: string;
  price?: number;
  currency?: string;
  url: string;
  sku?: string;
  availability?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: image ? [image] : undefined,
    sku,
    brand: { '@type': 'Brand', name: 'PetopiaCare' },
    offers: price
      ? {
          '@type': 'Offer',
          price,
          priceCurrency: currency,
          availability: `https://schema.org/${availability}`,
          url: `${BASE}${url}`,
          seller: { '@type': 'Organization', name: 'PetopiaCare' },
        }
      : undefined,
  };
}

export function itemListLD(
  name: string,
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: `${BASE}${item.url}`,
    })),
  };
}

// Inject any JSON-LD as a <script> tag
export function JsonLd({ data }: { data: object | object[] }) {
  const scripts = Array.isArray(data) ? data : [data];
  return (
    <>
      {scripts.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
