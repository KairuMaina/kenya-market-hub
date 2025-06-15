import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Search, ShieldCheck, Truck } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Soko Smart
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your one-stop platform for e-commerce, real estate, transportation, and services.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => navigate('/shop')}>
              Explore Shop
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/real-estate')}>
              Find a Property
            </Button>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* E-commerce Card */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <span>E-commerce</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Buy and sell products online with ease.
              </p>
              <Button size="sm" onClick={() => navigate('/shop')}>
                Shop Now
              </Button>
            </CardContent>
          </Card>

          {/* Real Estate Card */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Building className="h-5 w-5 text-green-500" />
                <span>Real Estate</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Find your dream home or investment property.
              </p>
              <Button size="sm" onClick={() => navigate('/real-estate')}>
                Find Properties
              </Button>
            </CardContent>
          </Card>

          {/* Transportation Card */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Truck className="h-5 w-5 text-orange-500" />
                <span>Transportation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Book rides and transportation services.
              </p>
              <Button size="sm" onClick={() => navigate('/rides')}>
                Book a Ride
              </Button>
            </CardContent>
          </Card>

          {/* Services Card */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-purple-500" />
                <span>Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Access a variety of professional services.
              </p>
              <Button size="sm" onClick={() => navigate('/services')}>
                Explore Services
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Search Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Find What You Need
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Use our powerful search tools to quickly locate products, properties, and services.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" onClick={() => navigate('/search')}>
              <Search className="h-4 w-4 mr-2" />
              Quick Search
            </Button>
            <Button variant="secondary" onClick={() => navigate('/advanced-search')}>
              Advanced Search
            </Button>
          </div>
        </section>

        {/* Service Provider Section */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Become a Service Provider
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our network of trusted vendors, drivers, and property owners.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vendor Card */}
            <Card className="bg-orange-50 shadow-md hover:shadow-lg transition-shadow duration-300 border-orange-200">
              <CardHeader>
                <CardTitle className="text-center text-xl font-semibold text-orange-800">
                  Vendor
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Sell your products to a wider audience.
                </p>
                <Button variant="outline" onClick={() => navigate('/vendor-dashboard')}>
                  Apply Now
                </Button>
              </CardContent>
            </Card>

            {/* Driver Card */}
            <Card className="bg-blue-50 shadow-md hover:shadow-lg transition-shadow duration-300 border-blue-200">
              <CardHeader>
                <CardTitle className="text-center text-xl font-semibold text-blue-800">
                  Driver
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Provide transportation services and earn money.
                </p>
                <Button variant="outline" onClick={() => navigate('/vendor-dashboard')}>
                  Apply Now
                </Button>
              </CardContent>
            </Card>

            {/* Property Owner Card */}
            <Card className="bg-green-50 shadow-md hover:shadow-lg transition-shadow duration-300 border-green-200">
              <CardHeader>
                <CardTitle className="text-center text-xl font-semibold text-green-800">
                  Property Owner
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Manage and rent out your properties with ease.
                </p>
                <Button variant="outline" onClick={() => navigate('/vendor-dashboard')}>
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </div>
          {/* Add a "Access Your Apps" button in the service provider section */}
          <div className="text-center mt-8">
            <Button
              onClick={() => navigate('/service-provider-hub')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              Access Service Provider Apps
            </Button>
            <p className="text-gray-600 mt-2 text-sm">
              Already approved? Access your dedicated service provider interface
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
