
-- Add message attachments table for file sharing in chat
CREATE TABLE public.chat_message_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add forum post reactions table
CREATE TABLE public.forum_post_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction_type TEXT NOT NULL DEFAULT 'like',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id, reaction_type)
);

-- Add forum post comments table for threaded discussions
CREATE TABLE public.forum_post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.forum_post_comments(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add user mentions table
CREATE TABLE public.user_mentions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentioned_user_id UUID NOT NULL,
  mentioning_user_id UUID NOT NULL,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.forum_post_comments(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add new columns to existing tables
ALTER TABLE public.chat_messages ADD COLUMN message_type TEXT DEFAULT 'text';
ALTER TABLE public.chat_messages ADD COLUMN reply_to_message_id UUID REFERENCES public.chat_messages(id);
ALTER TABLE public.chat_messages ADD COLUMN edited_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.forum_posts ADD COLUMN is_pinned BOOLEAN DEFAULT false;
ALTER TABLE public.forum_posts ADD COLUMN is_locked BOOLEAN DEFAULT false;
ALTER TABLE public.forum_posts ADD COLUMN view_count INTEGER DEFAULT 0;

-- Enable Row Level Security
ALTER TABLE public.chat_message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mentions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chat_message_attachments
CREATE POLICY "Users can view attachments in their conversations" 
  ON public.chat_message_attachments FOR SELECT 
  USING (
    message_id IN (
      SELECT cm.id FROM public.chat_messages cm
      JOIN public.chat_conversations cc ON cm.conversation_id = cc.id
      WHERE cc.participant1_id = auth.uid() OR cc.participant2_id = auth.uid()
    )
  );

CREATE POLICY "Users can add attachments to their messages" 
  ON public.chat_message_attachments FOR INSERT 
  WITH CHECK (
    message_id IN (
      SELECT cm.id FROM public.chat_messages cm
      WHERE cm.sender_id = auth.uid()
    )
  );

-- Create RLS policies for forum_post_reactions
CREATE POLICY "Anyone can view post reactions" 
  ON public.forum_post_reactions FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage their own reactions" 
  ON public.forum_post_reactions FOR ALL 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create RLS policies for forum_post_comments
CREATE POLICY "Anyone can view comments" 
  ON public.forum_post_comments FOR SELECT 
  USING (true);

CREATE POLICY "Users can create comments" 
  ON public.forum_post_comments FOR INSERT 
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update their own comments" 
  ON public.forum_post_comments FOR UPDATE 
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete their own comments" 
  ON public.forum_post_comments FOR DELETE 
  USING (author_id = auth.uid());

-- Create RLS policies for user_mentions
CREATE POLICY "Users can view their mentions" 
  ON public.user_mentions FOR SELECT 
  USING (mentioned_user_id = auth.uid() OR mentioning_user_id = auth.uid());

CREATE POLICY "Users can create mentions" 
  ON public.user_mentions FOR INSERT 
  WITH CHECK (mentioning_user_id = auth.uid());

-- Admin policies for all tables
CREATE POLICY "Admins can manage all chat attachments" 
  ON public.chat_message_attachments FOR ALL 
  USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage all reactions" 
  ON public.forum_post_reactions FOR ALL 
  USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage all comments" 
  ON public.forum_post_comments FOR ALL 
  USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage all mentions" 
  ON public.user_mentions FOR ALL 
  USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create indexes for better performance
CREATE INDEX idx_chat_message_attachments_message_id ON public.chat_message_attachments(message_id);
CREATE INDEX idx_forum_post_reactions_post_id ON public.forum_post_reactions(post_id);
CREATE INDEX idx_forum_post_reactions_user_id ON public.forum_post_reactions(user_id);
CREATE INDEX idx_forum_post_comments_post_id ON public.forum_post_comments(post_id);
CREATE INDEX idx_forum_post_comments_parent_id ON public.forum_post_comments(parent_comment_id);
CREATE INDEX idx_user_mentions_mentioned_user ON public.user_mentions(mentioned_user_id);
CREATE INDEX idx_chat_messages_reply_to ON public.chat_messages(reply_to_message_id);

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_message_attachments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_post_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_post_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_mentions;

-- Update triggers for comment counts
CREATE OR REPLACE FUNCTION public.update_forum_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_posts 
    SET reply_count = reply_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_posts 
    SET reply_count = reply_count - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_forum_post_comment_count
  AFTER INSERT OR DELETE ON public.forum_post_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_forum_post_comment_count();

-- Update trigger for reaction counts
CREATE OR REPLACE FUNCTION public.update_forum_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_posts 
    SET like_count = like_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_posts 
    SET like_count = like_count - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_forum_post_like_count
  AFTER INSERT OR DELETE ON public.forum_post_reactions
  FOR EACH ROW EXECUTE FUNCTION public.update_forum_post_like_count();
