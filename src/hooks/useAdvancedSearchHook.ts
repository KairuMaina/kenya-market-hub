
import { useState, useEffect } from 'react';
import { useAdvancedSearch, SearchFilters } from '@/hooks/useAdvancedSearch';

export const useAdvancedSearchHook = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 50000,
    condition: '',
    location: '',
    inStock: false,
    sortBy: 'newest',
    rating: 0,
    sortOrder: 'desc'
  });

  const searchQuery = useAdvancedSearch(filters);

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 50000,
      condition: '',
      location: '',
      inStock: false,
      sortBy: 'newest',
      rating: 0,
      sortOrder: 'desc'
    });
  };

  // Extract unique categories and brands from results
  const categories = [...new Set(searchQuery.data?.map(p => p.category).filter(Boolean))] || [];
  const brands = [...new Set(searchQuery.data?.map(p => p.brand).filter(Boolean))] || [];

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
