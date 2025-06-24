
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, DollarSign, Ticket, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  max_attendees: number;
  current_attendees: number;
  organizer_name: string;
  organizer_verified: boolean;
  image_url?: string;
  category: string;
}

const EventSystem = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Mock events data - in real app this would come from API
  const events: Event[] = [
    {
      id: '1',
      title: 'Nairobi Tech Conference 2024',
      description: 'Annual technology conference featuring latest innovations and networking opportunities.',
      date: '2024-03-15',
      time: '09:00',
      location: 'KICC, Nairobi',
      price: 2500,
      max_attendees: 500,
      current_attendees: 123,
      organizer_name: 'Tech Kenya',
      organizer_verified: true,
      category: 'Technology',
      image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
    },
    {
      id: '2',
      title: 'East African Music Festival',
      description: 'Celebrate East African music with top artists and cultural performances.',
      date: '2024-03-20',
      time: '18:00',
      location: 'Uhuru Gardens, Nairobi',
      price: 1500,
      max_attendees: 2000,
      current_attendees: 456,
      organizer_name: 'Music Events Kenya',
      organizer_verified: true,
      category: 'Music',
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f'
    },
    {
      id: '3',
      title: 'Startup Pitch Competition',
      description: 'Young entrepreneurs pitch their innovative ideas to investors.',
      date: '2024-03-25',
      time: '14:00',
      location: 'Strathmore University',
      price: 500,
      max_attendees: 200,
      current_attendees: 89,
      organizer_name: 'Startup Hub',
      organizer_verified: false,
      category: 'Business'
    }
  ];

  const purchaseTickets = async (event: Event) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to purchase tickets',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }

    if (ticketQuantity <= 0) {
      toast({
        title: 'Invalid Quantity',
        description: 'Please select at least 1 ticket',
        variant: 'destructive'
      });
      return;
    }

    if (event.current_attendees + ticketQuantity > event.max_attendees) {
      toast({
        title: 'Not Enough Tickets',
        description: 'Not enough tickets available for this event',
        variant: 'destructive'
      });
      return;
    }

    setIsPurchasing(true);
    try {
      // Add tickets to cart as products
      for (let i = 0; i < ticketQuantity; i++) {
        addToCart({
          id: `event-${event.id}`,
          name: `${event.title} - Event Ticket`,
          price: event.price,
          image: event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
          vendor: event.organizer_name
        });
      }

      toast({
        title: 'Tickets Added to Cart!',
        description: `${ticketQuantity} ticket(s) for ${event.title} added to cart`,
      });

      setSelectedEvent(null);
      setTicketQuantity(1);

      // Navigate to checkout
      navigate('/checkout');

    } catch (error) {
      toast({
        title: 'Purchase Failed',
        description: 'Failed to add tickets to cart. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Upcoming Events</h1>
        <p className="text-gray-600">Discover and attend amazing events in Kenya</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border hover:border-orange-200">
            <div className="relative">
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center">
                  <Calendar className="h-12 w-12 text-white" />
                </div>
              )}
              <Badge className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                {event.category}
              </Badge>
            </div>
            
            <CardHeader>
              <CardTitle className="line-clamp-2">{event.title}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{event.organizer_name}</span>
                {event.organizer_verified ? (
                  <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600 border-orange-200 text-xs">
                    Unverified
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 line-clamp-3">{event.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  <span>{event.current_attendees}/{event.max_attendees} attending</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-green-600">
                    KSh {event.price.toLocaleString()}
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => setSelectedEvent(event)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  disabled={!event.organizer_verified || event.current_attendees >= event.max_attendees}
                >
                  <Ticket className="h-3 w-3 mr-1" />
                  {event.current_attendees >= event.max_attendees ? 'Sold Out' : 'Buy Tickets'}
                </Button>
              </div>

              {!event.organizer_verified && (
                <div className="bg-orange-50 border border-orange-200 rounded p-2">
                  <p className="text-xs text-orange-800">
                    ⚠️ This organizer is not verified. Purchase tickets at your own discretion.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ticket Purchase Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Purchase Tickets</CardTitle>
              <p className="text-sm text-gray-600">{selectedEvent.title}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Tickets</label>
                <Input
                  type="number"
                  min="1"
                  max={selectedEvent.max_attendees - selectedEvent.current_attendees}
                  value={ticketQuantity}
                  onChange={(e) => setTicketQuantity(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between text-sm">
                  <span>Ticket Price:</span>
                  <span>KSh {selectedEvent.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Quantity:</span>
                  <span>{ticketQuantity}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>KSh {(selectedEvent.price * ticketQuantity).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => purchaseTickets(selectedEvent)}
                  disabled={isPurchasing}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  {isPurchasing ? 'Processing...' : 'Add to Cart & Checkout'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EventSystem;
