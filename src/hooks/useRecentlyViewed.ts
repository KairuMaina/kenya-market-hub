
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RecentlyViewedItem {
  id: string;
  user_id: string;
  product_id: string;
  viewed_at: string;
  products?: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    vendor: string;
  };
}

export const useRecentlyViewed = () => {
  return useQuery({
    queryKey: ['recently-viewed'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('recently_viewed')
        .select(`
          *,
          products (
            id,
            name,
            price,
            image_url,
            vendor
          )
        `)
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as RecentlyViewedItem[];
    }
  });
};

export const useAddToRecentlyViewed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.rpc('upsert_recently_viewed', {
        p_user_id: user.id,
        p_product_id: productId
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recently-viewed'] });
    }
  });
};
