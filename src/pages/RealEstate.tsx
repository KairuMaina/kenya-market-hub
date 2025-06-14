
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, MapPin, Search, Star, Shield, Phone, Building, Key } from 'lucide-react';
import MainLayout from '@/components/MainLayout';

const RealEstate = () => {
  const propertyTypes = [
    {
      type: 'Apartments',
      icon: Building,
      count: '500+',
      description: 'Modern apartments in prime locations'
    },
    {
      type: 'Houses',
      icon: Home,
      count: '300+',
      description: 'Family homes with gardens and parking'
    },
    {
      type: 'Commercial',
      icon: Key,
      count: '150+',
      description: 'Office spaces and retail locations'
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center py-16 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            Soko Smart Real Estate
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Find your perfect home or investment property across Kenya
          </p>
          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 px-8 py-3">
            <Search className="mr-2 h-5 w-5" />
            Search Properties
          </Button>
        </section>

        {/* Property Types */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Property Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {propertyTypes.map((property, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center">
                    <property.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{property.type}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-purple-600">
                    {property.count} Available
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{property.description}</p>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-600">
                    View {property.type}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Locations */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Popular Locations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Machakos', 'Nyeri'].map((location, index) => (
              <Card key={index} className="p-4 text-center hover:shadow-md transition-all duration-300">
                <MapPin className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <h3 className="font-semibold">{location}</h3>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: 'Verified Listings', desc: 'All properties are verified and legitimate' },
            { icon: Star, title: 'Expert Agents', desc: 'Work with experienced real estate professionals' },
            { icon: Search, title: 'Advanced Search', desc: 'Find exactly what you need with powerful filters' }
          ].map((feature, index) => (
            <Card key={index} className="text-center p-6">
              <feature.icon className="h-12 w-12 mx-auto mb-4 text-purple-500" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </Card>
          ))}
        </section>

        {/* Coming Soon Notice */}
        <section className="text-center bg-gradient-to-r from-purple-500 to-violet-600 text-white p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Coming Soon!</h2>
          <p className="text-lg mb-6 opacity-90">
            Our real estate platform is launching soon. Get ready to find your dream property!
          </p>
          <Button variant="secondary" size="lg" className="px-8 py-3">
            <Phone className="mr-2 h-5 w-5" />
            Get Early Access
          </Button>
        </section>
      </div>
    </MainLayout>
  );
};

export default RealEstate;
