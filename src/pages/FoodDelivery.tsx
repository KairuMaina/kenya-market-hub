
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, Search, MapPin, Clock, Star, ShoppingCart } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';

const FoodDelivery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', count: 150 },
    { id: 'fastfood', name: 'Fast Food', count: 45 },
    { id: 'pizza', name: 'Pizza', count: 28 },
    { id: 'african', name: 'African', count: 32 },
    { id: 'indian', name: 'Indian', count: 18 },
    { id: 'chinese', name: 'Chinese', count: 15 },
    { id: 'healthy', name: 'Healthy', count: 22 },
    { id: 'desserts', name: 'Desserts', count: 12 }
  ];

  const restaurants = [
    {
      id: 1,
      name: 'Mama Mboga Kitchen',
      cuisine: 'African',
      rating: 4.8,
      deliveryTime: '25-35 min',
      deliveryFee: 150,
      image: '/placeholder.svg',
      featured: true,
      discount: '20% OFF',
      location: 'Westlands'
    },
    {
      id: 2,
      name: 'Pizza Palace',
      cuisine: 'Italian',
      rating: 4.6,
      deliveryTime: '30-40 min',
      deliveryFee: 200,
      image: '/placeholder.svg',
      featured: false,
      location: 'CBD'
    },
    {
      id: 3,
      name: 'Spice Route',
      cuisine: 'Indian',
      rating: 4.7,
      deliveryTime: '35-45 min',
      deliveryFee: 180,
      image: '/placeholder.svg',
      featured: true,
      discount: '15% OFF',
      location: 'Kilimani'
    },
    {
      id: 4,
      name: 'Nyama Choma Corner',
      cuisine: 'African',
      rating: 4.5,
      deliveryTime: '20-30 min',
      deliveryFee: 120,
      image: '/placeholder.svg',
      featured: false,
      location: 'Karen'
    }
  ];

  const groceryStores = [
    {
      id: 1,
      name: 'Fresh Mart',
      category: 'Supermarket',
      rating: 4.6,
      deliveryTime: '45-60 min',
      deliveryFee: 100,
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Organic Valley',
      category: 'Organic',
      rating: 4.8,
      deliveryTime: '60-90 min',
      deliveryFee: 150,
      image: '/placeholder.svg'
    }
  ];

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
              {categories.map((category) => (
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

          {/* Featured Restaurants */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Featured Restaurants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restaurants.map((restaurant) => (
                <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow border-orange-200">
                  <div className="relative">
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name}
                      className="w-full h-48 object-cover"
                    />
                    {restaurant.discount && (
                      <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                        {restaurant.discount}
                      </Badge>
                    )}
                    {restaurant.featured && (
                      <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{restaurant.cuisine}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{restaurant.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{restaurant.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Delivery: KSh {restaurant.deliveryFee}</span>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Grocery Stores */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Grocery Stores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groceryStores.map((store) => (
                <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow border-orange-200">
                  <div className="relative">
                    <img 
                      src={store.image} 
                      alt={store.name}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{store.category}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{store.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{store.deliveryTime}</span>
                      </div>
                      <span>Delivery: KSh {store.deliveryFee}</span>
                    </div>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      Shop Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default FoodDelivery;
