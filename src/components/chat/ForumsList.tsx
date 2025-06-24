
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, TrendingUp, Plus } from 'lucide-react';
import { useForumPosts } from '@/hooks/useForumPostsNew';
import { useForumCategories } from '@/hooks/useChatForums';

const ForumsList = () => {
  const { data: categories, isLoading: categoriesLoading } = useForumCategories();
  const { data: recentPosts, isLoading: postsLoading } = useForumPosts();

  if (categoriesLoading || postsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading forums...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Forums</h2>
          <p className="text-gray-600 mt-1">Join discussions and connect with the community</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md bg-gradient-to-br from-white to-orange-50/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {category.description || 'Join the discussion'}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{category.post_count} posts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{category.member_count} members</span>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Posts */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Recent Posts
              </CardTitle>
              <CardDescription>Latest discussions from the community</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="hover:bg-orange-50 hover:border-orange-200">
              View All
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {recentPosts?.slice(0, 5).map((post) => (
              <div key={post.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/60 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-sm">
                    {post.author_profile?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 line-clamp-1">{post.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{post.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>By {post.author_profile?.full_name || 'Unknown'}</span>
                    <span>{post.like_count} likes</span>
                    <span>{post.reply_count} replies</span>
                    <span>{post.view_count} views</span>
                  </div>
                </div>
              </div>
            ))}
            
            {(!recentPosts || recentPosts.length === 0) && (
              <div className="text-center py-8">
                <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No posts yet</p>
                <p className="text-xs text-gray-400 mt-1">Be the first to start a discussion!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForumsList;
