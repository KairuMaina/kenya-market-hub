
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
      icon: <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />,
      title: "Lightning Fast",
      description: "Quick delivery across Kenya within 24-48 hours"
    },
    {
      icon: <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />,
      title: "Secure Payments",
      description: "Multiple payment options including M-Pesa, PayPal & Stripe"
    },
    {
      icon: <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />,
      title: "Free Shipping",
      description: "Free delivery on orders above KSH 5,000"
    },
    {
      icon: <Headphones className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />,
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
      <div className="space-y-8 sm:space-y-12 px-2 sm:px-0">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-2xl sm:rounded-3xl animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-red-500/10 to-pink-500/10" />
          <div className="relative px-4 sm:px-6 py-12 sm:py-16 md:py-24 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight animate-slide-in-right">
                Kenya's Premier
                <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent block sm:inline"> Digital Marketplace</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Discover quality products from trusted vendors. Electronics, fashion, beauty, auto parts and more - all in one place.
              </p>
              
              {/* Brand Slideshow */}
              <div className="relative max-w-xs sm:max-w-md mx-auto mb-6 sm:mb-8">
                <div className="flex items-center justify-center space-x-2 sm:space-x-4 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg animate-scale-in">
                  <button onClick={prevSlide} className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  
                  <div className={`flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-black ${brandLogos[currentSlide].color} shadow-sm transform hover:scale-105 transition-transform duration-200`}>
                    <span className="text-2xl sm:text-3xl">{brandLogos[currentSlide].logo}</span>
                    <span className="font-semibold text-base sm:text-lg">{brandLogos[currentSlide].name}</span>
                  </div>
                  
                  <button onClick={nextSlide} className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
                
                <div className="flex justify-center mt-3 sm:mt-4 space-x-2">
                  {brandLogos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                        index === currentSlide ? 'bg-orange-500 scale-110' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Link to="/products">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all animate-pulse">
                    Start Shopping
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl hover:scale-105 transition-all">
                    Join Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="mb-3 sm:mb-4 flex justify-center">
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-full hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 transition-all">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories Preview */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8 animate-fade-in">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Explore our diverse range of products across multiple categories, carefully curated for quality and value.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[
              { name: "Electronics", icon: "📱", color: "bg-blue-50 border-blue-200" },
              { name: "Fashion", icon: "👗", color: "bg-pink-50 border-pink-200" },
              { name: "Beauty", icon: "💄", color: "bg-purple-50 border-purple-200" },
              { name: "Auto Parts", icon: "🚗", color: "bg-green-50 border-green-200" }
            ].map((category, index) => (
              <Link key={index} to="/products" className="group">
                <Card className={`${category.color} border-2 hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:scale-105`}>
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 sm:py-16 px-4 sm:px-8 rounded-xl sm:rounded-2xl text-center animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to Start Shopping?</h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Soko Smart for their shopping needs.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-6 sm:mb-8">
            {[
              { label: "Products", value: "2M+" },
              { label: "Vendors", value: "50K+" },
              { label: "Customers", value: "1M+" },
              { label: "Support", value: "24/7" }
            ].map((stat, index) => (
              <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="text-2xl sm:text-3xl font-bold text-orange-400">{stat.value}</div>
                <div className="text-gray-300 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>

          <Link to="/products">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all">
              Explore Products
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
