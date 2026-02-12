import { MetadataRoute } from 'next';

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'ar', 'ru'];
const baseUrl = 'https://queenclaw.com';

// Define all routes
const routes = [
  '',
  '/about',
  '/explore',
  '/marketplace',
  '/forum',
  '/dashboard',
  '/bots',
  '/feed',
  '/install',
  '/privacy',
  '/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for each locale and route combination
  for (const locale of locales) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      });
    }
  }

  return sitemapEntries;
}
