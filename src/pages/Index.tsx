
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Building, 
  Car, 
  Wrench, 
  Stethoscope, 
  Shield, 
  UtensilsCrossed, 
  Calendar, 
  Briefcase, 
  MessageCircle,
  ArrowRight,
  Star,
  Users,
  Zap,
  Heart,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { useNavigate } from 'react-router-dom';
import { useHomeStats } from '@/hooks/useHomeStats';
import LoadingSpinner from '@/components/LoadingSpinner';

const Index = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useHomeStats();

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const heroSlides = [
    {
      id: 1,
      title: "Kenya's Complete Digital Marketplace",
      subtitle: "Everything you need in one place",
      description: "From shopping to services, we connect you to the best Kenya has to offer",
      image: "photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      cta: "Start Shopping",
      ctaAction: () => navigate('/shop')
    },
    {
      id: 2,
      title: "Find Your Dream Property",
      subtitle: "Real Estate Made Simple",
      description: "Discover homes and commercial properties across Kenya's prime locations",
      image: "photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      cta: "Browse Properties",
      ctaAction: () => navigate('/real-estate')
    },
    {
      id: 3,
      title: "Professional Services at Your Fingertips",
      subtitle: "Trusted Service Providers",
      description: "Connect with verified professionals for all your service needs",
      image: "photo-1473091534298-04dcbce3278c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      cta: "Book Services",
      ctaAction: () => navigate('/services')
    },
    {
      id: 4,
      title: "Ride & Delivery Solutions",
      subtitle: "Get Moving with Ease",
      description: "Safe, reliable transportation and delivery services across Kenya",
      image: "photo-1487887235947-a955ef187fcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      cta: "Book a Ride",
      ctaAction: () => navigate('/rides')
    },
    {
      id: 5,
      title: "Join Our Growing Community",
      subtitle: "Become a Partner",
      description: "Grow your business with thousands of customers across Kenya",
      image: "photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      cta: "Become a Partner",
      ctaAction: () => navigate('/service-hub')
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = heroSlides[currentSlide];

  const miniApps = [
    {
      id: 'ecommerce',
      title: 'E-commerce',
      description: 'Buy and sell products online',
      icon: ShoppingBag,
      color: 'from-orange-500 to-red-500',
      route: '/shop',
      image: 'photo-1649972904349-6e44c42644a7',
      stats: `${stats?.products || 0}+ Products`
    },
    {
      id: 'real-estate',
      title: 'Real Estate',
      description: 'Find your dream home or property',
      icon: Building,
      color: 'from-orange-500 to-red-500',
      route: '/real-estate',
      image: 'photo-1483058712412-4245e9b90334',
      stats: `${stats?.properties || 0}+ Properties`
    },
    {
      id: 'transportation',
      title: 'Transportation',
      description: 'Book rides and delivery services',
      icon: Car,
      color: 'from-orange-500 to-red-500',
      route: '/rides',
      image: 'photo-1487887235947-a955ef187fcc',
      stats: `${stats?.rides || 0}+ Rides`
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Book professional services and experts',
      icon: Wrench,
      color: 'from-orange-500 to-red-500',
      route: '/services',
      image: 'photo-1473091534298-04dcbce3278c',
      stats: `${stats?.vendors || 0}+ Providers`
    },
    {
      id: 'medical',
      title: 'Medical',
      description: 'Access health services and appointments',
      icon: Stethoscope,
      color: 'from-orange-500 to-red-500',
      route: '/medical',
      image: 'photo-1581090464777-f3220bbe1b8b',
      stats: '0+ Doctors'
    },
    {
      id: 'insurance',
      title: 'Insurance',
      description: 'Compare and subscribe to insurance plans',
      icon: Shield,
      color: 'from-orange-500 to-red-500',
      route: '/insurance',
      image: 'photo-1524230572899-a752b3835840',
      stats: '0+ Plans'
    },
    {
      id: 'food',
      title: 'Food Delivery',
      description: 'Order from restaurants',
      icon: UtensilsCrossed,
      color: 'from-orange-500 to-red-500',
      route: '/food',
      image: 'photo-1721322800607-8c38375eef04',
      stats: `${stats?.vendors || 0}+ Restaurants`
    },
    {
      id: 'events',
      title: 'Events',
      description: 'Book and discover events',
      icon: Calendar,
      color: 'from-orange-500 to-red-500',
      route: '/events',
      image: 'photo-1605810230434-7631ac76ec81',
      stats: '0+ Events'
    },
    {
      id: 'jobs',
      title: 'Job Board',
      description: 'Apply for jobs and hire talent',
      icon: Briefcase,
      color: 'from-orange-500 to-red-500',
      route: '/jobs',
      image: 'photo-1486312338219-ce68d2c6f44d',
      stats: '0+ Jobs'
    },
    {
      id: 'chat',
      title: 'Chat & Forums',
      description: 'Chat privately or post in community groups',
      icon: MessageCircle,
      color: 'from-orange-500 to-red-500',
      route: '/chat-forums',
      image: 'photo-1460925895917-afdab827c52f',
      stats: `${stats?.users || 0}+ Members`
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Quick and responsive platform for all your needs'
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Join thousands of verified users across Kenya'
    },
    {
      icon: Heart,
      title: 'Local First',
      description: 'Supporting local businesses and communities'
    }
  ];

  if (statsLoading) {
    return (
      <FrontendLayout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* New Modern Hero Section with Slideshow */}
        <div className="relative h-[80vh] min-h-[600px] overflow-hidden">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/${currentSlideData.image})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          
          {/* Navigation Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-4 right-4 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>

          {/* Hero Content */}
          <div className="relative z-10 flex items-center justify-center h-full px-4">
            <div className="text-center text-white max-w-4xl mx-auto">
              {/* Logo */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <img 
                    alt="Soko Smart Logo" 
                    src="/lovable-uploads/563ee6fb-f94f-43f3-a4f3-a61873a1b491.png" 
                    className="w-16 h-16 object-contain" 
                  />
                </div>
              </div>

              {/* Brand Name */}
              <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
                Soko Smart
              </h1>

              {/* Slide Content */}
              <div className="animate-fade-in" key={currentSlide}>
                <p className="text-orange-200 text-lg font-medium mb-2">
                  {currentSlideData.subtitle}
                </p>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  {currentSlideData.title}
                </h2>
                <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
                  {currentSlideData.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={currentSlideData.ctaAction}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg shadow-lg"
                  >
                    {currentSlideData.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/service-hub')}
                    className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg"
                  >
                    Become a Partner
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide 
                    ? 'bg-white shadow-lg scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Mini Apps Grid */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              All Services in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From shopping to services, we've got everything you need to live, work, and thrive in Kenya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {miniApps.map((app) => (
              <Card 
                key={app.id} 
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-200 cursor-pointer"
                onClick={() => navigate(app.route)}
              >
                <div className="relative overflow-hidden">
                  <div 
                    className="h-32 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(https://images.unsplash.com/${app.image})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-gray-800">
                      {app.stats}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${app.color} text-white`}>
                      <app.icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg group-hover:text-orange-600 transition-colors">
                    {app.title}
                  </CardTitle>
                  <CardDescription>
                    {app.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className={`w-full bg-gradient-to-r ${app.color} hover:opacity-90 text-white`}
                  >
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Section */}
          <div className="bg-gray-50 rounded-3xl p-8 mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Soko Smart?
              </h3>
              <p className="text-lg text-gray-600">
                Built for Kenya, by Kenyans
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-lg text-orange-100 mb-6">
                  Join thousands of Kenyans who trust Soko Smart for their daily needs
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => navigate('/auth')}
                    className="bg-white text-orange-600 hover:bg-orange-50"
                  >
                    Sign Up Free
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/service-hub')}
                    className="border-white text-white hover:bg-white hover:text-orange-600"
                  >
                    Become a Partner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Index;
