
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, ThumbsUp, Reply, Plus, MessageSquare, Pin, Lock, Eye, User } from 'lucide-react';
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
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''} space-y-3`}>
      <div className="bg-gray-50 rounded-xl p-4 border">
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={comment.author?.avatar_url} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm truncate">
                {comment.author?.full_name || 'Anonymous'}
              </span>
              <span className="text-xs text-gray-500 flex-shrink-0">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed break-words">{comment.content}</p>
            <div className="flex items-center gap-4 mt-3">
              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-600 transition-colors">
                <ThumbsUp className="h-3 w-3" />
                {comment.like_count}
              </button>
              <button 
                onClick={() => setReplyToComment(comment.id)}
                className="text-xs text-gray-500 hover:text-orange-600 transition-colors"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {comment.replies?.map((reply: any) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Forums</h2>
          <p className="text-gray-600 mt-1">Connect with your community</p>
        </div>
        <Button onClick={onCreatePost} className="bg-orange-500 hover:bg-orange-600 whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              <Button
                variant={selectedCategory === '' ? 'default' : 'ghost'}
                className="w-full justify-start text-left"
                onClick={() => setSelectedCategory('')}
              >
                <div className="flex-1">
                  <div className="font-medium">All Categories</div>
                </div>
              </Button>
              {categoriesLoading ? (
                <div className="text-center py-4 text-sm text-gray-500">Loading...</div>
              ) : (
                categories?.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{category.name}</div>
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
              <CardContent className="p-8">
                <div className="text-center text-gray-500">Loading posts...</div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts?.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-orange-500">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={post.author?.avatar_url} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {post.is_pinned && (
                            <Pin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                          )}
                          {post.is_locked && (
                            <Lock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          )}
                          <h3 
                            className="text-lg font-semibold text-gray-900 hover:text-orange-600 cursor-pointer leading-tight"
                            onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                          >
                            {post.title}
                          </h3>
                          <Badge variant="outline" className="ml-auto flex-shrink-0">
                            {post.category?.name}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                          <span className="truncate">By {post.author?.full_name || 'Anonymous'}</span>
                          <span className="flex items-center gap-1 flex-shrink-0">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Eye className="h-3 w-3" />
                              {post.view_count}
                            </span>
                            <button
                              onClick={() => handleReaction(post.id, 'like')}
                              className={`flex items-center gap-1 hover:text-orange-600 transition-colors ${
                                post.user_reaction?.reaction_type === 'like' ? 'text-orange-600' : 'text-gray-500'
                              }`}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              {post.like_count}
                            </button>
                            <span className="flex items-center gap-1 text-gray-500">
                              <Reply className="h-3 w-3" />
                              {post.reply_count} replies
                            </span>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {selectedPost === post.id ? 'Hide' : 'Show'} Comments
                          </Button>
                        </div>

                        {/* Comments Section */}
                        {selectedPost === post.id && (
                          <div className="mt-6 pt-6 border-t">
                            <h4 className="font-semibold mb-4 flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              Comments
                            </h4>
                            
                            {/* Add Comment Form */}
                            <form onSubmit={handleSubmitComment} className="mb-6">
                              <div className="space-y-3">
                                {replyToComment && (
                                  <div className="flex items-center justify-between text-sm text-gray-600 bg-orange-50 px-3 py-2 rounded-lg">
                                    <span>Replying to comment...</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setReplyToComment(null)}
                                      className="h-6 px-2 text-xs"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                )}
                                <Textarea
                                  placeholder="Write a comment..."
                                  value={commentContent}
                                  onChange={(e) => setCommentContent(e.target.value)}
                                  className="rounded-xl border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                                  rows={3}
                                />
                                <div className="flex justify-end">
                                  <Button 
                                    type="submit" 
                                    disabled={!commentContent.trim() || createComment.isPending}
                                    className="bg-orange-500 hover:bg-orange-600"
                                    size="sm"
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
                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                  <p>No comments yet. Be the first to comment!</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {posts?.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
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
