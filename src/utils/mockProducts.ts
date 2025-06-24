
// This file has been cleared for deployment preparation
// All mock data will be replaced with real API calls

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  vendor: string;
  category: string;
  inStock: boolean;
  description?: string;
  brand?: string;
  year?: number;
  make?: string;
  model?: string;
}

// Empty array - to be replaced with API calls
export const mockProducts: Product[] = [];

export function generateMockProducts(count: number = 0): Product[] {
  // Return empty array for deployment
  console.warn('Mock products disabled for deployment. Please implement real API integration.');
  return [];
}
