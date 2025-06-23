
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  Users, 
  Plus, 
  TrendingUp, 
  Search,
  Clock,
  ThumbsUp,
  Reply,
  Store,
  Send
} from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { useForumCategories, useForumPosts, useChatConversations, useChatMessages } from '@/hooks/useChatForums';
import BusinessDirectory from '@/components/chat/BusinessDirectory';
import CreatePostModal from '@/components/chat/CreatePostModal';
import { formatDistanceToNow } from 'date-fns';

const ChatForums: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: categories, isLoading: categoriesLoading } = useForumCategories();
  const { data: posts, isLoading: postsLoading } = useForumPosts(selectedCategory);
  const { data: conversations, isLoading: conversationsLoading } = useChatConversations();
  const { data: messages, isLoading: messagesLoading } = useChatMessages(selectedConversation);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // In a real implementation, this would send the message
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <MessageCircle className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4">Chat & Community Forums</h1>
              <p className="text-xl text-orange-100 mb-8">
                Connect, discuss, and share with the Kenyan community
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="forums" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="forums" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Forums
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="directory" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Business Directory
              </TabsTrigger>
            </TabsList>

            {/* Forums Tab */}
            <TabsContent value="forums" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Community Forums</h2>
                <Button onClick={() => setIsCreatePostOpen(true)} className="bg-orange-500 hover:bg-orange-600">
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
                            
                            <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                            
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
                            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                            <p className="text-gray-600 mb-4">Be the first to start a discussion!</p>
                            <Button onClick={() => setIsCreatePostOpen(true)} className="bg-orange-500 hover:bg-orange-600">
                              Create First Post
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              <h2 className="text-2xl font-bold">Private Messages</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Conversations List */}
                <div className="lg:col-span-1">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">Conversations</CardTitle>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input placeholder="Search conversations..." className="pl-10" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="max-h-96 overflow-y-auto">
                        {conversationsLoading ? (
                          <div className="p-4 text-center">Loading...</div>
                        ) : conversations?.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            No conversations yet
                          </div>
                        ) : (
                          conversations?.map((conversation) => (
                            <div
                              key={conversation.id}
                              onClick={() => setSelectedConversation(conversation.id)}
                              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                                selectedConversation === conversation.id ? 'bg-orange-50 border-orange-200' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">
                                  {conversation.other_participant?.full_name}
                                </h4>
                                {conversation.unread_count > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {conversation.unread_count}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {conversation.last_message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {conversation.last_message_at && 
                                  formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })
                                }
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Chat Messages */}
                <div className="lg:col-span-2">
                  <Card className="h-full flex flex-col">
                    {selectedConversation ? (
                      <>
                        <CardHeader className="border-b">
                          <CardTitle className="text-lg">
                            {conversations?.find(c => c.id === selectedConversation)?.other_participant?.full_name}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="flex-1 p-4 overflow-y-auto">
                          <div className="space-y-4">
                            {messagesLoading ? (
                              <div className="text-center">Loading messages...</div>
                            ) : (
                              messages?.map((message) => (
                                <div
                                  key={message.id}
                                  className={`flex ${
                                    message.sender_id === 'current-user' ? 'justify-end' : 'justify-start'
                                  }`}
                                >
                                  <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                      message.sender_id === 'current-user'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                    }`}
                                  >
                                    <p className="text-sm">{message.content}</p>
                                    <p className={`text-xs mt-1 ${
                                      message.sender_id === 'current-user' ? 'text-orange-100' : 'text-gray-500'
                                    }`}>
                                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                    </p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </CardContent>
                        
                        <div className="p-4 border-t">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Type a message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              className="flex-1"
                            />
                            <Button onClick={handleSendMessage} size="sm" className="bg-orange-500 hover:bg-orange-600">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <CardContent className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                          <p className="text-gray-600">Choose a conversation from the left to start chatting</p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Business Directory Tab */}
            <TabsContent value="directory" className="space-y-6">
              <h2 className="text-2xl font-bold">Business Directory</h2>
              <BusinessDirectory />
            </TabsContent>
          </Tabs>
        </div>

        {/* Create Post Modal */}
        <CreatePostModal 
          isOpen={isCreatePostOpen} 
          onClose={() => setIsCreatePostOpen(false)} 
        />
      </div>
    </FrontendLayout>
  );
};

export default ChatForums;
