
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Shield, Phone, Star, Clock } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import ServicesAdvancedSearch from '@/components/services/ServicesAdvancedSearch';

const Services = () => {
  const [showAdvancedSearch, setShowAdvancedSearch] = React.useState(false);
  const [searchFilters, setSearchFilters] = React.useState({});

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

  const handleAdvancedFiltersChange = (filters: any) => {
    setSearchFilters(filters);
    console.log('Applied service filters:', filters);
  };

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="relative text-center py-20 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)'
            }}
          />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Professional Services
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Connect with skilled professionals across Kenya for all your service needs. 
              From home repairs to personal care, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-8 py-3">
                <Wrench className="mr-2 h-5 w-5" />
                Find Services Now
              </Button>
              <Button variant="outline" size="lg" className="border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-3">
                Become a Service Provider
              </Button>
            </div>
          </div>
        </section>

        {/* Advanced Search Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Find Professional Services</h2>
              <p className="text-gray-600">Search and filter to find the perfect service provider for your needs</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="ml-4 border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              {showAdvancedSearch ? 'Hide Search' : 'Advanced Search'}
            </Button>
          </div>
          
          {showAdvancedSearch && (
            <ServicesAdvancedSearch 
              onFiltersChange={handleAdvancedFiltersChange}
              className="animate-fade-in"
            />
          )}
        </section>

        {/* Service Categories - Now Empty to be populated by providers */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Available Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse services offered by our verified professionals across Kenya
            </p>
          </div>

          <Card className="text-center py-16 border-2 border-dashed border-orange-200 bg-orange-50">
            <CardContent>
              <Wrench className="h-16 w-16 mx-auto mb-6 text-orange-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                Services Coming Soon
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Service providers will be able to list their services here. 
                Check back soon or become a service provider yourself!
              </p>
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                Become a Service Provider
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6 border-0 bg-gradient-to-br from-white to-orange-50 hover:shadow-lg transition-shadow">
              <feature.icon className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </Card>
          ))}
        </section>

        {/* How It Works */}
        <section className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Choose Service', desc: 'Select the service you need from our categories' },
              { step: '2', title: 'Get Matched', desc: 'We connect you with verified professionals nearby' },
              { step: '3', title: 'Book & Pay', desc: 'Schedule your service and pay securely through the app' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-orange-500 to-red-600 text-white p-12 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers across Kenya who trust Soko Smart for their service needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
              <Wrench className="mr-2 h-5 w-5" />
              Browse Services
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-orange-600">
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
