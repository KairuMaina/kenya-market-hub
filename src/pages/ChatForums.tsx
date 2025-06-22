
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Plus, TrendingUp } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';

const ChatForums: React.FC = () => {
  return (
    <FrontendLayout>
      <div className="min-h-screen bg-orange-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <MessageCircle className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4">Chat & Community Forums</h1>
              <p className="text-xl text-cyan-100 mb-8">
                Connect, discuss, and share with the Kenyan community
              </p>
              <Button className="bg-white text-cyan-600 hover:bg-cyan-50">
                <Plus className="h-4 w-4 mr-2" />
                Start Chatting
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Coming Soon */}
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <MessageCircle className="h-24 w-24 mx-auto mb-6 text-gray-400" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Community Features Coming Soon
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We're building amazing chat and forum features to help you connect with other users, 
                share experiences, and build community. Stay tuned!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-cyan-200">
                  <CardHeader>
                    <MessageCircle className="h-8 w-8 text-cyan-600 mb-2" />
                    <CardTitle className="text-lg">Direct Messaging</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Chat privately with other users, vendors, and service providers
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-cyan-200">
                  <CardHeader>
                    <Users className="h-8 w-8 text-cyan-600 mb-2" />
                    <CardTitle className="text-lg">Community Groups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Join groups based on interests, location, or business categories
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-cyan-200">
                  <CardHeader>
                    <TrendingUp className="h-8 w-8 text-cyan-600 mb-2" />
                    <CardTitle className="text-lg">Discussion Forums</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Share knowledge, ask questions, and engage in meaningful discussions
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                Get Notified When Available
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default ChatForums;
