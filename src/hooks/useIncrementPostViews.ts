
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useIncrementPostViews = () => {
  return useMutation({
    mutationFn: async (postId: string) => {
      // Direct update since increment_post_views function exists
      const { error } = await supabase
        .from('forum_posts')
        .update({ view_count: supabase.raw('view_count + 1') })
        .eq('id', postId);

      if (error) throw error;
    }
  });
};
