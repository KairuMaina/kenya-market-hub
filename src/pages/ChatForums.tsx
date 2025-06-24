
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
import HeroSection from '@/components/shared/HeroSection';

const ChatForums: React.FC = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <HeroSection
            title="Chat & Community Forums"
            subtitle="Connect with the community"
            description="Discuss, share, and connect with Kenyans"
            imageUrl="photo-1516321318423-f06f85e504b3"
            className="mb-8 h-64"
          />

          <div className="container mx-auto">
            <Tabs defaultValue="forums" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 h-12 p-1 bg-white border border-orange-200 rounded-xl shadow-sm">
                <TabsTrigger 
                  value="forums" 
                  className="flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Forums</span>
                  <span className="sm:hidden">Chat</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="chat" 
                  className="flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Chat</span>
                  <span className="sm:hidden">Messages</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="directory" 
                  className="flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Store className="h-4 w-4" />
                  <span className="hidden sm:inline">Business</span>
                  <span className="sm:hidden">Biz</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="forums" className="space-y-6">
                <ForumsList onCreatePost={() => setIsCreatePostOpen(true)} />
              </TabsContent>

              <TabsContent value="chat" className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold">Private Messages</h2>
                <ChatInterface />
              </TabsContent>

              <TabsContent value="directory" className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold">Business Directory</h2>
                <BusinessDirectory />
              </TabsContent>
            </Tabs>
          </div>

          <CreatePostModal 
            isOpen={isCreatePostOpen} 
            onClose={() => setIsCreatePostOpen(false)} 
          />
        </div>
      </div>
    </FrontendLayout>
  );
};

export default ChatForums;
