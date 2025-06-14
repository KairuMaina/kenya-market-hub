
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Home, Zap, Paintbrush, Shield, Phone, Star, Clock } from 'lucide-react';
import MainLayout from '@/components/MainLayout';

const Services = () => {
  const serviceCategories = [
    {
      name: 'Home Repairs',
      icon: Home,
      services: ['Plumbing', 'Electrical', 'Carpentry', 'Painting'],
      description: 'Professional home repair and maintenance services',
      price: 'From KSh 500',
    },
    {
      name: 'Electronics',
      icon: Zap,
      services: ['Phone Repair', 'Computer Repair', 'TV Repair', 'Appliances'],
      description: 'Expert repair for all your electronic devices',
      price: 'From KSh 300',
    },
    {
      name: 'Beauty & Wellness',
      icon: Paintbrush,
      services: ['Hair Styling', 'Massage', 'Manicure', 'Pedicure'],
      description: 'Professional beauty and wellness services at home',
      price: 'From KSh 800',
    },
    {
      name: 'Security',
      icon: Shield,
      services: ['Security Guards', 'CCTV Installation', 'Alarm Systems'],
      description: 'Complete security solutions for your peace of mind',
      price: 'From KSh 1,000',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Hero Section with Background */}
        <section className="relative text-center py-24 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)'
            }}
          />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Soko Smart Services
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Connect with skilled professionals for all your service needs in Kenya
            </p>
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-3">
              <Wrench className="mr-2 h-5 w-5" />
              Find Services
            </Button>
          </div>
        </section>

        {/* Service Categories */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Service Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="p-3 bg-green-100 rounded-xl w-fit mx-auto mb-4">
                    <category.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <CardDescription>{category.price}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Popular services:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.services.map((service, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600">
                    Browse {category.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: 'Verified Professionals', desc: 'All service providers are background checked' },
            { icon: Clock, title: 'Quick Response', desc: 'Get matched with providers in minutes' },
            { icon: Star, title: 'Quality Guaranteed', desc: 'Satisfaction guaranteed or your money back' }
          ].map((feature, index) => (
            <Card key={index} className="text-center p-6">
              <feature.icon className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </Card>
          ))}
        </section>

        {/* Coming Soon Notice */}
        <section className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Service Marketplace Coming Soon!</h2>
          <p className="text-lg mb-6 opacity-90">
            We're building the largest network of verified service providers in Kenya. Join our waitlist!
          </p>
          <Button variant="secondary" size="lg" className="px-8 py-3">
            <Phone className="mr-2 h-5 w-5" />
            Join Waitlist
          </Button>
        </section>
      </div>
    </MainLayout>
  );
};

export default Services;
