
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ForumCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  post_count: number;
  member_count: number;
  created_at: string;
}

export const useChatForums = () => {
  return useQuery({
    queryKey: ['forum-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching forum categories:', error);
        throw error;
      }

      return data as ForumCategory[];
    }
  });
};
