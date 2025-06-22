
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  category: string;
  brand?: string;
  vendor?: string;
  vendor_id?: string;
  image_url?: string;
  make?: string;
  model?: string;
  year?: number;
  rating: number;
  reviews_count: number;
  in_stock: boolean;
  stock_quantity: number;
  tags?: string[];
  condition?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

// Legacy Property interface for compatibility
export interface Property {
  id: string;
  name: string;
  location: string;
  image_url: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  property_type?: string;
  listing_type?: string;
  title?: string;
  description?: string;
  location_address?: string;
  status?: string;
  is_featured?: boolean;
  views_count?: number;
  created_at?: string;
  updated_at?: string;
}
