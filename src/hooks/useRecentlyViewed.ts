
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useRecentlyViewed = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: recentlyViewed, isLoading } = useQuery({
    queryKey: ['recently-viewed', user?.id],
    queryFn: async () => {
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
            category,
            vendor
          )
        `)
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const addToRecentlyViewed = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) return;

      const { error } = await supabase.rpc('upsert_recently_viewed', {
        p_user_id: user.id,
        p_product_id: productId
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recently-viewed', user?.id] });
    }
  });

  const clearRecentlyViewed = useMutation({
    mutationFn: async () => {
      if (!user) return;

      const { error } = await supabase
        .from('recently_viewed')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recently-viewed', user?.id] });
    }
  });

  return {
    recentlyViewed: recentlyViewed || [],
    isLoading,
    addToRecentlyViewed: addToRecentlyViewed.mutate,
    clearRecentlyViewed: clearRecentlyViewed.mutate,
    isAdding: addToRecentlyViewed.isPending,
    isClearing: clearRecentlyViewed.isPending
  };
};
