
import React, { useState } from 'react';
import { UtensilsCrossed, Star, Clock, MapPin } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRestaurants } from '@/hooks/useRestaurants';
import HeroSection from '@/components/shared/HeroSection';

const FoodDelivery: React.FC = () => {
  const { data: restaurants = [], isLoading } = useRestaurants();
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);

  const handleRestaurantClick = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    // Here you would typically navigate to the restaurant menu
    console.log('Navigate to restaurant menu:', restaurant);
  };

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <HeroSection
          title="Food Delivery & Restaurants"
          subtitle="Delicious meals delivered"
          description="Order from verified restaurants across Kenya"
          imageUrl="photo-1504674900247-0877df9cc836"
          className="mb-0 rounded-b-2xl h-64 px-6 py-8"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading restaurants...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restaurants.map((restaurant) => (
                <Card 
                  key={restaurant.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-orange-200 bg-white rounded-xl overflow-hidden"
                  onClick={() => handleRestaurantClick(restaurant)}
                >
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {restaurant.banner_url ? (
                      <img 
                        src={restaurant.banner_url} 
                        alt={restaurant.business_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop)` }}
                      >
                        <div className="w-full h-full bg-black bg-opacity-20 flex items-center justify-center">
                          <UtensilsCrossed className="h-12 w-12 text-white" />
                        </div>
                      </div>
                    )}
                    {restaurant.logo_url && (
                      <div className="absolute bottom-2 left-2 w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                        <img 
                          src={restaurant.logo_url} 
                          alt={`${restaurant.business_name} logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-900 line-clamp-1">
                      {restaurant.business_name}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <MapPin className="h-3 w-3 text-orange-500" />
                      <span className="truncate">{restaurant.business_address || 'Kenya'}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2 pt-0">
                    <p className="text-xs text-gray-700 line-clamp-2">
                      {restaurant.business_description || 'Delicious food delivered to your doorstep'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium">4.5</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600">25-35 min</span>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="bg-green-100 text-green-800 text-xs"
                      >
                        Open
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </FrontendLayout>
  );
};

export default FoodDelivery;
