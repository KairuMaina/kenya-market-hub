
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Car, Wrench, Home, Star, Shield, Heart, Clock } from 'lucide-react';
import MainLayout from '@/components/MainLayout';

const Index = () => {
  const { user } = useAuth();

  const services = [
    {
      id: 'shop',
      title: 'Shop',
      description: 'Browse and buy products from trusted vendors across Kenya',
      icon: ShoppingBag,
      color: 'from-orange-500 to-red-600',
      hoverColor: 'hover:from-orange-600 hover:to-red-700',
      link: '/shop',
      features: ['Secure payments', 'Fast delivery', 'Quality products']
    },
    {
      id: 'rides',
      title: 'Rides',
      description: 'Book taxis and motorbikes for quick transportation',
      icon: Car,
      color: 'from-blue-500 to-indigo-600',
      hoverColor: 'hover:from-blue-600 hover:to-indigo-700',
      link: '/rides',
      features: ['Real-time tracking', 'Fair pricing', 'Safe drivers']
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Hire skilled technicians for home and office repairs',
      icon: Wrench,
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700',
      link: '/services',
      features: ['Verified technicians', 'Fixed pricing', 'Quality guarantee']
    },
    {
      id: 'real-estate',
      title: 'Real Estate',
      description: 'Find your perfect home or investment property',
      icon: Home,
      color: 'from-purple-500 to-violet-600',
      hoverColor: 'hover:from-purple-600 hover:to-violet-700',
      link: '/real-estate',
      features: ['Prime locations', 'Virtual tours', 'Expert guidance']
    },
  ];

  const stats = [
    { label: 'Happy Customers', value: '50K+', icon: Star },
    { label: 'Services Available', value: '4', icon: Shield },
    { label: 'Cities Covered', value: '25+', icon: Heart },
    { label: 'Years of Trust', value: '5+', icon: Clock },
  ];

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center bg-gradient-to-br from-orange-50 via-red-50 to-purple-50 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-purple-500/10" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Soko Smart
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              Kenya's comprehensive digital platform for all your daily needs
            </p>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Shop online, book rides, hire services, and find properties - all in one trusted platform
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3">
                    Get Started Today
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-3">
                  Learn More
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Services Grid */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Service</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive range of services designed to make your life easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Link key={service.id} to={service.link} className="group">
                <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${service.color}`} />
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${service.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl group-hover:text-orange-600 transition-colors">
                          {service.title}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full bg-gradient-to-r ${service.color} ${service.hoverColor} text-white transition-all duration-300 group-hover:scale-105`}
                      size="lg"
                    >
                      Explore {service.title}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-orange-500" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-orange-500 to-red-600 text-white p-12 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers across Kenya and experience the convenience of Soko Smart
          </p>
          {!user ? (
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
                Sign Up Now - It's Free!
              </Button>
            </Link>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {services.map((service) => (
                <Link key={service.id} to={service.link}>
                  <Button variant="secondary" className="px-6 py-2">
                    Go to {service.title}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
