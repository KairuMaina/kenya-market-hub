
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/product';

export interface SearchFilters {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  location?: string;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating_desc' | 'name_asc' | 'newest';
  rating?: number;
  sortOrder?: 'asc' | 'desc';
}

export const useAdvancedSearch = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ['advanced-search', filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*');

      // Apply search query
      if (filters.query) {
        query = query.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      // Apply category filter
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      // Apply brand filter
      if (filters.brand) {
        query = query.eq('brand', filters.brand);
      }

      // Apply price range
      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      // Apply condition filter
      if (filters.condition) {
        query = query.eq('condition', filters.condition);
      }

      // Apply location filter
      if (filters.location) {
        query = query.eq('location', filters.location);
      }

      // Apply stock filter
      if (filters.inStock !== undefined) {
        query = query.eq('in_stock', filters.inStock);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'rating_desc':
          query = query.order('price', { ascending: false }); // Fallback since rating doesn't exist
          break;
        case 'name_asc':
          query = query.order('name', { ascending: true });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match Product interface with fallback values
      const transformedData = data?.map(product => ({
        ...product,
        rating: 0, // Default rating since it doesn't exist in DB
        reviews_count: 0 // Default reviews_count since it doesn't exist in DB
      })) || [];
      
      return transformedData as Product[];
    },
    enabled: true
  });
};

export const useSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];

      const { data, error } = await supabase
        .from('products')
        .select('name, category, brand')
        .or(`name.ilike.%${query}%,category.ilike.%${query}%,brand.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;

      // Extract unique suggestions
      const suggestions = new Set<string>();
      data?.forEach(product => {
        if (product.name?.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(product.name);
        }
        if (product.category?.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(product.category);
        }
        if (product.brand?.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(product.brand);
        }
      });

      return Array.from(suggestions).slice(0, 5);
    },
    enabled: query.length >= 2
  });
};

export const usePopularSearches = () => {
  return useQuery({
    queryKey: ['popular-searches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category, brand')
        .not('category', 'is', null)
        .not('brand', 'is', null);

      if (error) throw error;

      // Count occurrences and return most popular
      const categoryCount: Record<string, number> = {};
      const brandCount: Record<string, number> = {};

      data?.forEach(product => {
        if (product.category) {
          categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
        }
        if (product.brand) {
          brandCount[product.brand] = (brandCount[product.brand] || 0) + 1;
        }
      });

      const popularCategories = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([category]) => category);

      const popularBrands = Object.entries(brandCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([brand]) => brand);

      return { popularCategories, popularBrands };
    }
  });
};
