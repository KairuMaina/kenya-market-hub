
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  brand?: string;
  condition?: string;
  location?: string;
  make?: string;
  model?: string;
  year?: number;
  created_at: string;
  vendor_id?: string;
  in_stock: boolean;
  stock_quantity?: number;
  rating: number;
  reviews_count: number;
}

interface UseProductsParams {
  vendorId?: string;
  category?: string;
  searchQuery?: string;
  limit?: number;
}

export const useProducts = (params: UseProductsParams = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      let query = supabase.from('products').select('*');
      
      if (params.vendorId) {
        query = query.eq('vendor_id', params.vendorId);
      }
      
      if (params.category) {
        query = query.eq('category', params.category);
      }
      
      if (params.searchQuery) {
        query = query.ilike('name', `%${params.searchQuery}%`);
      }
      
      if (params.limit) {
        query = query.limit(params.limit);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to include required fields with defaults
      return (data || []).map(item => ({
        ...item,
        rating: 4, // Default rating
        reviews_count: 0 // Default reviews count
      })) as Product[];
    }
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'rating' | 'reviews_count'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...product,
          vendor_id: product.vendor_id || user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Product created',
        description: 'Your product has been added successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating product',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};
