
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

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
  view_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  author?: {
    full_name: string;
  };
  category?: {
    name: string;
  };
  user_reaction?: {
    reaction_type: string;
  };
}

export interface ForumPostComment {
  id: string;
  post_id: string;
  parent_comment_id?: string;
  author_id: string;
  content: string;
  like_count: number;
  created_at: string;
  author?: {
    full_name: string;
  };
  replies?: ForumPostComment[];
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
  message_type: string;
  reply_to_message_id?: string;
  created_at: string;
  edited_at?: string;
  is_read: boolean;
  attachments?: ChatMessageAttachment[];
  reply_to?: ChatMessage;
}

export interface ChatMessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
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

// Forum Posts with real-time updates
export const useForumPosts = (categoryId?: string) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['forum-posts', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('forum_posts')
        .select(`
          *,
          author:profiles(full_name),
          category:forum_categories(name),
          user_reaction:forum_post_reactions(reaction_type)
        `)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as any;
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('forum-posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_posts'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_post_reactions'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};

// Forum Post Comments
export const useForumPostComments = (postId: string) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['forum-post-comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_post_comments')
        .select(`
          *,
          author:profiles(full_name)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Organize comments into threaded structure
      const comments = data as any[];
      const commentMap = new Map();
      const rootComments: ForumPostComment[] = [];
      
      // First pass: create comment objects
      comments.forEach(comment => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });
      
      // Second pass: organize into tree structure
      comments.forEach(comment => {
        if (comment.parent_comment_id) {
          const parent = commentMap.get(comment.parent_comment_id);
          if (parent) {
            parent.replies.push(commentMap.get(comment.id));
          }
        } else {
          rootComments.push(commentMap.get(comment.id));
        }
      });
      
      return rootComments;
    },
    enabled: !!postId
  });

  // Real-time subscription for comments
  useEffect(() => {
    if (!postId) return;
    
    const channel = supabase
      .channel(`post-comments-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_post_comments',
          filter: `post_id=eq.${postId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['forum-post-comments', postId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, queryClient]);

  return query;
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

// Add Forum Post Reaction
export const useTogglePostReaction = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, reactionType }: { postId: string; reactionType: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Check if reaction already exists
      const { data: existingReaction } = await supabase
        .from('forum_post_reactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType)
        .single();
      
      if (existingReaction) {
        // Remove reaction
        const { error } = await supabase
          .from('forum_post_reactions')
          .delete()
          .eq('id', existingReaction.id);
        
        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add reaction
        const { data, error } = await supabase
          .from('forum_post_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: reactionType
          })
          .select()
          .single();
        
        if (error) throw error;
        return { action: 'added', data };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating reaction',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

// Add Forum Post Comment
export const useCreateForumComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, content, parentCommentId }: { 
      postId: string; 
      content: string; 
      parentCommentId?: string 
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('forum_post_comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          content,
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
      toast({ title: 'Comment added successfully!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error adding comment',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

// Chat Conversations with real-time
export const useChatConversations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
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

  // Real-time subscription
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('chat-conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_conversations',
          filter: `participant1_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_conversations',
          filter: `participant2_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return query;
};

// Chat Messages with real-time
export const useChatMessages = (conversationId: string | null) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['chat-messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          attachments:chat_message_attachments(*),
          reply_to:chat_messages(id, content, sender_id)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as any;
    },
    enabled: !!conversationId
  });

  // Real-time subscription
  useEffect(() => {
    if (!conversationId) return;
    
    const channel = supabase
      .channel(`chat-messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chat-messages', conversationId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  return query;
};

// Send Message
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      conversationId, 
      content, 
      messageType = 'text',
      replyToMessageId 
    }: { 
      conversationId: string; 
      content: string;
      messageType?: string;
      replyToMessageId?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          message_type: messageType,
          reply_to_message_id: replyToMessageId
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
