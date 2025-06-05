
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [cartItems, setCartItems] = useState(0);

  const categories = [
    { name: 'Electronics', icon: '📱', color: 'bg-blue-100' },
    { name: 'Fashion', icon: '👕', color: 'bg-pink-100' },
    { name: 'Auto Parts', icon: '🚗', color: 'bg-green-100' },
    { name: 'Kitchen & Home', icon: '🏠', color: 'bg-yellow-100' },
    { name: 'Health & Beauty', icon: '💄', color: 'bg-purple-100' },
    { name: 'Baby & Kids', icon: '🍼', color: 'bg-orange-100' },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Samsung Galaxy A54',
      price: 35000,
      originalPrice: 42000,
      image: '/placeholder.svg',
      rating: 4.5,
      reviews: 128,
      discount: 17,
    },
    {
      id: 2,
      name: 'Toyota Corolla Brake Pads',
      price: 4500,
      originalPrice: 6000,
      image: '/placeholder.svg',
      rating: 4.8,
      reviews: 89,
      discount: 25,
    },
    {
      id: 3,
      name: 'Nike Air Max Sneakers',
      price: 12000,
      originalPrice: 15000,
      image: '/placeholder.svg',
      rating: 4.6,
      reviews: 204,
      discount: 20,
    },
    {
      id: 4,
      name: 'Kitchen Blender Set',
      price: 8500,
      originalPrice: 11000,
      image: '/placeholder.svg',
      rating: 4.3,
      reviews: 67,
      discount: 23,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between py-2 text-sm text-gray-600 border-b">
            <div className="flex items-center space-x-4">
              <span>📞 +254 700 000 000</span>
              <span>📧 support@kenyamarket.co.ke</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>🚚 Free delivery in Nairobi</span>
              <span>💳 MPesa accepted</span>
            </div>
          </div>

          {/* Main header */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-green-600">KenyaMarket</Link>
              <Button variant="ghost" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Input 
                  placeholder="Search for products, brands, categories..." 
                  className="pl-10 pr-4"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-red-500">
                    {cartItems}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 py-3">
            <Link to="/products">
              <Button variant="ghost">All Categories</Button>
            </Link>
            <Link to="/products">
              <Button variant="ghost">Electronics</Button>
            </Link>
            <Link to="/products">
              <Button variant="ghost">Fashion</Button>
            </Link>
            <Link to="/products">
              <Button variant="ghost">Auto Parts</Button>
            </Link>
            <Link to="/products">
              <Button variant="ghost">Home & Kitchen</Button>
            </Link>
            <Link to="/products">
              <Button variant="ghost">Health & Beauty</Button>
            </Link>
            <Button variant="ghost">Become a Seller</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl lg:text-6xl font-bold mb-4">
                Shop Everything in Kenya
              </h2>
              <p className="text-xl mb-6 opacity-90">
                From electronics to auto parts, fashion to home goods. 
                Get the best deals with free delivery and MPesa payments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                    Start Shopping
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  Become a Vendor
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="/placeholder.svg" 
                alt="Shopping illustration" 
                className="w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Shop by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link to="/products" key={index}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center text-2xl mx-auto mb-3`}>
                      {category.icon}
                    </div>
                    <h4 className="font-semibold">{category.name}</h4>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-bold">Featured Products</h3>
            <Link to="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {product.discount > 0 && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        -{product.discount}%
                      </Badge>
                    )}
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold mb-2 line-clamp-2">{product.name}</h4>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 text-sm">
                        {'★'.repeat(Math.floor(product.rating))}
                        {'☆'.repeat(5 - Math.floor(product.rating))}
                      </div>
                      <span className="text-sm text-gray-500 ml-1">
                        ({product.reviews})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-green-600">
                          KSh {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            KSh {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => setCartItems(prev => prev + 1)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                🚚
              </div>
              <h4 className="text-xl font-semibold mb-2">Free Delivery</h4>
              <p className="text-gray-600">Free delivery within Nairobi for orders above KSh 2,000</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                💳
              </div>
              <h4 className="text-xl font-semibold mb-2">MPesa Payments</h4>
              <p className="text-gray-600">Pay conveniently using MPesa, Visa, or PayPal</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                🛡️
              </div>
              <h4 className="text-xl font-semibold mb-2">Secure Shopping</h4>
              <p className="text-gray-600">Your data and payments are protected with encryption</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-xl font-bold text-green-400 mb-4">KenyaMarket</h5>
              <p className="text-gray-300 mb-4">
                Kenya's premier e-commerce platform connecting buyers and sellers across the country.
              </p>
              <div className="flex space-x-4">
                <Button size="icon" variant="ghost" className="text-white hover:text-green-400">
                  📘
                </Button>
                <Button size="icon" variant="ghost" className="text-white hover:text-green-400">
                  📷
                </Button>
                <Button size="icon" variant="ghost" className="text-white hover:text-green-400">
                  🐦
                </Button>
              </div>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Quick Links</h6>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-green-400">About Us</a></li>
                <li><a href="#" className="hover:text-green-400">Contact</a></li>
                <li><a href="#" className="hover:text-green-400">Become a Seller</a></li>
                <li><a href="#" className="hover:text-green-400">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Categories</h6>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-green-400">Electronics</a></li>
                <li><a href="#" className="hover:text-green-400">Fashion</a></li>
                <li><a href="#" className="hover:text-green-400">Auto Parts</a></li>
                <li><a href="#" className="hover:text-green-400">Home & Kitchen</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Contact Info</h6>
              <ul className="space-y-2 text-gray-300">
                <li>📞 +254 700 000 000</li>
                <li>📧 support@kenyamarket.co.ke</li>
                <li>📍 Nairobi, Kenya</li>
                <li>🕒 Mon-Fri: 8AM-6PM</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 KenyaMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
