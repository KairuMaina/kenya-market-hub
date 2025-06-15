import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Store, Building } from 'lucide-react';
import { useRoleRedirection } from '@/hooks/useRoleRedirection';
import { useMyVendorProfile } from '@/hooks/useVendors';
import { useServiceProviderProfile } from '@/hooks/useServiceProviders';

const RoleSelector = () => {
  const navigate = useNavigate();
  const { getAvailableApps, hasMultipleRoles } = useRoleRedirection();
  const { data: vendorProfile } = useMyVendorProfile();
  const { data: driverProfile } = useServiceProviderProfile('driver');
  const { data: propertyProfile } = useServiceProviderProfile('property_owner');
  
  // Get all service provider profiles
  const { data: plumberProfile } = useServiceProviderProfile('plumber');
  const { data: electricianProfile } = useServiceProviderProfile('electrician');
  const { data: painterProfile } = useServiceProviderProfile('painter');
  const { data: carpenterProfile } = useServiceProviderProfile('carpenter');
  const { data: barberProfile } = useServiceProviderProfile('barber');
  const { data: doctorProfile } = useServiceProviderProfile('doctor');
  const { data: tutorProfile } = useServiceProviderProfile('tutor');
  const { data: photographerProfile } = useServiceProviderProfile('photographer');
  const { data: catererProfile } = useServiceProviderProfile('caterer');

  const getAllAvailableApps = () => {
    const apps = [];
    
    // Core service provider apps
    if (vendorProfile?.verification_status === 'approved') {
      apps.push({ 
        name: 'Vendor Portal', 
        path: '/vendor', 
        description: 'Manage products and sales',
        color: 'orange'
      });
    }
    
    if (driverProfile?.verification_status === 'approved') {
      apps.push({ 
        name: 'Driver App', 
        path: '/driver', 
        description: 'Manage rides and earnings',
        color: 'blue'
      });
    }
    
    if (propertyProfile?.verification_status === 'approved') {
      apps.push({ 
        name: 'Property Management', 
        path: '/property-owner', 
        description: 'Manage properties and inquiries',
        color: 'green'
      });
    }

    // Other service provider types
    const serviceProviders = [
      { profile: plumberProfile, name: 'Plumber Dashboard', path: '/service/plumber', color: 'blue' },
      { profile: electricianProfile, name: 'Electrician Dashboard', path: '/service/electrician', color: 'yellow' },
      { profile: painterProfile, name: 'Painter Dashboard', path: '/service/painter', color: 'green' },
      { profile: carpenterProfile, name: 'Carpenter Dashboard', path: '/service/carpenter', color: 'amber' },
      { profile: barberProfile, name: 'Barber Dashboard', path: '/service/barber', color: 'pink' },
      { profile: doctorProfile, name: 'Doctor Dashboard', path: '/service/doctor', color: 'red' },
      { profile: tutorProfile, name: 'Tutor Dashboard', path: '/service/tutor', color: 'indigo' },
      { profile: photographerProfile, name: 'Photography Dashboard', path: '/service/photographer', color: 'gray' },
      { profile: catererProfile, name: 'Catering Dashboard', path: '/service/caterer', color: 'emerald' }
    ];

    serviceProviders.forEach(service => {
      if (service.profile?.verification_status === 'approved') {
        apps.push({
          name: service.name,
          path: service.path,
          description: 'Manage jobs and clients',
          color: service.color
        });
      }
    });
    
    return apps;
  };

  const availableApps = getAllAvailableApps();

  const getIcon = (color: string) => {
    switch (color) {
      case 'blue': return <Car className="h-8 w-8" />;
      case 'orange': return <Store className="h-8 w-8" />;
      case 'green': return <Building className="h-8 w-8" />;
      default: return <Store className="h-8 w-8" />;
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, any> = {
      blue: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', from: 'from-blue-500', to: 'to-indigo-600' },
      orange: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', from: 'from-orange-500', to: 'to-red-600' },
      green: { bg: 'bg-green-500', hover: 'hover:bg-green-600', from: 'from-green-500', to: 'to-emerald-600' },
      yellow: { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', from: 'from-yellow-500', to: 'to-orange-500' },
      amber: { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', from: 'from-amber-500', to: 'to-orange-600' },
      pink: { bg: 'bg-pink-500', hover: 'hover:bg-pink-600', from: 'from-pink-500', to: 'to-rose-600' },
      red: { bg: 'bg-red-500', hover: 'hover:bg-red-600', from: 'from-red-500', to: 'to-pink-600' },
      indigo: { bg: 'bg-indigo-500', hover: 'hover:bg-indigo-600', from: 'from-indigo-500', to: 'to-purple-600' },
      gray: { bg: 'bg-gray-500', hover: 'hover:bg-gray-600', from: 'from-gray-500', to: 'to-slate-600' },
      emerald: { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', from: 'from-emerald-500', to: 'to-green-600' }
    };
    return colorMap[color] || colorMap.gray;
  };

  if (availableApps.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              No Service Provider Access
            </h2>
            <p className="text-yellow-700 mb-4">
              You don't have access to any service provider applications yet. 
              Apply to become a service provider to access specialized tools.
            </p>
            <Button 
              onClick={() => navigate('/vendor-dashboard')}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Apply as Service Provider
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (availableApps.length === 1) {
    // Auto-redirect for single role users
    const app = availableApps[0];
    navigate(app.path);
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Application</h1>
        <p className="text-gray-600">You have access to multiple service provider applications</p>
        <Badge variant="outline" className="mt-2">
          {availableApps.length} Apps Available
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableApps.map((app, index) => {
          const colors = getColorClasses(app.color);
          
          return (
            <Card 
              key={index} 
              className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0"
              onClick={() => navigate(app.path)}
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${colors.from} ${colors.to} rounded-lg flex items-center justify-center text-white mb-3 mx-auto`}>
                  {getIcon(app.color)}
                </div>
                <CardTitle className="text-center">{app.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">{app.description}</p>
                <Button 
                  className={`w-full ${colors.bg} ${colors.hover} text-white`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(app.path);
                  }}
                >
                  Open {app.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mr-4"
        >
          Back to Home
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/vendor-dashboard')}
        >
          Manage Applications
        </Button>
      </div>
    </div>
  );
};

export default RoleSelector;
