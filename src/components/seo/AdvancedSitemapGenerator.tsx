
import { useEffect } from 'react';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const AdvancedSitemapGenerator = () => {
  useEffect(() => {
    const generateAdvancedSitemap = () => {
      const baseUrl = window.location.origin;
      
      // Main sitemap
      const staticPages: SitemapUrl[] = [
        {
          loc: `${baseUrl}/`,
          changefreq: 'daily',
          priority: 1.0,
          lastmod: new Date().toISOString().split('T')[0]
        },
        {
          loc: `${baseUrl}/products`,
          changefreq: 'hourly',
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
        }
      ];

      // City-specific pages
      const cities = ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika', 'machakos'];
      cities.forEach(city => {
        staticPages.push({
          loc: `${baseUrl}/city/${city}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: new Date().toISOString().split('T')[0]
        });
      });

      // Category pages
      const categories = ['electronics', 'fashion', 'home-garden', 'automotive', 'books', 'sports'];
      categories.forEach(category => {
        staticPages.push({
          loc: `${baseUrl}/products/category/${category}`,
          changefreq: 'daily',
          priority: 0.7
        });
      });

      // Property type pages
      const propertyTypes = ['houses', 'apartments', 'land', 'commercial'];
      propertyTypes.forEach(type => {
        staticPages.push({
          loc: `${baseUrl}/real-estate/${type}`,
          changefreq: 'daily',
          priority: 0.7
        });
      });

      // Service type pages
      const serviceTypes = ['plumbing', 'electrical', 'cleaning', 'tutoring', 'photography'];
      serviceTypes.forEach(service => {
        staticPages.push({
          loc: `${baseUrl}/services/${service}`,
          changefreq: 'weekly',
          priority: 0.6
        });
      });

      const mainSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

      // Sitemap index
      const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-products.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-properties.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-services.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

      // Store in sessionStorage for development
      sessionStorage.setItem('sitemap', mainSitemap);
      sessionStorage.setItem('sitemap-index', sitemapIndex);
      console.log('Advanced sitemaps generated');
    };

    generateAdvancedSitemap();
  }, []);

  return null;
};

export default AdvancedSitemapGenerator;
