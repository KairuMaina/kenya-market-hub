
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ForumCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  post_count: number;
  member_count: number;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  other_participant?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    email: string;
  };
  unread_count: number;
}

export interface UserSearchResult {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
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

export const useForumCategories = () => {
  return useChatForums();
};

export const useChatConversations = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          participant1:profiles!participant1_id(id, full_name, avatar_url, email),
          participant2:profiles!participant2_id(id, full_name, avatar_url, email)
        `)
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return [];
      }

      return (data || []).map(conv => ({
        ...conv,
        other_participant: conv.participant1_id === user.id ? 
          (Array.isArray(conv.participant2) ? conv.participant2[0] : conv.participant2) : 
          (Array.isArray(conv.participant1) ? conv.participant1[0] : conv.participant1),
        unread_count: 0 // TODO: implement unread count
      })) as ChatConversation[];
    },
    enabled: !!user
  });
};

export const useUserSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: ['user-search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .limit(10);

      if (error) throw error;
      return data as UserSearchResult[];
    },
    enabled: !!searchTerm && searchTerm.length >= 2
  });
};

export const useCreateConversation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ participantId }: { participantId: string }) => {
      if (!user) throw new Error('User not authenticated');

      // Check if conversation already exists
      const { data: existingConv } = await supabase
        .from('chat_conversations')
        .select('id')
        .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${participantId}),and(participant1_id.eq.${participantId},participant2_id.eq.${user.id})`)
        .single();

      if (existingConv) {
        return { conversationId: existingConv.id };
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          participant1_id: user.id,
          participant2_id: participantId
        })
        .select()
        .single();

      if (error) throw error;
      return { conversationId: data.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation. Please try again.',
        variant: 'destructive'
      });
    }
  });
};

export const useForumPostComments = (postId: string) => {
  return useQuery({
    queryKey: ['forum-post-comments', postId],
    queryFn: async () => {
      if (!postId) return [];

      const { data, error } = await supabase
        .from('forum_post_comments')
        .select(`
          *,
          author:profiles!author_id(id, full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!postId
  });
};

export const useCreateForumComment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      postId, 
      content, 
      parentCommentId 
    }: {
      postId: string;
      content: string;
      parentCommentId?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('forum_post_comments')
        .insert({
          post_id: postId,
          content,
          author_id: user.id,
          parent_comment_id: parentCommentId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forum-post-comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    },
    onError: (error: any) => {
      console.error('Error creating comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post comment. Please try again.',
        variant: 'destructive'
      });
    }
  });
};

export const useStartBusinessConversation = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ businessId, initialMessage }: { businessId: string; initialMessage: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      // This is a mock implementation - in a real app you'd create a conversation with the business
      console.log('Starting conversation with business:', businessId, initialMessage);
      
      toast({
        title: 'Message Sent',
        description: 'Your message has been sent to the business.'
      });
    }
  });
};
