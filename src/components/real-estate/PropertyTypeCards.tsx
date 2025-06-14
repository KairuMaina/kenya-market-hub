
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Home } from 'lucide-react';

const PropertyTypeCards: React.FC = () => {
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

  return (
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
  );
};

export default PropertyTypeCards;
