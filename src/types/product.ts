
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  vendor_id: string;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
  location?: string;
  condition?: string;
  make?: string;
  model?: string;
  year?: number;
  brand?: string;
  rating?: number;
  reviews_count?: number;
  sales?: number;
  views?: number;
  revenue?: number;
  original_price?: number;
  discount_percentage?: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  image_url: string;
  owner_id: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  name: string; // alias for title
  city?: string;
  county?: string;
  contact_phone?: string;
  contact_email?: string;
  features?: string[];
  virtual_tour_url?: string;
  available_from?: string;
  location_coordinates?: {
    lat: number;
    lng: number;
  };
}
