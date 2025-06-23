
import React from 'react';
import { Calendar } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import EventSystem from '@/components/events/EventSystem';

const Events: React.FC = () => {
  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Calendar className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4">Events & Experiences</h1>
              <p className="text-xl text-purple-100 mb-8">
                Discover amazing events and purchase tickets from verified organizers
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <EventSystem />
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Events;
