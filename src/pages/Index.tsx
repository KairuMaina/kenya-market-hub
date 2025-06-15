
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/MainLayout';
import { 
  Globe, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  ShoppingBag, 
  Building, 
  Car
} from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  // Service-specific hero images
  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      service: 'Shop',
      title: 'Shop Smart with Soko',
      description: 'Discover amazing products from trusted vendors',
      action: 'Start Shopping',
      path: '/shop',
      icon: ShoppingBag
    },
    {
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ix=4&ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      service: 'Real Estate',
      title: 'Find Your Dream Property',
      description: 'Explore homes and investments across Kenya',
      action: 'Browse Properties',
      path: '/real-estate',
      icon: Building
    },
    {
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      service: 'Transport',
      title: 'Reliable Transportation',
      description: 'Book rides with verified drivers',
      action: 'Book a Ride',
      path: '/rides',
      icon: Car
    },
    {
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      service: 'Services',
      title: 'Professional Services',
      description: 'Connect with skilled service providers',
      action: 'Find Services',
      path: '/services',
      icon: ShieldCheck
    }
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const currentSlide = heroSlides[currentSlideIndex];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Enhanced Hero Section with Service-Specific Slideshow */}
        <section className="relative h-[70vh] rounded-xl overflow-hidden shadow-lg animate-fade-in">
          <div className="absolute inset-0">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlideIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.service}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
              </div>
            ))}
          </div>
          
          <div className="relative z-10 h-full flex items-center justify-center text-center text-white p-6">
            <div className="max-w-4xl animate-scale-in">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm mr-4">
                  <currentSlide.icon className="h-8 w-8" />
                </div>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                  {currentSlide.service}
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {currentSlide.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                {currentSlide.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate(currentSlide.path)}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-4"
                >
                  <currentSlide.icon className="mr-2 h-5 w-5" />
                  {currentSlide.action}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/auth')}
                  className="bg-white text-black border-2 border-white hover:bg-gray-100 hover:text-black transition-all duration-300 px-8 py-4 font-semibold"
                >
                  Join Soko Smart
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Slideshow Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {heroSlides.map((slide, index) => (
              <button
                key={index}
                className={`group flex flex-col items-center transition-all duration-300 ${
                  index === currentSlideIndex ? 'opacity-100' : 'opacity-60 hover:opacity-80'
                }`}
                onClick={() => setCurrentSlideIndex(index)}
              >
                <div className={`w-3 h-3 rounded-full mb-1 transition-all duration-300 ${
                  index === currentSlideIndex ? 'bg-white scale-125' : 'bg-white/70'
                }`} />
                <span className="text-xs text-white/80 font-medium">{slide.service}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Key Features Section */}
        <section className="animate-slide-in-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Everything You Need in One Place</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive platform designed to serve all your business and personal needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate(feature.path)}
              >
                <CardHeader className="text-center pb-3">
                  <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 text-sm mb-3">{feature.desc}</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs"
                  >
                    Explore <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
