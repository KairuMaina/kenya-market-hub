
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Star, 
  Heart,
  ShoppingCart,
  TrendingUp,
  Award,
  Shield,
  Zap,
  Plus,
  Minus
} from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { useProducts } from '@/hooks/useProducts';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const Shop: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addToCart, items, updateQuantity } = useCart();
  const { toast } = useToast();
  
  const { data: products, isLoading } = useProducts({
    searchQuery: searchTerm,
    category: selectedCategory,
    limit: 20
  });

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Automotive',
    'Beauty',
    'Toys'
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Your transactions are protected'
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Quick delivery across Kenya'
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: 'Only verified vendors'
    }
  ];

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || '/placeholder-product.jpg',
      vendor: product.vendor || 'Unknown Vendor'
    });
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`
    });
  };

  const getCartQuantity = (productId: string) => {
    const item = items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      updateQuantity(productId, 0);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-orange-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Shop Smart, Shop Local
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Discover amazing products from verified Kenyan vendors
              </p>
              
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white text-gray-900"
                  />
                </div>
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Shop by Category</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
                className={selectedCategory === '' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'border-blue-200 hover:bg-blue-50'
                }
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'border-blue-200 hover:bg-blue-50'
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
              </h2>
              <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                  const cartQuantity = getCartQuantity(product.id);
                  
                  return (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img 
                          src={product.image_url || '/placeholder-product.jpg'} 
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600 ml-1">
                              {product.rating || 0} ({product.reviews_count || 0})
                            </span>
                          </div>
                          {product.in_stock && (
                            <Badge variant="secondary" className="text-green-600">
                              In Stock
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">
                              KSh {Number(product.price).toLocaleString()}
                            </span>
                            {product.original_price && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                KSh {Number(product.original_price).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {cartQuantity > 0 ? (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuantityChange(product.id, cartQuantity - 1)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-medium w-8 text-center">{cartQuantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuantityChange(product.id, cartQuantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <span className="text-sm text-green-600 font-medium">In Cart</span>
                            </div>
                          ) : (
                            <Button 
                              className="w-full bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.in_stock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchTerm || selectedCategory ? 'No Products Found' : 'No Products Yet'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm || selectedCategory 
                    ? 'Try adjusting your search or category filter.' 
                    : 'Products will appear here once vendors start adding them.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Why Shop With Us?
              </h3>
              <p className="text-lg text-gray-600">
                Your trusted marketplace in Kenya
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Shop;
