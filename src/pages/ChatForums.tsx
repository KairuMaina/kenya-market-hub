
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Users, 
  Store
} from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import BusinessDirectory from '@/components/chat/BusinessDirectory';
import CreatePostModal from '@/components/chat/CreatePostModal';
import ForumsList from '@/components/chat/ForumsList';
import ChatInterface from '@/components/chat/ChatInterface';

const ChatForums: React.FC = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

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
            <TabsList className="grid w-full grid-cols-3 mb-8">
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
              <ForumsList onCreatePost={() => setIsCreatePostOpen(true)} />
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              <h2 className="text-2xl font-bold">Private Messages</h2>
              <ChatInterface />
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
