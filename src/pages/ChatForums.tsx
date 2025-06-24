
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Users, Globe, Plus } from 'lucide-react';
import ImprovedForumsList from '@/components/chat/ImprovedForumsList';
import BusinessDirectory from '@/components/chat/BusinessDirectory';
import ChatInterface from '@/components/chat/ChatInterface';
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-500" />
                    Direct Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ChatInterface />
                </CardContent>
              </Card>
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
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatForums;
