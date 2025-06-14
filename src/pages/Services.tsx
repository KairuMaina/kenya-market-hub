
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Zap, Droplets, Hammer, Star, Clock, Shield, Phone } from 'lucide-react';
import MainLayout from '@/components/MainLayout';

const Services = () => {
  const serviceCategories = [
    {
      category: 'Electrical',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      services: ['Wiring', 'Appliance Repair', 'Lighting Installation']
    },
    {
      category: 'Plumbing',
      icon: Droplets,
      color: 'from-blue-500 to-cyan-500',
      services: ['Pipe Repair', 'Bathroom Fixtures', 'Water Heater Service']
    },
    {
      category: 'Carpentry',
      icon: Hammer,
      color: 'from-amber-500 to-orange-600',
      services: ['Furniture Repair', 'Custom Cabinets', 'Door Installation']
    },
    {
      category: 'General Repairs',
      icon: Wrench,
      color: 'from-green-500 to-emerald-500',
      services: ['Home Maintenance', 'Appliance Service', 'Handyman Services']
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center py-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Soko Smart Services
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Connect with skilled technicians for all your home and office repair needs
          </p>
          <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-3">
            <Wrench className="mr-2 h-5 w-5" />
            Find a Technician
          </Button>
        </section>

        {/* Service Categories */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Service Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {category.services.map((service, idx) => (
                      <li key={idx} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        {service}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600">
                    Book Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: 'Verified Technicians', desc: 'All service providers are background checked' },
            { icon: Clock, title: 'Quick Response', desc: '24/7 availability for urgent repairs' },
            { icon: Star, title: 'Quality Guarantee', desc: 'Satisfaction guaranteed or money back' }
          ].map((feature, index) => (
            <Card key={index} className="text-center p-6">
              <feature.icon className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </Card>
          ))}
        </section>

        {/* Coming Soon Notice */}
        <section className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Coming Soon!</h2>
          <p className="text-lg mb-6 opacity-90">
            Our technician marketplace is launching soon. Get ready to find skilled professionals in your area!
          </p>
          <Button variant="secondary" size="lg" className="px-8 py-3">
            <Phone className="mr-2 h-5 w-5" />
            Join Waiting List
          </Button>
        </section>
      </div>
    </MainLayout>
  );
};

export default Services;
