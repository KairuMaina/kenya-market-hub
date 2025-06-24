
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useWishlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wishlistItems, isLoading } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          products (
            id,
            name,
            price,
            original_price,
            image_url,
            category,
            vendor,
            in_stock,
            rating,
            reviews_count
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const addToWishlist = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('User must be logged in');

      const { error } = await supabase
        .from('wishlist')
        .insert([{
          user_id: user.id,
          product_id: productId
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast({
        title: 'Added to wishlist',
        description: 'Product has been added to your wishlist.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add product to wishlist.',
        variant: 'destructive'
      });
    }
  });

  const removeFromWishlist = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('User must be logged in');

      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast({
        title: 'Removed from wishlist',
        description: 'Product has been removed from your wishlist.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove product from wishlist.',
        variant: 'destructive'
      });
    }
  });

  const isInWishlist = (productId: string) => {
    return wishlistItems?.some(item => item.product_id === productId) || false;
  };

  const clearWishlist = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User must be logged in');

      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast({
        title: 'Wishlist cleared',
        description: 'All items have been removed from your wishlist.'
      });
    }
  });

  return {
    wishlistItems: wishlistItems || [],
    isLoading,
    addToWishlist: addToWishlist.mutate,
    removeFromWishlist: removeFromWishlist.mutate,
    isInWishlist,
    clearWishlist: clearWishlist.mutate,
    isAdding: addToWishlist.isPending,
    isRemoving: removeFromWishlist.isPending,
    isClearing: clearWishlist.isPending
  };
};
