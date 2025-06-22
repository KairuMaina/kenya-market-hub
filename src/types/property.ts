
export interface Property {
  id: string;
  owner_id: string;
  agent_id?: string;
  title: string;
  description?: string;
  property_type: string;
  listing_type: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  location_address: string;
  location_coordinates?: any;
  county?: string;
  city?: string;
  amenities?: string[];
  features?: string[];
  images?: string[];
  virtual_tour_url?: string;
  contact_phone?: string;
  contact_email?: string;
  status: string;
  is_featured: boolean;
  views_count: number;
  available_from?: string;
  created_at: string;
  updated_at: string;
  // Legacy compatibility
  location?: string;
  image_url?: string;
  name?: string;
}
