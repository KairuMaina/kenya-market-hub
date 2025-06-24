
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Users, Globe } from 'lucide-react';
import ImprovedForumsList from '@/components/chat/ImprovedForumsList';
import BusinessDirectory from '@/components/chat/BusinessDirectory';
import ImprovedChatInterface from '@/components/chat/ImprovedChatInterface';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

const ChatForums: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string>('');
  const { isOnline } = useOnlineStatus();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Community Hub
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Connect with other users, share ideas, and build relationships in our vibrant community.
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Community Features */}
          <Tabs defaultValue="forums" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="forums" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Forums</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Direct Chat</span>
              </TabsTrigger>
              <TabsTrigger value="directory" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Directory</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="forums" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    Community Forums
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImprovedForumsList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-500" />
                      Active Conversations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedConversationId ? (
                        <div className="text-center text-gray-500">
                          Select a conversation from your chat list or start a new one from the directory.
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          No active conversations. Start chatting with someone from the directory!
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {selectedConversationId && (
                  <ImprovedChatInterface 
                    conversationId={selectedConversationId}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="directory" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-500" />
                    Business Directory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BusinessDirectory 
                    onStartChat={(conversationId) => {
                      setSelectedConversationId(conversationId);
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">1,234</div>
                <div className="text-sm text-gray-600">Forum Posts</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">567</div>
                <div className="text-sm text-gray-600">Active Members</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Globe className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">89</div>
                <div className="text-sm text-gray-600">Businesses Listed</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatForums;
