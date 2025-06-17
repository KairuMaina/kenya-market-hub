
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
  Hash
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/shared/HeroSection';
import { useAuth } from '@/contexts/AuthContext';

const ChatForums = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  // Mock data
  const recentChats = [
    { id: '1', name: 'John Doe', lastMessage: 'Thanks for the help!', time: '2m ago', unread: 2 },
    { id: '2', name: 'Sarah Wilson', lastMessage: 'See you tomorrow', time: '1h ago', unread: 0 },
    { id: '3', name: 'Mike Johnson', lastMessage: 'Great job on the project', time: '3h ago', unread: 1 }
  ];

  const forumCategories = [
    { id: 'parenting', name: 'Parenting & Family', posts: 145, members: 1200, color: 'bg-pink-100 text-pink-800' },
    { id: 'finance', name: 'Personal Finance', posts: 89, members: 890, color: 'bg-green-100 text-green-800' },
    { id: 'events', name: 'Local Events', posts: 67, members: 560, color: 'bg-purple-100 text-purple-800' },
    { id: 'tech', name: 'Technology', posts: 123, members: 980, color: 'bg-blue-100 text-blue-800' },
    { id: 'business', name: 'Small Business', posts: 78, members: 670, color: 'bg-orange-100 text-orange-800' },
    { id: 'health', name: 'Health & Wellness', posts: 92, members: 780, color: 'bg-cyan-100 text-cyan-800' }
  ];

  const recentPosts = [
    {
      id: '1',
      title: 'Best schools in Nairobi for kindergarten?',
      author: 'MaryK',
      category: 'Parenting & Family',
      replies: 12,
      likes: 8,
      time: '2h ago'
    },
    {
      id: '2',
      title: 'Small business loan options in Kenya',
      author: 'PeterM',
      category: 'Personal Finance',
      replies: 6,
      likes: 15,
      time: '4h ago'
    },
    {
      id: '3',
      title: 'Weekend farmers market locations',
      author: 'GraceW',
      category: 'Local Events',
      replies: 9,
      likes: 5,
      time: '6h ago'
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage('');
    }
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
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="forums" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Community Forums
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Private Messages
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
                      {forumCategories.map((category) => (
                        <div key={category.id} className="p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{category.name}</h4>
                            <Badge className={category.color}>{category.posts}</Badge>
                          </div>
                          <p className="text-sm text-gray-500">{category.members} members</p>
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
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                          <Plus className="h-4 w-4 mr-2" />
                          New Post
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentPosts.map((post) => (
                          <div key={post.id} className="p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>by {post.author}</span>
                                  <Badge variant="outline">{post.category}</Badge>
                                  <span>{post.time}</span>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-4 mt-3">
                              <Button variant="ghost" size="sm" className="text-gray-500">
                                <Reply className="h-4 w-4 mr-1" />
                                {post.replies} replies
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-500">
                                <Heart className="h-4 w-4 mr-1" />
                                {post.likes} likes
                              </Button>
                            </div>
                          </div>
                        ))}
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
                        <Input placeholder="Search conversations..." className="pl-10" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-1">
                        {recentChats.map((chat) => (
                          <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat.id)}
                            className={`p-3 cursor-pointer hover:bg-gray-50 ${
                              activeChat === chat.id ? 'bg-orange-50 border-r-2 border-orange-500' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">{chat.name}</h4>
                              <span className="text-xs text-gray-500">{chat.time}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                              {chat.unread > 0 && (
                                <Badge className="bg-orange-600 text-white text-xs">{chat.unread}</Badge>
                              )}
                            </div>
                          </div>
                        ))}
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
                            {recentChats.find(chat => chat.id === activeChat)?.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-4">
                          <div className="space-y-4 mb-4">
                            <div className="flex justify-start">
                              <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                                <p className="text-sm">Hello! How are you doing?</p>
                                <span className="text-xs text-gray-500">10:30 AM</span>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <div className="bg-orange-600 text-white rounded-lg p-3 max-w-xs">
                                <p className="text-sm">I'm doing great, thanks! How about you?</p>
                                <span className="text-xs text-orange-200">10:32 AM</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <div className="p-4 border-t">
                          <div className="flex gap-2">
                            <Input
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Type a message..."
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <Button onClick={handleSendMessage} className="bg-orange-600 hover:bg-orange-700">
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
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatForums;
