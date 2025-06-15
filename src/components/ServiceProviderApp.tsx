
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useServiceProviderProfile } from '@/hooks/useServiceProviders';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  Zap, 
  Paintbrush, 
  Hammer, 
  Scissors, 
  Stethoscope, 
  GraduationCap, 
  Camera, 
  Utensils,
  Calendar,
  Users,
  DollarSign,
  BarChart3
} from 'lucide-react';

interface ServiceProviderAppProps {
  serviceType: string;
}

const ServiceProviderApp: React.FC<ServiceProviderAppProps> = ({ serviceType }) => {
  const { user, loading } = useAuth();
  const { data: profile, isLoading } = useServiceProviderProfile(serviceType);

  const getServiceInfo = (type: string) => {
    const serviceMap: Record<string, { icon: any; title: string; color: string }> = {
      plumber: { icon: Wrench, title: 'Plumber Dashboard', color: 'blue' },
      electrician: { icon: Zap, title: 'Electrician Dashboard', color: 'yellow' },
      painter: { icon: Paintbrush, title: 'Painter Dashboard', color: 'green' },
      carpenter: { icon: Hammer, title: 'Carpenter Dashboard', color: 'amber' },
      barber: { icon: Scissors, title: 'Barber Dashboard', color: 'pink' },
      doctor: { icon: Stethoscope, title: 'Doctor Dashboard', color: 'red' },
      tutor: { icon: GraduationCap, title: 'Tutor Dashboard', color: 'indigo' },
      photographer: { icon: Camera, title: 'Photography Dashboard', color: 'gray' },
      caterer: { icon: Utensils, title: 'Catering Dashboard', color: 'emerald' }
    };
    return serviceMap[type] || { icon: Wrench, title: 'Service Dashboard', color: 'blue' };
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile || profile.verification_status !== 'approved') {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              Service Provider Access Required
            </h2>
            <p className="text-blue-700 mb-4">
              You need to apply and be approved as a {getServiceInfo(serviceType).title.toLowerCase()} to access this dashboard.
            </p>
            <Button onClick={() => window.location.href = '/vendor-dashboard'}>
              Apply Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const serviceInfo = getServiceInfo(serviceType);
  const ServiceIcon = serviceInfo.icon;

  const quickStats = [
    { title: 'Active Jobs', value: '3', icon: Calendar },
    { title: 'Total Clients', value: '24', icon: Users },
    { title: 'This Month', value: 'KSH 35,000', icon: DollarSign },
    { title: 'Rating', value: '4.8', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`bg-gradient-to-r from-${serviceInfo.color}-500 to-${serviceInfo.color}-600 text-white p-6 rounded-lg shadow-lg`}>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ServiceIcon className="h-8 w-8" />
            {serviceInfo.title}
          </h1>
          <p className="text-white/90 mt-2">
            Welcome back! Manage your services and grow your business
          </p>
          <div className="mt-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {profile?.business_name}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-${serviceInfo.color}-100`}>
                    <stat.icon className={`h-6 w-6 text-${serviceInfo.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Job #{item.toString().padStart(3, '0')}</p>
                      <p className="text-sm text-gray-600">Client {item}</p>
                    </div>
                    <Badge variant="outline">
                      {item === 1 ? 'In Progress' : item === 2 ? 'Scheduled' : 'Completed'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Client {item}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      "Great service and professional work!"
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderApp;
