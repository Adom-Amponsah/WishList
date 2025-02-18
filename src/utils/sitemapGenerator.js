import { eventTypes } from '../components/EventSelection';

export function generateSitemap(baseUrl) {
  const pages = [
    {
      url: '/',
      changefreq: 'daily',
      priority: 1.0
    },
    {
      url: '/events',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/my-wishlists',
      changefreq: 'daily',
      priority: 0.8
    }
  ];

  // Add event type pages
  eventTypes.forEach(event => {
    const urlSlug = event.urlSlug || event.name.toLowerCase().replace(/\s+/g, '-');
    pages.push({
      url: `/create/${urlSlug}`,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  `).join('')}
</urlset>`;

  return xml;
} 