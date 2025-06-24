
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
        <HeroSection
          title="Chat & Community Forums"
          subtitle="Connect with the community"
          description="Discuss, share, and connect with Kenyans"
          imageUrl="photo-1516321318423-f06f85e504b3"
          className="mb-0 rounded-b-2xl h-64 px-6 py-8"
        />

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="forums" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 h-auto">
              <TabsTrigger 
                value="forums" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Forums</span>
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
              >
                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger 
                value="directory" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
              >
                <Store className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Business</span>
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
    </FrontendLayout>
  );
};

export default ChatForums;
