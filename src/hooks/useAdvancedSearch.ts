
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from './useProducts';

interface SearchFilters {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  brand: string;
  location: string;
  condition: string;
  rating: number;
  inStock: boolean;
  sortBy: 'price' | 'rating' | 'created_at' | 'name';
  sortOrder: 'asc' | 'desc';
}

export const useAdvancedSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    minPrice: 0,
    maxPrice: 1000000,
    brand: '',
    location: '',
    condition: '',
    rating: 0,
    inStock: true,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  const searchQuery = useQuery({
    queryKey: ['advanced-search', filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('in_stock', filters.inStock);

      // Text search across multiple fields
      if (filters.query) {
        query = query.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%,brand.ilike.%${filters.query}%,tags.cs.{${filters.query}}`);
      }

      // Category filter
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      // Price range
      if (filters.minPrice > 0) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice < 1000000) {
        query = query.lte('price', filters.maxPrice);
      }

      // Brand filter
      if (filters.brand) {
        query = query.eq('brand', filters.brand);
      }

      // Location filter
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      // Condition filter
      if (filters.condition) {
        query = query.eq('condition', filters.condition);
      }

      // Rating filter
      if (filters.rating > 0) {
        query = query.gte('rating', filters.rating);
      }

      // Sorting
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
    enabled: true
  });

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      category: '',
      minPrice: 0,
      maxPrice: 1000000,
      brand: '',
      location: '',
      condition: '',
      rating: 0,
      inStock: true,
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
  };

  const categories = useMemo(() => {
    return Array.from(new Set(searchQuery.data?.map(p => p.category) || []));
  }, [searchQuery.data]);

  const brands = useMemo(() => {
    return Array.from(new Set(searchQuery.data?.map(p => p.brand).filter(Boolean) || []));
  }, [searchQuery.data]);

  return {
    filters,
    updateFilter,
    resetFilters,
    results: searchQuery.data || [],
    isLoading: searchQuery.isLoading,
    categories,
    brands,
    totalResults: searchQuery.data?.length || 0
  };
};
