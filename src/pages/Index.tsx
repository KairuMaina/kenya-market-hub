
import { ArrowRight, Search, ShoppingCart, Star, Truck, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const Index = () => {
  const categories = [
    { name: 'Electronics', icon: '📱', count: '2,500+ items' },
    { name: 'Fashion', icon: '👕', count: '1,800+ items' },
    { name: 'Auto Parts', icon: '🔧', count: '950+ items' },
    { name: 'Home & Kitchen', icon: '🏠', count: '1,200+ items' },
    { name: 'Health & Beauty', icon: '💄', count: '800+ items' },
    { name: 'Baby & Kids', icon: '👶', count: '600+ items' },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Samsung Galaxy A54 5G',
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
      name: 'Philips Kitchen Blender',
      price: 8500,
      originalPrice: 11000,
      image: '/placeholder.svg',
      rating: 4.3,
      reviews: 67,
      discount: 23,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-green-600 text-white p-3 sm:p-4">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-bold">KenyaMarket</h1>
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="hover:text-green-200">Home</Link>
                <Link to="/products" className="hover:text-green-200">Products</Link>
                <a href="#" className="hover:text-green-200">Vendors</a>
                <a href="#" className="hover:text-green-200">About</a>
              </nav>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search products..." 
                    className="pl-10 bg-white text-black w-full sm:w-80"
                  />
                </div>
              </div>
              <Button variant="secondary" size="sm" className="px-2 sm:px-4">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Cart</span>
              </Button>
              <Link to="/admin/login">
                <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-green-600">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Kenya's Premier Multi-Vendor Marketplace
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto">
            Discover amazing products from trusted local vendors. From electronics to auto parts, 
            we have everything you need with fast delivery across Kenya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-green-600">
              Become a Vendor
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick delivery across Kenya with M-Pesa payment integration</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-gray-600">Safe and secure transactions with buyer protection</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support in English and Swahili</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{category.icon}</div>
                  <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{category.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Featured Products</h2>
            <Link to="/products">
              <Button variant="outline">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-32 sm:h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 left-2 bg-red-500 text-xs">
                      -{product.discount}%
                    </Badge>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h4 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">{product.name}</h4>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 text-xs">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base sm:text-lg font-bold text-green-600">
                          KSh {product.price.toLocaleString()}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 line-through ml-2">
                          KSh {product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-4">KenyaMarket</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Kenya's leading multi-vendor e-commerce platform connecting buyers with trusted local sellers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white">Electronics</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Fashion</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Auto Parts</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Home & Kitchen</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Payment Methods</h4>
              <div className="text-sm text-gray-400">
                <p>M-Pesa • Visa • MasterCard • PayPal</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 KenyaMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
