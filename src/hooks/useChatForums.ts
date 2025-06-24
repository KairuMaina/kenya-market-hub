
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ForumCategory {
  id: string;
  name: string;
  description?: string;
  post_count: number;
  member_count: number;
  created_at: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category_id: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  reply_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  category?: ForumCategory;
  author?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface ForumComment {
  id: string;
  content: string;
  author_id: string;
  post_id: string;
  parent_comment_id?: string;
  like_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string;
    avatar_url?: string;
  };
}

export const useForumCategories = () => {
  return useQuery({
    queryKey: ['forum-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as ForumCategory[];
    }
  });
};

export const useForumPosts = (categoryId?: string) => {
  return useQuery({
    queryKey: ['forum-posts', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('forum_posts')
        .select(`
          *,
          category:forum_categories(*),
          author:profiles(full_name, avatar_url)
        `);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ForumPost[];
    }
  });
};

export const useForumPost = (postId: string) => {
  return useQuery({
    queryKey: ['forum-post', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          category:forum_categories(*),
          author:profiles(full_name, avatar_url)
        `)
        .eq('id', postId)
        .single();

      if (error) throw error;

      // Increment view count
      await supabase.rpc('increment_post_views', { post_id: postId });

      return data as ForumPost;
    },
    enabled: !!postId
  });
};

export const useForumComments = (postId: string) => {
  return useQuery({
    queryKey: ['forum-comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_post_comments')
        .select(`
          *,
          author:profiles(full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as ForumComment[];
    },
    enabled: !!postId
  });
};

export const useCreateForumPost = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: {
      title: string;
      content: string;
      category_id: string;
    }) => {
      if (!user) throw new Error('User must be logged in');

      const { data, error } = await supabase
        .from('forum_posts')
        .insert([{
          ...postData,
          author_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      queryClient.invalidateQueries({ queryKey: ['forum-categories'] });
      toast({
        title: 'Post created',
        description: 'Your forum post has been created successfully.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create post.',
        variant: 'destructive'
      });
    }
  });
};

export const useCreateForumComment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: {
      content: string;
      post_id: string;
      parent_comment_id?: string;
    }) => {
      if (!user) throw new Error('User must be logged in');

      const { data, error } = await supabase
        .from('forum_post_comments')
        .insert([{
          ...commentData,
          author_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forum-comments', variables.post_id] });
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      toast({
        title: 'Comment added',
        description: 'Your comment has been added successfully.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add comment.',
        variant: 'destructive'
      });
    }
  });
};

export const useLikeForumPost = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('User must be logged in');

      // Check if already liked
      const { data: existing } = await supabase
        .from('forum_post_reactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('reaction_type', 'like')
        .single();

      if (existing) {
        // Unlike
        const { error } = await supabase
          .from('forum_post_reactions')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('forum_post_reactions')
          .insert([{
            post_id: postId,
            user_id: user.id,
            reaction_type: 'like'
          }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      queryClient.invalidateQueries({ queryKey: ['forum-post'] });
    }
  });
};
