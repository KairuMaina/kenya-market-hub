
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Truck, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";

const Index = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Samsung Galaxy A54",
      price: "KSh 35,000",
      originalPrice: "KSh 42,000",
      image: "/placeholder.svg",
      rating: 4.5,
      reviews: 128,
      discount: "17% OFF",
      vendor: "TechHub Kenya"
    },
    {
      id: 2,
      name: "Toyota Corolla Brake Pads",
      price: "KSh 4,500",
      originalPrice: "KSh 6,000",
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 64,
      discount: "25% OFF",
      vendor: "AutoSpare Kenya"
    },
    {
      id: 3,
      name: "Women's Fashion Dress",
      price: "KSh 2,800",
      originalPrice: "KSh 3,500",
      image: "/placeholder.svg",
      rating: 4.3,
      reviews: 89,
      discount: "20% OFF",
      vendor: "StyleHub"
    },
    {
      id: 4,
      name: "Kitchen Blender Set",
      price: "KSh 8,900",
      originalPrice: "KSh 12,000",
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 156,
      discount: "26% OFF",
      vendor: "HomeEssentials"
    }
  ];

  const categories = [
    { name: "Electronics", icon: "📱", count: "2,450+" },
    { name: "Fashion", icon: "👗", count: "1,800+" },
    { name: "Auto Parts", icon: "🚗", count: "1,200+" },
    { name: "Home & Kitchen", icon: "🏠", count: "980+" },
    { name: "Health & Beauty", icon: "💄", count: "650+" },
    { name: "Baby & Kids", icon: "🍼", count: "420+" }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-8 rounded-lg">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Kenya's Smart Marketplace
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Everything you need, from electronics to auto parts - all in one place
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Shop Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
                Become a Vendor
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Same-day delivery in Nairobi, 2-3 days nationwide</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600">MPesa, Visa, PayPal - your payments are protected</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Vendors</h3>
              <p className="text-gray-600">Verified sellers and quality products guaranteed</p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Shop by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer bg-white border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                  <p className="text-sm text-gray-600">{category.count} items</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Featured Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow bg-white border-gray-200">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      {product.discount}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{product.vendor}</p>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">{product.rating} ({product.reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-900">{product.price}</span>
                        <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 px-8 rounded-lg">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Start Selling?</h3>
            <p className="text-xl mb-8 opacity-90">Join thousands of vendors on Kenya's fastest-growing marketplace</p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Register as Vendor
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
