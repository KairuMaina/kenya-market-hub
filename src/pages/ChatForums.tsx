
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
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        <div className="space-y-10">
          {/* Header */}
          <div className="text-center space-y-5">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Community Hub
            </h1>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Connect with other users, share ideas, and build relationships in our vibrant community.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-base text-gray-700 font-medium">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Community Features */}
          <Tabs defaultValue="forums" className="w-full rounded-lg border border-gray-200 shadow-sm bg-white">
            <TabsList className="grid w-full grid-cols-3 border-b border-gray-200 rounded-t-lg bg-gray-50">
              <TabsTrigger 
                value="forums" 
                className="flex items-center justify-center gap-2 py-3 text-gray-700 font-semibold hover:bg-orange-100 data-[state=active]:bg-orange-200 data-[state=active]:text-orange-700 rounded-t-lg transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="hidden sm:inline">Forums</span>
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="flex items-center justify-center gap-2 py-3 text-gray-700 font-semibold hover:bg-green-100 data-[state=active]:bg-green-200 data-[state=active]:text-green-700 rounded-t-lg transition-colors"
              >
                <Users className="h-5 w-5" />
                <span className="hidden sm:inline">Direct Chat</span>
              </TabsTrigger>
              <TabsTrigger 
                value="directory" 
                className="flex items-center justify-center gap-2 py-3 text-gray-700 font-semibold hover:bg-purple-100 data-[state=active]:bg-purple-200 data-[state=active]:text-purple-700 rounded-t-lg transition-colors"
              >
                <Globe className="h-5 w-5" />
                <span className="hidden sm:inline">Directory</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="forums" className="mt-8">
              <Card className="shadow-md rounded-lg border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-orange-600 font-bold text-lg">
                    <MessageCircle className="h-6 w-6" />
                    Community Forums
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImprovedForumsList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="mt-8">
              <Card className="shadow-md rounded-lg border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-600 font-bold text-lg">
                    <Users className="h-6 w-6" />
                    Direct Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ChatInterface />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="directory" className="mt-8">
              <Card className="shadow-md rounded-lg border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-purple-600 font-bold text-lg">
                    <Globe className="h-6 w-6" />
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
