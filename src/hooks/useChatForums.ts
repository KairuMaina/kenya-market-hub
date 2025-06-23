
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
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
  reply_count: number;
  like_count: number;
  created_at: string;
  author?: {
    full_name: string;
  };
  category?: {
    name: string;
  };
}

export interface ChatConversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  created_at: string;
  other_participant?: {
    full_name: string;
  };
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

// Forum Categories
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

// Forum Posts
export const useForumPosts = (categoryId?: string) => {
  return useQuery({
    queryKey: ['forum-posts', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('forum_posts')
        .select(`
          *,
          author:profiles(full_name),
          category:forum_categories(name)
        `)
        .order('created_at', { ascending: false });
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as any;
    }
  });
};

// Create Forum Post
export const useCreateForumPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postData: { title: string; content: string; category_id: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          ...postData,
          author_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      queryClient.invalidateQueries({ queryKey: ['forum-categories'] });
      toast({ title: 'Post created successfully!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating post',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

// Chat Conversations
export const useChatConversations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['chat-conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          participant1:profiles!chat_conversations_participant1_id_fkey(full_name),
          participant2:profiles!chat_conversations_participant2_id_fkey(full_name)
        `)
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });
      
      if (error) throw error;
      
      // Transform data to include other_participant and unread_count
      const transformedData = data?.map(conv => ({
        ...conv,
        other_participant: conv.participant1_id === user.id ? conv.participant2 : conv.participant1,
        unread_count: 0 // TODO: Implement unread count logic
      })) || [];
      
      return transformedData as any;
    },
    enabled: !!user
  });
};

// Chat Messages
export const useChatMessages = (conversationId: string | null) => {
  return useQuery({
    queryKey: ['chat-messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as ChatMessage[];
    },
    enabled: !!conversationId
  });
};

// Send Message
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error sending message',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

// Start Conversation with Business
export const useStartBusinessConversation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ businessId, initialMessage }: { businessId: string; initialMessage: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      // First, check if conversation already exists
      const { data: existingConv } = await supabase
        .from('chat_conversations')
        .select('id')
        .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${businessId}),and(participant1_id.eq.${businessId},participant2_id.eq.${user.id})`)
        .maybeSingle();
      
      let conversationId = existingConv?.id;
      
      if (!conversationId) {
        // Create new conversation
        const { data: newConv, error: convError } = await supabase
          .from('chat_conversations')
          .insert({
            participant1_id: user.id,
            participant2_id: businessId
          })
          .select()
          .single();
        
        if (convError) throw convError;
        conversationId = newConv.id;
      }
      
      // Send initial message
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: initialMessage
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
      toast({ title: 'Conversation started!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error starting conversation',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};
