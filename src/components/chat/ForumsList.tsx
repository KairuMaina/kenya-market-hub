
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Clock, ThumbsUp, Reply, Plus, MessageSquare, Pin, Lock, Eye, Heart, Smile } from 'lucide-react';
import { useForumCategories, useForumPosts, useTogglePostReaction, useForumPostComments, useCreateForumComment } from '@/hooks/useChatForums';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface ForumsListProps {
  onCreatePost: () => void;
}

const ForumsList = ({ onCreatePost }: ForumsListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [replyToComment, setReplyToComment] = useState<string | null>(null);

  const { user } = useAuth();
  const { data: categories, isLoading: categoriesLoading } = useForumCategories();
  const { data: posts, isLoading: postsLoading } = useForumPosts(selectedCategory);
  const toggleReaction = useTogglePostReaction();
  const { data: comments } = useForumPostComments(selectedPost || '');
  const createComment = useCreateForumComment();

  const handleReaction = async (postId: string, reactionType: string) => {
    if (!user) return;
    await toggleReaction.mutateAsync({ postId, reactionType });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !commentContent.trim()) return;

    await createComment.mutateAsync({
      postId: selectedPost,
      content: commentContent,
      parentCommentId: replyToComment
    });

    setCommentContent('');
    setReplyToComment(null);
  };

  const CommentItem = ({ comment, depth = 0 }: { comment: any; depth?: number }) => (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''} space-y-3`}>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="font-medium">{comment.author?.full_name || 'Anonymous'}</span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className="text-gray-700 mb-2">{comment.content}</p>
        <div className="flex items-center gap-4 text-sm">
          <button className="flex items-center gap-1 text-gray-500 hover:text-orange-600">
            <ThumbsUp className="h-3 w-3" />
            {comment.like_count}
          </button>
          <button 
            onClick={() => setReplyToComment(comment.id)}
            className="text-gray-500 hover:text-orange-600"
          >
            Reply
          </button>
        </div>
      </div>
      
      {comment.replies?.map((reply: any) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community Forums</h2>
        <Button onClick={onCreatePost} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </Button>
              {categoriesLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                categories?.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex-1 text-left">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500">
                        {category.post_count} posts
                      </div>
                    </div>
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <div className="lg:col-span-3">
          {postsLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">Loading posts...</div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts?.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {post.is_pinned && (
                          <Pin className="h-4 w-4 text-orange-500" />
                        )}
                        {post.is_locked && (
                          <Lock className="h-4 w-4 text-gray-500" />
                        )}
                        <h3 
                          className="text-lg font-semibold text-gray-900 hover:text-orange-600 cursor-pointer"
                          onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                        >
                          {post.title}
                        </h3>
                      </div>
                      <Badge variant="outline">{post.category?.name}</Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>By {post.author?.full_name || 'Anonymous'}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.view_count}
                        </span>
                        <button
                          onClick={() => handleReaction(post.id, 'like')}
                          className={`flex items-center gap-1 hover:text-orange-600 ${
                            post.user_reaction?.reaction_type === 'like' ? 'text-orange-600' : ''
                          }`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          {post.like_count}
                        </button>
                        <span className="flex items-center gap-1">
                          <Reply className="h-3 w-3" />
                          {post.reply_count} replies
                        </span>
                        <button
                          onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                          className="flex items-center gap-1 hover:text-orange-600"
                        >
                          <MessageSquare className="h-3 w-3" />
                          {selectedPost === post.id ? 'Hide' : 'Show'} Comments
                        </button>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {selectedPost === post.id && (
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-semibold mb-4">Comments</h4>
                        
                        {/* Add Comment Form */}
                        <form onSubmit={handleSubmitComment} className="mb-6">
                          <div className="space-y-3">
                            {replyToComment && (
                              <div className="text-sm text-gray-600">
                                Replying to comment...
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setReplyToComment(null)}
                                  className="ml-2"
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                            <Textarea
                              placeholder="Write a comment..."
                              value={commentContent}
                              onChange={(e) => setCommentContent(e.target.value)}
                              className="rounded-xl"
                              rows={3}
                            />
                            <div className="flex justify-end">
                              <Button 
                                type="submit" 
                                disabled={!commentContent.trim() || createComment.isPending}
                                className="bg-orange-500 hover:bg-orange-600"
                              >
                                {createComment.isPending ? 'Posting...' : 'Post Comment'}
                              </Button>
                            </div>
                          </div>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-4">
                          {comments?.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                          ))}
                          
                          {comments?.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              No comments yet. Be the first to comment!
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {posts?.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Reply className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-4">Be the first to start a discussion!</p>
                    <Button onClick={onCreatePost} className="bg-orange-500 hover:bg-orange-600">
                      Create First Post
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumsList;
