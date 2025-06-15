
// Centralized image configuration for better maintenance
export const IMAGE_CONFIG = {
  // Hero images for different sections
  shop: {
    hero: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
    ]
  },
  
  // Fallback/placeholder images
  fallbacks: {
    hero: '/placeholder.svg',
    product: '/placeholder.svg',
    avatar: '/placeholder.svg'
  },
  
  // Image loading configuration
  settings: {
    retryAttempts: 3,
    loadTimeout: 10000, // 10 seconds
    lazyLoadThreshold: 0.1
  }
};

// Helper function to get image with fallback
export const getImageWithFallback = (
  primaryUrl: string, 
  fallbackUrl: string = IMAGE_CONFIG.fallbacks.product
): string => {
  return primaryUrl || fallbackUrl;
};

// Helper function to preload images
export const preloadImages = (urls: string[]): Promise<void[]> => {
  return Promise.all(
    urls.map(url => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    })
  );
};
