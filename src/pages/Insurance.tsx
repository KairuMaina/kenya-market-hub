
import React, { useState } from 'react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import HeroSection from '@/components/shared/HeroSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Car, 
  Home, 
  Heart, 
  Briefcase, 
  Users, 
  Phone, 
  Mail, 
  Award,
  CheckCircle,
  Star,
  ArrowRight,
  Calculator
} from 'lucide-react';

const Insurance: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const insuranceTypes = [
    {
      id: 'motor',
      title: 'Motor Insurance',
      icon: Car,
      description: 'Comprehensive coverage for your vehicle',
      features: ['Third Party', 'Comprehensive', 'Fire & Theft'],
      color: 'blue'
    },
    {
      id: 'home',
      title: 'Home Insurance',
      icon: Home,
      description: 'Protect your property and belongings',
      features: ['Building Cover', 'Contents Cover', 'Personal Liability'],
      color: 'green'
    },
    {
      id: 'health',
      title: 'Health Insurance',
      icon: Heart,
      description: 'Medical coverage for you and your family',
      features: ['Inpatient', 'Outpatient', 'Maternity', 'Dental'],
      color: 'red'
    },
    {
      id: 'business',
      title: 'Business Insurance',
      icon: Briefcase,
      description: 'Coverage for your business operations',
      features: ['Public Liability', 'Professional Indemnity', 'Property'],
      color: 'purple'
    },
    {
      id: 'travel',
      title: 'Travel Insurance',
      icon: Users,
      description: 'Peace of mind while traveling',
      features: ['Medical Emergency', 'Trip Cancellation', 'Baggage'],
      color: 'orange'
    },
    {
      id: 'life',
      title: 'Life Insurance',
      icon: Shield,
      description: 'Financial security for your loved ones',
      features: ['Term Life', 'Whole Life', 'Education Cover'],
      color: 'indigo'
    }
  ];

  const providers = [
    {
      id: 'britam',
      name: 'Britam Insurance',
      logo: '/providers/britam.png',
      rating: 4.5,
      features: ['24/7 Support', 'Online Claims', 'Mobile App'],
      specialties: ['Motor', 'Health', 'Life'],
      contactInfo: {
        phone: '+254 711 066 000',
        email: 'info@britam.com'
      }
    },
    {
      id: 'jubilee',
      name: 'Jubilee Insurance',
      logo: '/providers/jubilee.png',
      rating: 4.3,
      features: ['Quick Claims', 'Branch Network', 'Corporate Plans'],
      specialties: ['Health', 'Motor', 'Travel'],
      contactInfo: {
        phone: '+254 20 328 8000',
        email: 'customercare@jubileeinsurance.com'
      }
    },
    {
      id: 'aar',
      name: 'AAR Insurance',
      logo: '/providers/aar.png',
      rating: 4.4,
      features: ['Health Facilities', 'Cashless Treatment', 'Emergency'],
      specialties: ['Health', 'Travel', 'Group'],
      contactInfo: {
        phone: '+254 20 272 7400',
        email: 'info@aar-insurance.ke'
      }
    },
    {
      id: 'oldmutual',
      name: 'Old Mutual',
      logo: '/providers/oldmutual.png',
      rating: 4.2,
      features: ['Investment Plans', 'Retirement', 'Savings'],
      specialties: ['Life', 'Investment', 'Pension'],
      contactInfo: {
        phone: '+254 20 286 6000',
        email: 'service@oldmutual.co.ke'
      }
    }
  ];

  const handleGetQuote = (provider: any) => {
    setSelectedProvider(provider);
    setIsQuoteModalOpen(true);
  };

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <HeroSection
          title="Insurance Solutions"
          subtitle="Protect what matters most to you"
          description="Compare and choose from Kenya's leading insurance providers"
          imageUrl="photo-1551288049-bebda4e38f71"
          className="mb-8"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Insurance Types Section */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Insurance Coverage</h2>
              <p className="text-lg text-gray-600">Choose the right protection for your needs</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insuranceTypes.map((type) => {
                const TypeIcon = type.icon;
                return (
                  <Card key={type.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-300">
                    <CardHeader className="text-center pb-4">
                      <div className={`mx-auto p-4 rounded-full bg-${type.color}-100 w-16 h-16 flex items-center justify-center mb-4`}>
                        <TypeIcon className={`h-8 w-8 text-${type.color}-600`} />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{type.title}</CardTitle>
                      <CardDescription className="text-gray-600">{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {type.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className={`h-4 w-4 text-${type.color}-500`} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className={`w-full bg-gradient-to-r from-${type.color}-500 to-${type.color}-600 hover:from-${type.color}-600 hover:to-${type.color}-700 text-white`}>
                        <Calculator className="h-4 w-4 mr-2" />
                        Get Quote
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Insurance Providers Section */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted Insurance Partners</h2>
              <p className="text-lg text-gray-600">Leading insurance companies in Kenya</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {providers.map((provider) => (
                <Card key={provider.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-600">{provider.name.split(' ')[0]}</span>
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-900">{provider.name}</CardTitle>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < Math.floor(provider.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">({provider.rating})</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        <Award className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {provider.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                      <ul className="space-y-1">
                        {provider.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-blue-500" />
                        <span>{provider.contactInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <span className="truncate">{provider.contactInfo.email}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-blue-200 hover:bg-blue-50 text-blue-600"
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleGetQuote(provider)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                      >
                        Get Quote
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Quote Section */}
          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Get a Quick Quote</h2>
              <p className="text-blue-100">Compare insurance plans in minutes</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Your Name"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
                <Input
                  placeholder="Phone Number"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
              </div>
              <Input
                placeholder="Email Address"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                Get Free Quote
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </section>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Insurance;
