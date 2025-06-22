
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Users, 
  Search, 
  Plus, 
  Heart,
  Reply,
  MoreHorizontal,
  Send,
  Hash,
  Clock
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/shared/HeroSection';
import BusinessDirectory from '@/components/chat/BusinessDirectory';
import CreatePostModal from '@/components/chat/CreatePostModal';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  useForumCategories, 
  useForumPosts, 
  useChatConversations, 
  useChatMessages,
  useSendMessage 
} from '@/hooks/useChatForums';
import { formatDistanceToNow } from 'date-fns';

const ChatForums = () => {
  const { user, loading } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categories } = useForumCategories();
  const { data: posts } = useForumPosts();
  const { data: conversations } = useChatConversations();
  const { data: messages } = useChatMessages(activeChat);
  const sendMessage = useSendMessage();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSendMessage = () => {
    if (message.trim() && activeChat) {
      sendMessage.mutate({
        conversationId: activeChat,
        content: message
      }, {
        onSuccess: () => setMessage('')
      });
    }
  };

  const filteredConversations = conversations?.filter(conv =>
    conv.other_participant?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <HeroSection
          title="Chat & Forums"
          subtitle="Connect & Communicate"
          description="Stay connected with private messaging and join community discussions on topics that matter to you"
          imageUrl="photo-1460925895917-afdab827c52f"
        />

        <div className="max-w-7xl mx-auto px-4">
          <Tabs defaultValue="forums" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="forums" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Community Forums
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Private Messages
              </TabsTrigger>
              <TabsTrigger value="businesses" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Contact Businesses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="forums">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Forum Categories */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Forum Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {categories?.map((category) => (
                        <div key={category.id} className="p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{category.name}</h4>
                            <Badge variant="outline">{category.post_count}</Badge>
                          </div>
                          <p className="text-sm text-gray-500">{category.member_count} members</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Posts */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Recent Discussions</CardTitle>
                        <Button 
                          size="sm" 
                          className="bg-orange-600 hover:bg-orange-700"
                          onClick={() => setShowCreatePost(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          New Post
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {posts?.map((post) => (
                          <div key={post.id} className="p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>by {post.author?.full_name}</span>
                                  <Badge variant="outline">{post.category?.name}</Badge>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {getTimeAgo(post.created_at)}
                                  </span>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-4 mt-3">
                              <Button variant="ghost" size="sm" className="text-gray-500">
                                <Reply className="h-4 w-4 mr-1" />
                                {post.reply_count} replies
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-500">
                                <Heart className="h-4 w-4 mr-1" />
                                {post.like_count} likes
                              </Button>
                            </div>
                          </div>
                        ))}
                        {!posts?.length && (
                          <div className="text-center text-gray-500 py-8">
                            No posts yet. Be the first to start a discussion!
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat List */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Messages
                      </CardTitle>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="Search conversations..." 
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-1">
                        {filteredConversations.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            No conversations yet. Start chatting with businesses!
                          </div>
                        ) : (
                          filteredConversations.map((chat) => (
                            <div
                              key={chat.id}
                              onClick={() => setActiveChat(chat.id)}
                              className={`p-3 cursor-pointer hover:bg-gray-50 ${
                                activeChat === chat.id ? 'bg-orange-50 border-r-2 border-orange-500' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium">{chat.other_participant?.full_name}</h4>
                                <span className="text-xs text-gray-500">
                                  {chat.last_message_at ? getTimeAgo(chat.last_message_at) : ''}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 truncate">{chat.last_message}</p>
                                {chat.unread_count > 0 && (
                                  <Badge className="bg-orange-600 text-white text-xs">{chat.unread_count}</Badge>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Chat Window */}
                <div className="lg:col-span-2">
                  <Card className="h-96">
                    {activeChat ? (
                      <>
                        <CardHeader className="border-b">
                          <CardTitle>
                            {conversations?.find(chat => chat.id === activeChat)?.other_participant?.full_name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-4 overflow-y-auto max-h-72">
                          <div className="space-y-4">
                            {messages?.map((msg) => (
                              <div 
                                key={msg.id}
                                className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`rounded-lg p-3 max-w-xs ${
                                  msg.sender_id === user.id 
                                    ? 'bg-orange-600 text-white' 
                                    : 'bg-gray-100 text-gray-900'
                                }`}>
                                  <p className="text-sm">{msg.content}</p>
                                  <span className={`text-xs ${
                                    msg.sender_id === user.id ? 'text-orange-200' : 'text-gray-500'
                                  }`}>
                                    {getTimeAgo(msg.created_at)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <div className="p-4 border-t">
                          <div className="flex gap-2">
                            <Input
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Type a message..."
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              disabled={sendMessage.isPending}
                            />
                            <Button 
                              onClick={handleSendMessage} 
                              className="bg-orange-600 hover:bg-orange-700"
                              disabled={sendMessage.isPending || !message.trim()}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Select a conversation to start messaging</p>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="businesses">
              <BusinessDirectory />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
    </MainLayout>
  );
};

export default ChatForums;
