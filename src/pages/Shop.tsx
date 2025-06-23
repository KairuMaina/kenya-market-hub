
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingBag, Star, Filter } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'All Categories', 'Electronics', 'Fashion', 'Home & Garden', 
    'Sports', 'Books', 'Automotive', 'Beauty', 'Toys'
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 'KSH 3,500',
      image: 'photo-1505740420928-5e560c06d30e',
      rating: 4.5,
      reviews: 128
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 'KSH 8,900',
      image: 'photo-1523275335684-37898b6baf30',
      rating: 4.8,
      reviews: 89
    },
    {
      id: 3,
      name: 'Premium Coffee Beans',
      price: 'KSH 1,200',
      image: 'photo-1559056199-641a0ac8b55e',
      rating: 4.3,
      reviews: 67
    },
    {
      id: 4,
      name: 'Organic Skincare Set',
      price: 'KSH 2,800',
      image: 'photo-1556228453-efd6c1ff04f6',
      rating: 4.7,
      reviews: 145
    }
  ];

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <div className="mb-6">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Shop Smart, Shop Local</h1>
            <p className="text-lg mb-8 text-blue-100">
              Discover amazing products from verified Kenyan vendors
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button className="bg-white text-blue-600 hover:bg-blue-50 h-12 px-6">
                Search
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Button
                  key={category}
                  variant={index === 0 ? "default" : "outline"}
                  className={`text-sm h-9 ${
                    index === 0 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
            <Button variant="outline" className="text-sm h-9">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Featured Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-all duration-300 border hover:border-orange-200">
                <div className="relative overflow-hidden">
                  <div 
                    className="h-40 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(https://images.unsplash.com/${product.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80)`,
                    }}
                  />
                  <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-xs">
                    New
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">({product.reviews})</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">{product.price}</span>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View All Products Button */}
          <div className="text-center mt-8">
            <Button 
              onClick={() => navigate('/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              View All Products
            </Button>
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Shop;
