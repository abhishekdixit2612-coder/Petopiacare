import { MetadataRoute } from 'next';
import { MOCK_BLOGS } from './api/blog/route';
import { MOCK_DIGITAL_PRODUCTS } from './api/digital-products/route';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://petopiacare.in';

  // Static routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/products',
    '/blog',
    '/digital-products'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Mock dynamics - you would normally await an aggressive DB query here
  const blogRoutes = MOCK_BLOGS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.created_at).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const digitalProductRoutes = MOCK_DIGITAL_PRODUCTS.map((prod) => ({
    url: `${baseUrl}/digital-products/${prod.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...blogRoutes, ...digitalProductRoutes];
}
