
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Search, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  ShoppingBag, 
  Building, 
  Car, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Shield, 
  Headphones,
  Star,
  Heart,
  Zap
} from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section with Image Slideshow */}
        <section className="relative h-[70vh] rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
              </div>
            ))}
          </div>
          
          <div className="relative z-10 h-full flex items-center justify-center text-center text-white p-8">
            <div className="max-w-4xl animate-scale-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Soko Smart
                </span>
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                Your one-stop platform for e-commerce, real estate, transportation, and professional services across Kenya
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/shop')}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-3"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Explore Shop
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/real-estate')}
                  className="border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 px-8 py-3"
                >
                  <Building className="mr-2 h-5 w-5" />
                  Find Properties
                </Button>
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

        {/* Key Features Section */}
        <section className="animate-slide-in-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need in One Place</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive platform designed to serve all your business and personal needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: Globe, 
                title: 'E-commerce', 
                desc: 'Buy and sell products online with ease', 
                color: 'blue',
                path: '/shop'
              },
              { 
                icon: Building, 
                title: 'Real Estate', 
                desc: 'Find your dream home or investment property', 
                color: 'green',
                path: '/real-estate'
              },
              { 
                icon: Truck, 
                title: 'Transportation', 
                desc: 'Book rides and transportation services', 
                color: 'orange',
                path: '/rides'
              },
              { 
                icon: ShieldCheck, 
                title: 'Services', 
                desc: 'Access professional services and experts', 
                color: 'purple',
                path: '/services'
              }
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg cursor-pointer"
                onClick={() => navigate(feature.path)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{feature.desc}</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className={`border-${feature.color}-500 text-${feature.color}-600 hover:bg-${feature.color}-50 transition-all duration-300`}
                  >
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Highlight */}
        <section className="animate-slide-in-left">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Soko Smart?</h2>
            <p className="text-lg text-gray-600">Experience the best of Kenya's digital marketplace</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Secure & Trusted', desc: 'Protected transactions' },
              { icon: Zap, title: 'Fast & Reliable', desc: 'Quick service delivery' },
              { icon: Star, title: 'Quality Assured', desc: 'Verified providers only' },
              { icon: Heart, title: '24/7 Support', desc: 'Always here to help' }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Search Section */}
        <section className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl animate-slide-in-right">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Find What You Need
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Use our powerful search tools to quickly locate products, properties, and services across our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/search')}
              className="border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              <Search className="h-4 w-4 mr-2" />
              Quick Search
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/advanced-search')}
              className="border-purple-500 text-purple-600 hover:bg-purple-50 transition-all duration-300"
            >
              Advanced Search
            </Button>
          </div>
        </section>

        {/* Service Provider Section */}
        <section className="animate-bounce-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Our Network of Service Providers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Grow your business and reach thousands of customers across Kenya. Join our trusted network of vendors, drivers, and property owners.
            </p>
            <Badge className="mt-4 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2">
              <Users className="mr-2 h-4 w-4" />
              10,000+ Trusted Providers
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {[
              {
                title: 'Vendor',
                desc: 'Sell your products to a wider audience and grow your business',
                color: 'orange',
                icon: ShoppingBag,
                gradient: 'from-orange-500 to-red-600'
              },
              {
                title: 'Driver',
                desc: 'Provide transportation services and earn competitive income',
                color: 'blue',
                icon: Car,
                gradient: 'from-blue-500 to-blue-600'
              },
              {
                title: 'Property Owner',
                desc: 'Manage and rent out your properties with professional tools',
                color: 'green',
                icon: Building,
                gradient: 'from-green-500 to-green-600'
              }
            ].map((provider, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg overflow-hidden"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`h-2 bg-gradient-to-r ${provider.gradient}`} />
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${provider.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <provider.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    {provider.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6">{provider.desc}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/vendor-dashboard')}
                    className={`border-${provider.color}-500 text-${provider.color}-600 hover:bg-${provider.color}-50 transition-all duration-300 w-full`}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button
              onClick={() => navigate('/service-provider-hub')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Access Service Provider Apps
            </Button>
            <p className="text-gray-600 mt-3 text-sm">
              Already approved? Access your dedicated service provider interface
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-2xl text-center animate-pulse-glow shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers and service providers on Kenya's leading digital platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-3">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Start Shopping
              </Button>
            </Link>
            <Link to="/vendor-dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 transition-all duration-300 px-8 py-3">
                <TrendingUp className="mr-2 h-5 w-5" />
                Become a Provider
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
