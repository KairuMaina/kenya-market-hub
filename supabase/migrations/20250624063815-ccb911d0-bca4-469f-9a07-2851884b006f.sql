
-- Fix foreign key references and add missing RLS policies (with existence checks)

-- Check and add foreign key constraints for chat_conversations if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'chat_conversations_participant1_id_fkey' 
        AND table_name = 'chat_conversations'
    ) THEN
        ALTER TABLE public.chat_conversations 
        ADD CONSTRAINT chat_conversations_participant1_id_fkey 
        FOREIGN KEY (participant1_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'chat_conversations_participant2_id_fkey' 
        AND table_name = 'chat_conversations'
    ) THEN
        ALTER TABLE public.chat_conversations 
        ADD CONSTRAINT chat_conversations_participant2_id_fkey 
        FOREIGN KEY (participant2_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create user_follows table for following functionality (if not exists)
CREATE TABLE IF NOT EXISTS public.user_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Enable RLS on user_follows
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view follows" ON public.user_follows;
DROP POLICY IF EXISTS "Users can create follows" ON public.user_follows;
DROP POLICY IF EXISTS "Users can delete their follows" ON public.user_follows;

CREATE POLICY "Users can view follows" 
  ON public.user_follows FOR SELECT 
  USING (follower_id = auth.uid() OR following_id = auth.uid());

CREATE POLICY "Users can create follows" 
  ON public.user_follows FOR INSERT 
  WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can delete their follows" 
  ON public.user_follows FOR DELETE 
  USING (follower_id = auth.uid());

-- Add missing RLS policies for existing tables (drop and recreate to avoid conflicts)
DROP POLICY IF EXISTS "Users can view chat conversations they participate in" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can create chat conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can view forum posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Users can create forum posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Users can update their own forum posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Anyone can view forum categories" ON public.forum_categories;

CREATE POLICY "Users can view chat conversations they participate in" 
  ON public.chat_conversations FOR SELECT 
  USING (participant1_id = auth.uid() OR participant2_id = auth.uid());

CREATE POLICY "Users can create chat conversations" 
  ON public.chat_conversations FOR INSERT 
  WITH CHECK (participant1_id = auth.uid() OR participant2_id = auth.uid());

CREATE POLICY "Users can view messages in their conversations" 
  ON public.chat_messages FOR SELECT 
  USING (
    conversation_id IN (
      SELECT id FROM public.chat_conversations 
      WHERE participant1_id = auth.uid() OR participant2_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their conversations" 
  ON public.chat_messages FOR INSERT 
  WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
      SELECT id FROM public.chat_conversations 
      WHERE participant1_id = auth.uid() OR participant2_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view forum posts" 
  ON public.forum_posts FOR SELECT 
  USING (true);

CREATE POLICY "Users can create forum posts" 
  ON public.forum_posts FOR INSERT 
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update their own forum posts" 
  ON public.forum_posts FOR UPDATE 
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Anyone can view forum categories" 
  ON public.forum_categories FOR SELECT 
  USING (true);

-- Add profile picture column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add indexes for performance (with IF NOT EXISTS checks)
CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON public.user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following_id ON public.user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_participants ON public.chat_conversations(participant1_id, participant2_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author_id ON public.forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category_id ON public.forum_posts(category_id);

-- Insert some sample forum categories if they don't exist
INSERT INTO public.forum_categories (name, description) 
SELECT 'General Discussion', 'General topics and discussions'
WHERE NOT EXISTS (SELECT 1 FROM public.forum_categories WHERE name = 'General Discussion');

INSERT INTO public.forum_categories (name, description) 
SELECT 'Business & Services', 'Discuss local businesses and services'
WHERE NOT EXISTS (SELECT 1 FROM public.forum_categories WHERE name = 'Business & Services');

INSERT INTO public.forum_categories (name, description) 
SELECT 'Marketplace', 'Buy, sell, and trade items'
WHERE NOT EXISTS (SELECT 1 FROM public.forum_categories WHERE name = 'Marketplace');

INSERT INTO public.forum_categories (name, description) 
SELECT 'Community Events', 'Local events and meetups'
WHERE NOT EXISTS (SELECT 1 FROM public.forum_categories WHERE name = 'Community Events');
