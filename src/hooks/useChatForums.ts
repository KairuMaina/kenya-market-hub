
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
      // Mock data since forum tables don't exist yet
      return [
        { id: '1', name: 'General Discussion', description: 'Talk about anything', post_count: 45, member_count: 320, created_at: new Date().toISOString() },
        { id: '2', name: 'Business & Services', description: 'Discuss local businesses', post_count: 89, member_count: 450, created_at: new Date().toISOString() },
        { id: '3', name: 'Events & Activities', description: 'Share local events', post_count: 67, member_count: 280, created_at: new Date().toISOString() },
        { id: '4', name: 'Buy & Sell', description: 'Marketplace discussions', post_count: 123, member_count: 560, created_at: new Date().toISOString() },
      ] as ForumCategory[];
    }
  });
};

// Forum Posts
export const useForumPosts = (categoryId?: string) => {
  return useQuery({
    queryKey: ['forum-posts', categoryId],
    queryFn: async () => {
      // Mock data since forum tables don't exist yet
      return [
        {
          id: '1',
          title: 'Best local restaurants in Nairobi?',
          content: 'Looking for recommendations for good local food...',
          author_id: '1',
          category_id: '2',
          reply_count: 12,
          like_count: 8,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          author: { full_name: 'Mary Kamau' },
          category: { name: 'Business & Services' }
        },
        {
          id: '2',
          title: 'Community cleanup this weekend',
          content: 'Join us for a community cleanup event...',
          author_id: '2',
          category_id: '3',
          reply_count: 6,
          like_count: 15,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          author: { full_name: 'Peter Mwangi' },
          category: { name: 'Events & Activities' }
        }
      ] as ForumPost[];
    }
  });
};

// Create Forum Post
export const useCreateForumPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postData: { title: string; content: string; category_id: string }) => {
      // Mock implementation since forum tables don't exist
      const newPost = {
        id: Date.now().toString(),
        ...postData,
        author_id: 'current-user',
        reply_count: 0,
        like_count: 0,
        created_at: new Date().toISOString(),
      };
      return newPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
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
      
      // Mock data since chat tables don't exist yet
      return [
        {
          id: '1',
          participant1_id: user.id,
          participant2_id: '2',
          last_message: 'Thanks for the help with the delivery!',
          last_message_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          unread_count: 2,
          created_at: new Date().toISOString(),
          other_participant: { full_name: 'John\'s Electronics Store' }
        },
        {
          id: '2',
          participant1_id: user.id,
          participant2_id: '3',
          last_message: 'See you at the pickup location',
          last_message_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          unread_count: 0,
          created_at: new Date().toISOString(),
          other_participant: { full_name: 'Sarah Wilson (Driver)' }
        }
      ] as ChatConversation[];
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
      
      // Mock data since chat tables don't exist yet
      return [
        {
          id: '1',
          conversation_id: conversationId,
          sender_id: '2',
          content: 'Hello! I saw your order for the smartphone. It\'s ready for pickup.',
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          is_read: true
        },
        {
          id: '2',
          conversation_id: conversationId,
          sender_id: 'current-user',
          content: 'Great! What time would be best for pickup?',
          created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          is_read: true
        },
        {
          id: '3',
          conversation_id: conversationId,
          sender_id: '2',
          content: 'Anytime between 9 AM and 6 PM works for me.',
          created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          is_read: true
        }
      ] as ChatMessage[];
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
      
      // Mock implementation since chat tables don't exist
      const newMessage = {
        id: Date.now().toString(),
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        created_at: new Date().toISOString(),
        is_read: false
      };
      return newMessage;
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
      
      // Mock implementation since chat tables don't exist
      const newConversation = {
        id: Date.now().toString(),
        participant1_id: user.id,
        participant2_id: businessId,
        created_at: new Date().toISOString()
      };
      return newConversation;
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
