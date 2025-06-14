
// Add "import React from 'react'" in addition to { useEffect } to ensure correct context
import React, { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Check if performance API is available
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      console.log('Performance Observer not supported');
      return;
    }

    try {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          try {
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
          } catch (entryError) {
            console.warn('Error processing performance entry:', entryError);
          }
        });
      });

      // Only observe supported entry types
      const supportedTypes = ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'];
      observer.observe({ entryTypes: supportedTypes });

      return () => {
        try {
          observer.disconnect();
        } catch (error) {
          console.warn('Error disconnecting performance observer:', error);
        }
      };
    } catch (error) {
      console.warn('Error setting up performance monitoring:', error);
    }
  }, []);

  return null;
};

export default PerformanceMonitor;
