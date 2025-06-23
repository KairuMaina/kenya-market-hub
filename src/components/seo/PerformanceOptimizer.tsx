
import React, { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalImages = [
        '/lovable-uploads/563ee6fb-f94f-43f3-a4f3-a61873a1b491.png'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Add critical CSS inline for above-fold content
    const addCriticalCSS = () => {
      const criticalCSS = `
        .hero-section { min-height: 60vh; }
        .nav-header { position: sticky; top: 0; z-index: 50; }
        .product-grid { display: grid; gap: 1.5rem; }
        @media (min-width: 768px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1280px) { .product-grid { grid-template-columns: repeat(4, 1fr); } }
      `;

      const style = document.createElement('style');
      style.textContent = criticalCSS;
      style.setAttribute('data-critical', 'true');
      document.head.appendChild(style);
    };

    // Add DNS prefetch for external domains
    const addDNSPrefetch = () => {
      const domains = [
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'images.unsplash.com'
      ];

      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = `//${domain}`;
        document.head.appendChild(link);
      });
    };

    // Optimize images with intersection observer
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              img.src = img.dataset.src || '';
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          });
        });

        images.forEach(img => imageObserver.observe(img));
      }
    };

    preloadCriticalResources();
    addCriticalCSS();
    addDNSPrefetch();
    optimizeImages();

    // Service Worker registration for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    }
  }, []);

  return null;
};

export default PerformanceOptimizer;
