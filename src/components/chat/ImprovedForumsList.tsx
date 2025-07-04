
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Heart, MessageCircle, Eye, Search } from 'lucide-react';
import { useForumPosts, useCreateForumPost, useTogglePostLike, useIncrementPostViews } from '@/hooks/useForumPosts';
import { useChatForums } from '@/hooks/useChatForums';
import { formatDistanceToNow } from 'date-fns';
import { ResponsivePage, ResponsiveSection, ResponsiveButtonGroup, ResponsiveGrid } from '@/components/ui/responsive-layout';
import { PrimaryButton, SecondaryButton } from '@/components/ui/unified-buttons';
import { ContentCard } from '@/components/ui/unified-cards';

const ImprovedForumsList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    categoryId: ''
  });

  const { data: categories = [] } = useChatForums();
  const { data: posts = [], isLoading } = useForumPosts(selectedCategory === 'all' ? undefined : selectedCategory);
  const createPostMutation = useCreateForumPost();
  const toggleLikeMutation = useTogglePostLike();
  const incrementViewsMutation = useIncrementPostViews();

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.categoryId) return;

    try {
      await createPostMutation.mutateAsync({
        title: newPost.title,
        content: newPost.content,
        categoryId: newPost.categoryId
      });
      
      setNewPost({ title: '', content: '', categoryId: '' });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handlePostClick = (postId: string) => {
    incrementViewsMutation.mutate(postId);
  };

  const handleLike = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleLikeMutation.mutateAsync(postId);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  if (isLoading) {
    return (
      <ResponsivePage>
        <ResponsiveGrid cols={1}>
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2 skeleton"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 skeleton"></div>
              </CardContent>
            </Card>
          ))}
        </ResponsiveGrid>
      </ResponsivePage>
    );
  }

  return (
    <ResponsivePage>
      <ResponsiveSection>
        {/* Header with filters and create button */}
        <div className="mobile-container">
          <div className="space-y-5 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
            {/* Search and Filter Section */}
            <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-5 sm:items-center flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 w-full mobile-form-input"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-52">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Create Button */}
            <div className="w-full sm:w-auto">
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <PrimaryButton fullWidth className="sm:w-auto shadow-md">
                    Create Post
                  </PrimaryButton>
                </DialogTrigger>
                <DialogContent className="mobile-modal max-w-md mx-auto rounded-lg shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Create New Post</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreatePost} className="space-y-5 mobile-form">
                    <div>
                      <Label htmlFor="category" className="font-medium">Category</Label>
                      <Select value={newPost.categoryId} onValueChange={(value) => setNewPost(prev => ({ ...prev, categoryId: value }))}>
                        <SelectTrigger className="rounded-md border border-gray-300">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="title" className="font-medium">Title</Label>
                      <Input
                        id="title"
                        value={newPost.title}
                        onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter post title..."
                        className="mobile-form-input rounded-md border border-gray-300"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content" className="font-medium">Content</Label>
                      <Textarea
                        id="content"
                        value={newPost.content}
                        onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Write your post content..."
                        rows={4}
                        className="mobile-form-input rounded-md border border-gray-300"
                        required
                      />
                    </div>
                    
                    <ResponsiveButtonGroup>
                      <SecondaryButton
                        type="button"
                        onClick={() => setIsCreateModalOpen(false)}
                        fullWidth
                        className="shadow-sm"
                      >
                        Cancel
                      </SecondaryButton>
                      <PrimaryButton
                        type="submit"
                        loading={createPostMutation.isPending}
                        fullWidth
                        className="shadow-md"
                      >
                        {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
                      </PrimaryButton>
                    </ResponsiveButtonGroup>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </ResponsiveSection>

      <ResponsiveSection>
        {/* Posts list */}
        {filteredPosts.length === 0 ? (
          <ContentCard>
            <div className="text-center py-16">
              <MessageCircle className="h-14 w-14 text-gray-400 mx-auto mb-5" />
              <h3 className="text-xl font-semibold mb-3">No posts found</h3>
              <p className="text-gray-700 mb-6">
                {searchTerm ? 'Try adjusting your search terms.' : 'Be the first to start a discussion!'}
              </p>
              <PrimaryButton onClick={() => setIsCreateModalOpen(true)} className="shadow-md">
                Create First Post
              </PrimaryButton>
            </div>
          </ContentCard>
        ) : (
          <ResponsiveGrid cols={1}>
            {filteredPosts.map((post) => (
              <Card 
                key={post.id} 
                className="card-hover cursor-pointer border border-gray-300 rounded-lg shadow-sm hover:shadow-md smooth-transition"
                onClick={() => handlePostClick(post.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarImage src={post.author_profile?.avatar_url} />
                        <AvatarFallback>
                          {post.author_profile?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg text-orange-900 hover:text-orange-700 truncate">
                          {post.title}
                        </CardTitle>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="truncate">{post.author_profile?.full_name || 'Anonymous'}</span>
                          <span>•</span>
                          <span className="whitespace-nowrap">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    {post.category && (
                      <Badge 
                        style={{ backgroundColor: post.category.color }}
                        className="text-white flex-shrink-0"
                      >
                        {post.category.name}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-gray-700 mb-5 line-clamp-3">
                    {post.content}
                  </CardDescription>
                  
                  <div className="flex items-center gap-8 text-sm text-gray-600">
                    <button
                      onClick={(e) => handleLike(post.id, e)}
                      className="flex items-center gap-2 hover:text-red-500 smooth-transition mobile-touch-button"
                      disabled={toggleLikeMutation.isPending}
                    >
                      <Heart className={`w-5 h-5 ${post.has_liked ? 'fill-red-500 text-red-500' : ''}`} />
                      <span>{post.like_count}</span>
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.reply_count}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      <span>{post.view_count}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ResponsiveGrid>
        )}
      </ResponsiveSection>
    </ResponsivePage>
  );
};

export default ImprovedForumsList;
