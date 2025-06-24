
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category_id: string;
  author_id: string;
  like_count: number;
  reply_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  author_profile?: {
    full_name: string;
    avatar_url?: string;
  };
  category?: {
    name: string;
    color?: string;
  };
}

export const useForumPosts = (categoryId?: string) => {
  return useQuery({
    queryKey: ['forum-posts-new', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('forum_posts')
        .select(`
          *,
          author_profile:profiles!author_id(full_name, avatar_url),
          category:forum_categories(name)
        `)
        .order('created_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching forum posts:', error);
        throw error;
      }

      return (data || []).map(post => ({
        ...post,
        author_profile: Array.isArray(post.author_profile) 
          ? post.author_profile[0] 
          : post.author_profile || { full_name: 'Unknown User' },
        category: Array.isArray(post.category) 
          ? post.category[0] 
          : post.category || { name: 'General' }
      })) as ForumPost[];
    }
  });
};

export const useCreateForumPost = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      title, 
      content, 
      categoryId 
    }: {
      title: string;
      content: string;
      categoryId: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('forum_posts')
        .insert([{
          title,
          content,
          category_id: categoryId,
          author_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts-new'] });
      toast({
        title: 'Post Created',
        description: 'Your forum post has been created successfully.'
      });
    },
    onError: (error: any) => {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive'
      });
    }
  });
};

export const useIncrementPostViews = () => {
  return useMutation({
    mutationFn: async (postId: string) => {
      // Call the database function
      const { error } = await supabase.rpc('increment_post_views', {
        post_id: postId
      });

      if (error) throw error;
    }
  });
};
