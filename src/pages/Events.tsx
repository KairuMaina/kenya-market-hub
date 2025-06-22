
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Search, MapPin, Plus } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { useEvents, useEventCategories } from '@/hooks/useEvents';
import LoadingSpinner from '@/components/LoadingSpinner';

const Events: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: categories, isLoading: categoriesLoading } = useEventCategories();

  if (eventsLoading || categoriesLoading) {
    return (
      <FrontendLayout>
        <div className="min-h-screen bg-orange-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-orange-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Calendar className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4">Events & Ticketing</h1>
              <p className="text-xl text-purple-100 mb-8">
                Discover amazing events happening around you
              </p>
              
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white text-gray-900"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Location"
                    className="pl-10 bg-white text-gray-900 md:w-64"
                  />
                </div>
                <Button className="bg-white text-purple-600 hover:bg-purple-50">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Event Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'border-orange-200 hover:bg-orange-50'
                  }
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Events */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Events</h2>
              {events && events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow border-orange-200">
                      <div className="relative">
                        <div className="w-full h-48 bg-gradient-to-r from-purple-400 to-orange-400 flex items-center justify-center">
                          <Calendar className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Yet</h3>
                  <p className="text-gray-500">Events will appear here once they are created and published.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Create Event */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-lg">Create Your Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Have an event to promote? Reach thousands of potential attendees!
                  </p>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-lg">Platform Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Events</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Categories</span>
                      <span className="font-medium">{categories?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Events;
