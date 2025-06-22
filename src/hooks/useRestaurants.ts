
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('verification_status', 'approved')
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    }
  });
};

export const useFoodCategories = () => {
  return useQuery({
    queryKey: ['food-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null);
      
      if (error) throw error;
      
      // Get unique categories and count products in each
      const categories = data?.reduce((acc: any[], item) => {
        const existing = acc.find(cat => cat.name === item.category);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ 
            id: item.category.toLowerCase().replace(/\s+/g, ''),
            name: item.category, 
            count: 1 
          });
        }
        return acc;
      }, []) || [];
      
      return [{ id: 'all', name: 'All Categories', count: data?.length || 0 }, ...categories];
    }
  });
};
