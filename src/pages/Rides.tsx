
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, MapPin, Clock, Shield, Star, Phone } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import RideBookingModal from '@/components/RideBookingModal';
import RideHistory from '@/components/RideHistory';
import { useAuth } from '@/contexts/AuthContext';

const Rides = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { user } = useAuth();

  const vehicleTypes = [
    {
      type: 'Taxi',
      icon: Car,
      price: 'KSh 150',
      time: '5-10 min',
      description: 'Comfortable rides for daily commuting'
    },
    {
      type: 'Motorbike',
      icon: Car,
      price: 'KSh 80',
      time: '3-8 min',
      description: 'Quick rides through traffic'
    }
  ];

  const handleBookRide = () => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    setIsBookingModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Hero Section with Background */}
        <section className="relative text-center py-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)'
            }}
          />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Soko Smart Rides
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Get around Kenya safely and affordably with our ride-hailing service
            </p>
            <Button size="lg" onClick={handleBookRide} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-3">
              <MapPin className="mr-2 h-5 w-5" />
              Book a Ride Now
            </Button>
          </div>
        </section>

        {/* Vehicle Types */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Ride</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {vehicleTypes.map((vehicle, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <vehicle.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{vehicle.type}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>From {vehicle.price}</span>
                        <span>•</span>
                        <span>{vehicle.time}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{vehicle.description}</CardDescription>
                  <Button onClick={handleBookRide} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600">
                    Select {vehicle.type}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: 'Safe & Secure', desc: 'Verified drivers and secure payments' },
            { icon: Clock, title: 'Fast Booking', desc: 'Get a ride in minutes, not hours' },
            { icon: Star, title: 'Rated Drivers', desc: 'All our drivers are highly rated' }
          ].map((feature, index) => (
            <Card key={index} className="text-center p-6">
              <feature.icon className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </Card>
          ))}
        </section>

        {/* User's Ride History - Only show if logged in */}
        {user && (
          <section>
            <RideHistory />
          </section>
        )}

        {/* Coming Soon Notice */}
        <section className="text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Ride Matching Coming Soon!</h2>
          <p className="text-lg mb-6 opacity-90">
            You can book rides now, but driver matching is still in development. We'll notify you when it's ready!
          </p>
          <Button variant="secondary" size="lg" className="px-8 py-3">
            <Phone className="mr-2 h-5 w-5" />
            Get Notified
          </Button>
        </section>
      </div>

      <RideBookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </MainLayout>
  );
};

export default Rides;
