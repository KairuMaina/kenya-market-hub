
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, MapPin, Clock, Star, Ticket, Users } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';

const Events: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Events', count: 85 },
    { id: 'concerts', name: 'Concerts', count: 25 },
    { id: 'comedy', name: 'Comedy Shows', count: 15 },
    { id: 'conferences', name: 'Conferences', count: 18 },
    { id: 'workshops', name: 'Workshops', count: 12 },
    { id: 'sports', name: 'Sports', count: 8 },
    { id: 'festivals', name: 'Festivals', count: 7 }
  ];

  const events = [
    {
      id: 1,
      title: 'Jazz Night at The Alchemist',
      category: 'Concert',
      date: '2024-06-20',
      time: '19:00',
      location: 'The Alchemist, Westlands',
      price: 2500,
      rating: 4.8,
      attendees: 145,
      image: '/placeholder.svg',
      featured: true,
      freeEvent: false,
      description: 'An evening of smooth jazz with local and international artists'
    },
    {
      id: 2,
      title: 'Tech Startup Conference 2024',
      category: 'Conference',
      date: '2024-06-25',
      time: '09:00',
      location: 'KICC, Nairobi',
      price: 0,
      rating: 4.6,
      attendees: 320,
      image: '/placeholder.svg',
      featured: false,
      freeEvent: true,
      description: 'Learn from successful entrepreneurs and network with industry leaders'
    },
    {
      id: 3,
      title: 'Churchill Comedy Night',
      category: 'Comedy',
      date: '2024-06-22',
      time: '20:00',
      location: 'Louis Leakey Auditorium',
      price: 1500,
      rating: 4.9,
      attendees: 89,
      image: '/placeholder.svg',
      featured: true,
      freeEvent: false,
      description: 'Hilarious comedy show featuring top Kenyan comedians'
    },
    {
      id: 4,
      title: 'Photography Workshop',
      category: 'Workshop',
      date: '2024-06-28',
      time: '10:00',
      location: 'Creative Hub, Karen',
      price: 3500,
      rating: 4.7,
      attendees: 25,
      image: '/placeholder.svg',
      featured: false,
      freeEvent: false,
      description: 'Master the art of portrait photography with professional guidance'
    }
  ];

  const upcomingEvents = [
    {
      id: 5,
      title: 'Nairobi Film Festival',
      date: '2024-07-05',
      category: 'Festival'
    },
    {
      id: 6,
      title: 'Digital Marketing Bootcamp',
      date: '2024-07-10',
      category: 'Workshop'
    },
    {
      id: 7,
      title: 'Sauti Sol Live Concert',
      date: '2024-07-15',
      category: 'Concert'
    }
  ];

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
              {categories.map((category) => (
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
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Featured Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow border-orange-200">
                    <div className="relative">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      {event.featured && (
                        <Badge className="absolute top-2 left-2 bg-purple-600 hover:bg-purple-700">
                          Featured
                        </Badge>
                      )}
                      {event.freeEvent && (
                        <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">
                          FREE
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{event.category}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{event.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">
                          {event.freeEvent ? 'FREE' : `KSh ${event.price.toLocaleString()}`}
                        </span>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <Ticket className="h-4 w-4 mr-1" />
                          {event.freeEvent ? 'RSVP' : 'Buy Ticket'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Create Event */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-lg">Promote Your Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Have an event to promote? Reach thousands of potential attendees!
                  </p>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Create Event
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <p className="text-xs text-gray-600">{event.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 border-orange-200 hover:bg-orange-50">
                    View All
                  </Button>
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
