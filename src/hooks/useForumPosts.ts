
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
  has_liked?: boolean;
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
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['forum-posts', categoryId, user?.id],
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

      // Transform data and check if user has liked each post
      const transformedData = await Promise.all((data || []).map(async (post) => {
        let has_liked = false;
        
        if (user) {
          const { data: likeData } = await supabase
            .from('forum_post_reactions')
            .select('id')
            .eq('post_id', post.id)
            .eq('user_id', user.id)
            .eq('reaction_type', 'like')
            .single();
          
          has_liked = !!likeData;
        }

        return {
          ...post,
          has_liked,
          author_profile: Array.isArray(post.author_profile) 
            ? post.author_profile[0] 
            : post.author_profile || { full_name: 'Unknown User' },
          category: Array.isArray(post.category) 
            ? post.category[0] 
            : post.category || { name: 'General' }
        };
      }));

      return transformedData as ForumPost[];
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
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
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

export const useTogglePostLike = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('User not authenticated');

      // Check if user already liked the post
      const { data: existingLike } = await supabase
        .from('forum_post_reactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('reaction_type', 'like')
        .single();

      if (existingLike) {
        // Unlike the post
        const { error } = await supabase
          .from('forum_post_reactions')
          .delete()
          .eq('id', existingLike.id);
        
        if (error) throw error;
        return { action: 'unliked' };
      } else {
        // Like the post
        const { error } = await supabase
          .from('forum_post_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: 'like'
          });
        
        if (error) throw error;
        return { action: 'liked' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    },
    onError: (error: any) => {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive'
      });
    }
  });
};

export const useIncrementPostViews = () => {
  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.rpc('increment_post_views', {
        post_id: postId
      });

      if (error) throw error;
    }
  });
};
