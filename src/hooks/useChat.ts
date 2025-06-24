
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get or create conversation with improved error handling
  const createOrGetConversation = async (otherUserId: string) => {
    if (!user) throw new Error('User not authenticated');

    // First, try to find existing conversation
    const { data: existingConversation, error: findError } = await supabase
      .from('chat_conversations')
      .select('*')
      .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${otherUserId}),and(participant1_id.eq.${otherUserId},participant2_id.eq.${user.id})`)
      .maybeSingle();

    if (findError) {
      console.error('Error finding conversation:', findError);
      throw findError;
    }

    if (existingConversation) {
      return existingConversation;
    }

    // If no existing conversation, create a new one with conflict handling
    const conversationData = {
      participant1_id: user.id,
      participant2_id: otherUserId,
    };

    const { data: newConversation, error: createError } = await supabase
      .from('chat_conversations')
      .insert([conversationData])
      .select()
      .single();

    if (createError) {
      // If we get a duplicate key error, try to fetch the conversation again
      if (createError.code === '23505') {
        const { data: retryConversation, error: retryError } = await supabase
          .from('chat_conversations')
          .select('*')
          .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${otherUserId}),and(participant1_id.eq.${otherUserId},participant2_id.eq.${user.id})`)
          .single();

        if (retryError) throw retryError;
        return retryConversation;
      }
      throw createError;
    }

    return newConversation;
  };

  const startConversationMutation = useMutation({
    mutationFn: createOrGetConversation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({
        title: 'Conversation Started',
        description: 'You can now chat with this user.'
      });
    },
    onError: (error: any) => {
      console.error('Error starting conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation. Please try again.',
        variant: 'destructive'
      });
    }
  });

  return {
    startConversation: startConversationMutation.mutate,
    isStartingConversation: startConversationMutation.isPending
  };
};
