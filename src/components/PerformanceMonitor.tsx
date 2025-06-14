
import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navigationEntry = entry as PerformanceNavigationTiming;
          console.log('Page Load Time:', navigationEntry.loadEventEnd - navigationEntry.loadEventStart);
        }

        if (entry.entryType === 'paint') {
          console.log(`${entry.name}:`, entry.startTime);
        }

        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }

        if (entry.entryType === 'first-input') {
          console.log('FID:', (entry as any).processingStart - entry.startTime);
        }

        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          console.log('CLS:', (entry as any).value);
        }
      });
    });

    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });

    return () => observer.disconnect();
  }, []);

  return null;
};

export default PerformanceMonitor;
