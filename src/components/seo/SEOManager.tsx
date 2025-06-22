
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOManagerProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'business.business';
  structuredData?: any;
  canonical?: string;
}

const SEOManager: React.FC<SEOManagerProps> = ({
  title = 'Soko Smart - Kenya\'s Premier Marketplace',
  description = 'Discover amazing products, services, rides, and real estate in Kenya. Your one-stop marketplace for everything you need.',
  keywords = 'marketplace Kenya, online shopping Kenya, property Kenya, services Kenya, rides Kenya, jobs Kenya',
  image = '/lovable-uploads/563ee6fb-f94f-43f3-a4f3-a61873a1b491.png',
  url,
  type = 'website',
  structuredData,
  canonical
}) => {
  const location = useLocation();
  const currentUrl = url || `${window.location.origin}${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updateProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('author', 'Soko Smart');
    updateMeta('robots', 'index,follow');
    updateMeta('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    updateProperty('og:title', title);
    updateProperty('og:description', description);
    updateProperty('og:image', image);
    updateProperty('og:url', currentUrl);
    updateProperty('og:type', type);
    updateProperty('og:site_name', 'Soko Smart');
    updateProperty('og:locale', 'en_KE');

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    updateMeta('twitter:site', '@SokoSmart');

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // Structured data
    const defaultStructuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Soko Smart",
      "description": description,
      "url": currentUrl,
      "logo": image,
      "sameAs": [
        "https://facebook.com/sokosmart",
        "https://twitter.com/sokosmart",
        "https://instagram.com/sokosmart"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "KE",
        "addressLocality": "Nairobi"
      },
      "areaServed": "Kenya",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    const finalStructuredData = structuredData || defaultStructuredData;

    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(finalStructuredData);

  }, [title, description, keywords, image, currentUrl, type, structuredData, canonicalUrl]);

  return null;
};

export default SEOManager;
