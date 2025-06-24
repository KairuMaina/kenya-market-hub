
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useIncrementPostViews = () => {
  return useMutation({
    mutationFn: async (postId: string) => {
      // Call the database function directly
      const { error } = await supabase.rpc('increment_post_views', {
        post_id: postId
      });

      if (error) throw error;
    }
  });
};
