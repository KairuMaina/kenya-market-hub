
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, Search, MapPin, Clock, Star, ShoppingCart } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { useRestaurants, useFoodCategories } from '@/hooks/useRestaurants';
import LoadingSpinner from '@/components/LoadingSpinner';

const FoodDelivery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: restaurants, isLoading: restaurantsLoading } = useRestaurants();
  const { data: categories, isLoading: categoriesLoading } = useFoodCategories();

  if (restaurantsLoading || categoriesLoading) {
    return (
      <FrontendLayout>
        <div className="min-h-screen bg-orange-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-orange-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <UtensilsCrossed className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4">Food Delivery & Grocery</h1>
              <p className="text-xl text-orange-100 mb-8">
                Delicious meals and fresh groceries delivered to your doorstep
              </p>
              
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search restaurants or groceries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white text-gray-900"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Delivery location"
                    className="pl-10 bg-white text-gray-900 md:w-64"
                  />
                </div>
                <Button className="bg-white text-orange-600 hover:bg-orange-50">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id 
                    ? 'bg-orange-500 hover:bg-orange-600' 
                    : 'border-orange-200 hover:bg-orange-50'
                  }
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>

          {/* Restaurants */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Restaurants & Vendors</h2>
            {restaurants && restaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {restaurants.map((restaurant) => (
                  <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow border-orange-200">
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center">
                        <UtensilsCrossed className="h-12 w-12 text-white" />
                      </div>
                      <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">
                        {restaurant.verification_status}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{restaurant.business_name}</CardTitle>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Business</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>New</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>Coming Soon</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>Location</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Available Soon</span>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <UtensilsCrossed className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Restaurants Yet</h3>
                <p className="text-gray-500">Restaurants will appear here once they register and get approved.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default FoodDelivery;
