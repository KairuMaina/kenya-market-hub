
import React from 'react';
import { Calendar } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import EventSystem from '@/components/events/EventSystem';

const Events: React.FC = () => {
  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16 rounded-b-2xl mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Calendar className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4">Events & Experiences</h1>
              <p className="text-xl text-orange-100 mb-8">
                Discover amazing events and purchase tickets from verified organizers
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <EventSystem />
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Events;
