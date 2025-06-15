import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Star, Truck, Shield, Heart, Search } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useProducts } from '@/hooks/useProducts';
import ShopAdvancedSearch from '@/components/shop/ShopAdvancedSearch';

const Shop = () => {
  const { user } = useAuth();
  const { data: products } = useProducts();
  const featuredProducts = products?.slice(0, 6) || [];
  const [searchFilters, setSearchFilters] = React.useState({});
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = React.useState(false);

  const heroImages = [
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
  ];

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const handleFiltersChange = (filters: any) => {
    setSearchFilters(filters);
    console.log('Applied filters:', filters);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Search query:', query);
  };

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8 lg:space-y-12">
        {/* Hero Section - More prominent on mobile */}
        <section className="relative h-[70vh] sm:h-[75vh] lg:h-[80vh] rounded-xl overflow-hidden shadow-2xl animate-fade-in">
          <div className="absolute inset-0">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={image}
                  alt={`Hero ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            ))}
          </div>
          
          <div className="relative z-10 h-full flex items-center justify-center text-center text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl animate-scale-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                Shop at{' '}
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Soko Smart
                </span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
                Discover amazing products from trusted vendors across Kenya
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/products">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Start Shopping
                  </Button>
                </Link>
                {!user && (
                  <Link to="/auth">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 px-8 py-4 text-lg">
                      Join Today
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Slideshow Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </section>

        {/* Featured Products - Prioritized display */}
        <section className="animate-slide-in-right">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-gray-600">Discover our most popular items</p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="mt-4 sm:mt-0 border-orange-500 text-orange-600 hover:bg-orange-50 transition-all duration-300">
                <Search className="mr-2 h-4 w-4" />
                View All Products
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredProducts.map((product, index) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-lg overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative overflow-hidden">
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                    alt={product.name}
                    className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs">
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-base sm:text-lg line-clamp-1">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs sm:text-sm">{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 px-4 pb-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs sm:text-sm font-medium">{product.rating}</span>
                      <span className="text-xs text-gray-500">({product.reviews_count})</span>
                    </div>
                    <Badge variant="outline" className="text-xs">{product.category}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg sm:text-xl font-bold text-green-600">
                        KSh {Number(product.price).toLocaleString()}
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through ml-2">
                          KSh {Number(product.original_price).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white transition-all duration-300 hover:scale-105 text-xs px-3 py-2">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Advanced Search Section - Condensed for mobile */}
        <section className="animate-slide-in-up">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Find What You're Looking For</h2>
            <Button 
              variant="outline" 
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="text-sm"
            >
              {showAdvancedSearch ? 'Hide Filters' : 'Advanced Search'}
            </Button>
          </div>
          
          {showAdvancedSearch && (
            <ShopAdvancedSearch 
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
              className="animate-fade-in"
            />
          )}
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 sm:p-8 rounded-xl text-center animate-bounce-in shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Start Shopping?</h2>
          <p className="text-base sm:text-lg mb-4 sm:mb-6 opacity-90">
            Join thousands of satisfied customers and discover amazing deals today!
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 sm:px-8 py-3">
              <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Explore Products
            </Button>
          </Link>
        </section>
      </div>
    </MainLayout>
  );
};

export default Shop;
