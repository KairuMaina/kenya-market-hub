
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Shield, Truck, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { useState, useEffect } from "react";

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const brandLogos = [
    { name: "Samsung", logo: "📱", color: "bg-blue-100" },
    { name: "Tecno", logo: "📞", color: "bg-green-100" },
    { name: "Toyota", logo: "🚗", color: "bg-red-100" },
    { name: "Infinix", logo: "📲", color: "bg-purple-100" },
    { name: "Nike", logo: "👟", color: "bg-orange-100" },
    { name: "Shea Moisture", logo: "💄", color: "bg-pink-100" }
  ];

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      title: "Lightning Fast",
      description: "Quick delivery across Kenya within 24-48 hours"
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Secure Payments",
      description: "Multiple payment options including M-Pesa, PayPal & Stripe"
    },
    {
      icon: <Truck className="h-8 w-8 text-green-500" />,
      title: "Free Shipping",
      description: "Free delivery on orders above KSH 5,000"
    },
    {
      icon: <Headphones className="h-8 w-8 text-purple-500" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support team"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % brandLogos.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % brandLogos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + brandLogos.length) % brandLogos.length);
  };

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-red-500/10 to-pink-500/10" />
          <div className="relative px-6 py-16 md:py-24 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Kenya's Premier
                <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"> Digital Marketplace</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Discover quality products from trusted vendors. Electronics, fashion, beauty, auto parts and more - all in one place.
              </p>
              
              {/* Brand Slideshow */}
              <div className="relative max-w-md mx-auto mb-8">
                <div className="flex items-center justify-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <button onClick={prevSlide} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <div className={`flex items-center space-x-3 px-6 py-3 rounded-xl text-black ${brandLogos[currentSlide].color} shadow-sm`}>
                    <span className="text-3xl">{brandLogos[currentSlide].logo}</span>
                    <span className="font-semibold text-lg">{brandLogos[currentSlide].name}</span>
                  </div>
                  
                  <button onClick={nextSlide} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex justify-center mt-4 space-x-2">
                  {brandLogos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentSlide ? 'bg-orange-500 scale-110' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all">
                    Start Shopping
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-6 text-lg rounded-xl">
                    Join Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-gray-50 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our diverse range of products across multiple categories, carefully curated for quality and value.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Electronics", icon: "📱", color: "bg-blue-50 border-blue-200" },
              { name: "Fashion", icon: "👗", color: "bg-pink-50 border-pink-200" },
              { name: "Beauty", icon: "💄", color: "bg-purple-50 border-purple-200" },
              { name: "Auto Parts", icon: "🚗", color: "bg-green-50 border-green-200" }
            ].map((category, index) => (
              <Link key={index} to="/products" className="group">
                <Card className={`${category.color} border-2 hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-8 rounded-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Soko Smart for their shopping needs.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {[
              { label: "Products", value: "2M+" },
              { label: "Vendors", value: "50K+" },
              { label: "Customers", value: "1M+" },
              { label: "Support", value: "24/7" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-orange-400">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>

          <Link to="/products">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg">
              Explore Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
