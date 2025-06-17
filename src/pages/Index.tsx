
import React from 'react';
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
  Heart
} from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const miniApps = [
    {
      id: 'ecommerce',
      title: 'E-commerce',
      description: 'Buy and sell products online',
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600',
      route: '/shop',
      image: 'photo-1649972904349-6e44c42644a7',
      stats: '50k+ Products'
    },
    {
      id: 'real-estate',
      title: 'Real Estate',
      description: 'Find your dream home or property',
      icon: Building,
      color: 'from-green-500 to-green-600',
      route: '/real-estate',
      image: 'photo-1483058712412-4245e9b90334',
      stats: '15k+ Properties'
    },
    {
      id: 'transportation',
      title: 'Transportation',
      description: 'Book rides and delivery services',
      icon: Car,
      color: 'from-yellow-500 to-yellow-600',
      route: '/rides',
      image: 'photo-1487887235947-a955ef187fcc',
      stats: '5k+ Drivers'
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Book professional services and experts',
      icon: Wrench,
      color: 'from-purple-500 to-purple-600',
      route: '/services',
      image: 'photo-1473091534298-04dcbce3278c',
      stats: '2k+ Providers'
    },
    {
      id: 'medical',
      title: 'Medical',
      description: 'Access health services and appointments',
      icon: Stethoscope,
      color: 'from-red-500 to-red-600',
      route: '/medical',
      image: 'photo-1581090464777-f3220bbe1b8b',
      stats: '800+ Doctors'
    },
    {
      id: 'insurance',
      title: 'Insurance',
      description: 'Compare and subscribe to insurance plans',
      icon: Shield,
      color: 'from-indigo-500 to-indigo-600',
      route: '/insurance',
      image: 'photo-1524230572899-a752b3835840',
      stats: '50+ Plans'
    },
    {
      id: 'food',
      title: 'Food Delivery',
      description: 'Order from restaurants',
      icon: UtensilsCrossed,
      color: 'from-orange-500 to-orange-600',
      route: '/food',
      image: 'photo-1721322800607-8c38375eef04',
      stats: '1k+ Restaurants'
    },
    {
      id: 'events',
      title: 'Events',
      description: 'Book and discover events',
      icon: Calendar,
      color: 'from-pink-500 to-pink-600',
      route: '/events',
      image: 'photo-1605810230434-7631ac76ec81',
      stats: '300+ Events'
    },
    {
      id: 'jobs',
      title: 'Job Board',
      description: 'Apply for jobs and hire talent',
      icon: Briefcase,
      color: 'from-teal-500 to-teal-600',
      route: '/jobs',
      image: 'photo-1486312338219-ce68d2c6f44d',
      stats: '2k+ Jobs'
    },
    {
      id: 'chat',
      title: 'Chat & Forums',
      description: 'Chat privately or post in community groups',
      icon: MessageCircle,
      color: 'from-cyan-500 to-cyan-600',
      route: '/chat-forums',
      image: 'photo-1460925895917-afdab827c52f',
      stats: '10k+ Members'
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

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <img 
                  alt="Soko Smart Logo" 
                  src="/lovable-uploads/563ee6fb-f94f-43f3-a4f3-a61873a1b491.png" 
                  className="w-12 h-12 object-contain" 
                />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Soko Smart
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Kenya's Complete Digital Marketplace - Everything you need in one place
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/shop')}
                className="bg-white text-orange-600 hover:bg-orange-50"
              >
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
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
