
import { useEffect } from 'react';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const SitemapGenerator = () => {
  useEffect(() => {
    const generateSitemap = () => {
      const baseUrl = window.location.origin;
      
      const staticPages: SitemapUrl[] = [
        {
          loc: `${baseUrl}/`,
          changefreq: 'daily',
          priority: 1.0,
          lastmod: new Date().toISOString().split('T')[0]
        },
        {
          loc: `${baseUrl}/products`,
          changefreq: 'daily',
          priority: 0.9
        },
        {
          loc: `${baseUrl}/real-estate`,
          changefreq: 'daily',
          priority: 0.9
        },
        {
          loc: `${baseUrl}/services`,
          changefreq: 'daily',
          priority: 0.9
        },
        {
          loc: `${baseUrl}/rides`,
          changefreq: 'daily',
          priority: 0.9
        },
        {
          loc: `${baseUrl}/jobs`,
          changefreq: 'daily',
          priority: 0.9
        },
        {
          loc: `${baseUrl}/search`,
          changefreq: 'weekly',
          priority: 0.7
        }
      ];

      // Add city-specific pages
      const cities = ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret'];
      cities.forEach(city => {
        staticPages.push({
          loc: `${baseUrl}/city/${city}`,
          changefreq: 'weekly',
          priority: 0.8
        });
      });

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

      // Store sitemap in sessionStorage for development
      sessionStorage.setItem('sitemap', sitemap);
      console.log('Sitemap generated:', sitemap);
    };

    generateSitemap();
  }, []);

  return null;
};

export default SitemapGenerator;
