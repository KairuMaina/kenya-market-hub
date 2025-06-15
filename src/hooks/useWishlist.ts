import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  products?: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    vendor: string;
  };
}

export const useWishlist = () => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('wishlist')
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
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as WishlistItem[];
    }
  });
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if item exists in wishlist
      const { data: existing } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (existing) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('id', existing.id);
        
        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlist')
          .insert({
            user_id: user.id,
            product_id: productId
          });
        
        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({ 
        title: result.action === 'added' ? 'Added to wishlist!' : 'Removed from wishlist!' 
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating wishlist',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useIsInWishlist = (productId: string) => {
  return useQuery({
    queryKey: ['wishlist-item', productId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();
      
      return !!data;
    },
    // Keep `enabled` option if it exists, otherwise it's fine.
    // Tanstack Query v5 enables queries by default if `enabled` isn't specified
  });
};
