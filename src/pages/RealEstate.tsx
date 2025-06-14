
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Home, MapPin, Bed, Bath, Square, Phone, Heart, Filter } from 'lucide-react';
import MainLayout from '@/components/MainLayout';

const RealEstate = () => {
  const propertyTypes = [
    {
      type: 'Apartments',
      icon: Building,
      count: '2,500+',
      priceRange: 'KSh 15K - 80K/month',
      description: 'Modern apartments in prime locations',
    },
    {
      type: 'Houses',
      icon: Home,
      count: '1,200+',
      priceRange: 'KSh 25K - 150K/month',
      description: 'Family homes with gardens and parking',
    },
    {
      type: 'Commercial',
      icon: Building,
      count: '800+',
      priceRange: 'KSh 30K - 200K/month',
      description: 'Office spaces and retail locations',
    },
  ];

  const featuredProperties = [
    {
      id: 1,
      title: '3BR Apartment in Kilimani',
      price: 'KSh 65,000/month',
      location: 'Kilimani, Nairobi',
      bedrooms: 3,
      bathrooms: 2,
      area: '120 sqm',
      image: '/placeholder.svg',
      type: 'Apartment',
    },
    {
      id: 2,
      title: '4BR House in Karen',
      price: 'KSh 120,000/month',
      location: 'Karen, Nairobi',
      bedrooms: 4,
      bathrooms: 3,
      area: '250 sqm',
      image: '/placeholder.svg',
      type: 'House',
    },
    {
      id: 3,
      title: 'Office Space in Westlands',
      price: 'KSh 85,000/month',
      location: 'Westlands, Nairobi',
      bedrooms: 0,
      bathrooms: 2,
      area: '180 sqm',
      image: '/placeholder.svg',
      type: 'Commercial',
    },
  ];

  const popularAreas = [
    'Kilimani', 'Karen', 'Westlands', 'Parklands', 'Lavington', 'Kileleshwa'
  ];

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center py-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Soko Smart Properties
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Find your perfect home or investment property in Kenya's prime locations
          </p>
          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-8 py-3">
            <Building className="mr-2 h-5 w-5" />
            Browse Properties
          </Button>
        </section>

        {/* Quick Search */}
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select className="w-full p-3 border rounded-lg">
                <option>Select Area</option>
                {popularAreas.map(area => (
                  <option key={area}>{area}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select className="w-full p-3 border rounded-lg">
                <option>Any Type</option>
                <option>Apartment</option>
                <option>House</option>
                <option>Commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select className="w-full p-3 border rounded-lg">
                <option>Any Price</option>
                <option>Under KSh 30K</option>
                <option>KSh 30K - 60K</option>
                <option>KSh 60K - 100K</option>
                <option>Above KSh 100K</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600">
                <Filter className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* Property Types */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Property Types</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {propertyTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="p-3 bg-purple-100 rounded-xl w-fit mx-auto mb-4">
                    <type.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">{type.type}</CardTitle>
                  <CardDescription>{type.count} properties</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <p className="font-bold text-purple-600 mb-4">{type.priceRange}</p>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600">
                    Browse {type.type}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Properties */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Featured Properties</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <Button size="sm" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs">
                    {property.type}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{property.title}</CardTitle>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {property.bedrooms > 0 && (
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        <span>{property.area}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-purple-600">{property.price}</span>
                    <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-600">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Areas */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Popular Areas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularAreas.map((area, index) => (
              <Button key={index} variant="outline" className="p-4 h-auto">
                <div className="text-center">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <span className="font-medium">{area}</span>
                </div>
              </Button>
            ))}
          </div>
        </section>

        {/* Coming Soon Notice */}
        <section className="text-center bg-gradient-to-r from-purple-500 to-pink-600 text-white p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Full Platform Coming Soon!</h2>
          <p className="text-lg mb-6 opacity-90">
            We're building the most comprehensive real estate platform in Kenya. Get early access!
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
