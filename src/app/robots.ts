import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        '/private/',
        '/admin/',
      ],
    },
    sitemap: 'https://queenclaw.com/sitemap.xml',
  };
}
