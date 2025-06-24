
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: number;
  max_attendees?: number;
  current_attendees: number;
  image_url?: string;
  organizer_id: string;
  created_at: string;
}

const EventSystem = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0]) // Future events only
        .order('date', { ascending: true });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Event[];
    }
  });

  const categories = [
    'all',
    'Conference',
    'Workshop',
    'Networking',
    'Entertainment',
    'Sports',
    'Education'
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Events</h2>
          <p className="text-gray-600">Loading events...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
        <p className="text-gray-600">Discover and join exciting events in your area</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Events Grid */}
      {events && events.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {event.image_url && (
                <div className="h-48 bg-gradient-to-r from-orange-500 to-red-600 relative">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-white text-gray-900">
                    {event.category}
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {event.current_attendees} 
                  {event.max_attendees && ` / ${event.max_attendees}`} attendees
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-600">
                    {event.price === 0 ? 'Free' : `KSh ${event.price.toLocaleString()}`}
                  </span>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-600">
                    Register
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
          <p className="text-gray-600">
            {selectedCategory === 'all' 
              ? 'No upcoming events are available at the moment.' 
              : `No upcoming ${selectedCategory.toLowerCase()} events found.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventSystem;
