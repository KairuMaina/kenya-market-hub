
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Home, Zap, Paintbrush, Shield, Phone, Star, Clock, Car, Hammer, Camera, Scissors } from 'lucide-react';
import MainLayout from '@/components/MainLayout';

const Services = () => {
  const serviceCategories = [
    {
      name: 'Home Repairs & Maintenance',
      icon: Home,
      services: ['Plumbing', 'Electrical Work', 'Carpentry', 'Painting', 'Roofing', 'Tiling'],
      description: 'Professional home repair and maintenance services by verified technicians',
      price: 'From KSh 500',
      availability: '24/7 Emergency Services',
    },
    {
      name: 'Electronics & Appliances',
      icon: Zap,
      services: ['Phone Repair', 'Computer Repair', 'TV Repair', 'Washing Machine', 'Refrigerator', 'Air Conditioning'],
      description: 'Expert repair for all your electronic devices and home appliances',
      price: 'From KSh 300',
      availability: 'Same Day Service',
    },
    {
      name: 'Beauty & Wellness',
      icon: Paintbrush,
      services: ['Hair Styling', 'Massage Therapy', 'Manicure & Pedicure', 'Makeup Artist', 'Personal Training'],
      description: 'Professional beauty and wellness services at your doorstep',
      price: 'From KSh 800',
      availability: 'Home & Salon Services',
    },
    {
      name: 'Security Services',
      icon: Shield,
      services: ['Security Guards', 'CCTV Installation', 'Alarm Systems', 'Access Control', 'Security Consultation'],
      description: 'Complete security solutions for homes and businesses',
      price: 'From KSh 1,000',
      availability: '24/7 Monitoring',
    },
    {
      name: 'Transportation',
      icon: Car,
      services: ['Taxi Services', 'Motorbike Rides', 'Delivery Services', 'Airport Transfers', 'Long Distance Travel'],
      description: 'Reliable transportation services across Kenya',
      price: 'From KSh 100',
      availability: 'Real-time Tracking',
    },
    {
      name: 'Construction & Renovation',
      icon: Hammer,
      services: ['Building Construction', 'Interior Design', 'Landscaping', 'Masonry', 'Welding'],
      description: 'Professional construction and renovation services',
      price: 'From KSh 2,000',
      availability: 'Free Estimates',
    },
    {
      name: 'Photography & Events',
      icon: Camera,
      services: ['Wedding Photography', 'Event Planning', 'Videography', 'DJ Services', 'Catering'],
      description: 'Capture your special moments with professional services',
      price: 'From KSh 5,000',
      availability: 'Custom Packages',
    },
    {
      name: 'Personal Care',
      icon: Scissors,
      services: ['House Cleaning', 'Laundry Services', 'Gardening', 'Pet Care', 'Elderly Care'],
      description: 'Personal and household care services for your convenience',
      price: 'From KSh 400',
      availability: 'Flexible Scheduling',
    },
  ];

  const features = [
    { 
      icon: Shield, 
      title: 'Verified Professionals', 
      desc: 'All service providers are background checked and verified for your safety'
    },
    { 
      icon: Clock, 
      title: 'Quick Response', 
      desc: 'Get matched with available providers in minutes, not hours'
    },
    { 
      icon: Star, 
      title: 'Quality Guaranteed', 
      desc: 'Satisfaction guaranteed with our rating system and money-back policy'
    },
    { 
      icon: Phone, 
      title: '24/7 Support', 
      desc: 'Round-the-clock customer support for all your service needs'
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="relative text-center py-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)'
            }}
          />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Professional Services
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Connect with skilled professionals across Kenya for all your service needs. 
              From home repairs to personal care, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-3">
                <Wrench className="mr-2 h-5 w-5" />
                Find Services Now
              </Button>
              <Button variant="outline" size="lg" className="border-green-500 text-green-600 hover:bg-green-50 px-8 py-3">
                Become a Service Provider
              </Button>
            </div>
          </div>
        </section>

        {/* Service Categories Grid */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Service Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our comprehensive range of professional services available across Kenya
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="p-4 bg-green-100 rounded-xl w-fit mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <category.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg mb-2">{category.name}</CardTitle>
                  <CardDescription className="text-green-600 font-semibold">
                    {category.price}
                  </CardDescription>
                  <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {category.availability}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm">{category.description}</p>
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Popular services:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.services.slice(0, 4).map((service, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                          {service}
                        </span>
                      ))}
                      {category.services.length > 4 && (
                        <span className="text-xs text-green-600 font-medium">
                          +{category.services.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    Book {category.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6 border-0 bg-gradient-to-br from-white to-green-50">
              <feature.icon className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </Card>
          ))}
        </section>

        {/* How It Works */}
        <section className="bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Choose Service', desc: 'Select the service you need from our categories' },
              { step: '2', title: 'Get Matched', desc: 'We connect you with verified professionals nearby' },
              { step: '3', title: 'Book & Pay', desc: 'Schedule your service and pay securely through the app' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white p-12 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers across Kenya who trust Soko Smart for their service needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
              <Wrench className="mr-2 h-5 w-5" />
              Book a Service
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-green-600">
              <Phone className="mr-2 h-5 w-5" />
              Become a Provider
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Services;
