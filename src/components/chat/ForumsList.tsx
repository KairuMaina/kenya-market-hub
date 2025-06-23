
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ThumbsUp, Reply, Plus } from 'lucide-react';
import { useForumCategories, useForumPosts } from '@/hooks/useChatForums';
import { formatDistanceToNow } from 'date-fns';

interface ForumsListProps {
  onCreatePost: () => void;
}

const ForumsList = ({ onCreatePost }: ForumsListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: categories, isLoading: categoriesLoading } = useForumCategories();
  const { data: posts, isLoading: postsLoading } = useForumPosts(selectedCategory);

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
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-600 cursor-pointer">
                        {post.title}
                      </h3>
                      <Badge variant="outline">{post.category?.name}</Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {post.content}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>By {post.author?.full_name}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {post.like_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Reply className="h-3 w-3" />
                          {post.reply_count} replies
                        </span>
                      </div>
                    </div>
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
