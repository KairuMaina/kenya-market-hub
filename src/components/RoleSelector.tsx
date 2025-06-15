
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Store, Building } from 'lucide-react';
import { useRoleRedirection } from '@/hooks/useRoleRedirection';

const RoleSelector = () => {
  const navigate = useNavigate();
  const { getAvailableApps, hasMultipleRoles } = useRoleRedirection();
  const availableApps = getAvailableApps();

  const getIcon = (color: string) => {
    switch (color) {
      case 'blue': return <Car className="h-8 w-8" />;
      case 'orange': return <Store className="h-8 w-8" />;
      case 'green': return <Building className="h-8 w-8" />;
      default: return <Store className="h-8 w-8" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return {
        bg: 'bg-blue-500',
        hover: 'hover:bg-blue-600',
        from: 'from-blue-500',
        to: 'to-indigo-600'
      };
      case 'orange': return {
        bg: 'bg-orange-500',
        hover: 'hover:bg-orange-600',
        from: 'from-orange-500',
        to: 'to-red-600'
      };
      case 'green': return {
        bg: 'bg-green-500',
        hover: 'hover:bg-green-600',
        from: 'from-green-500',
        to: 'to-emerald-600'
      };
      default: return {
        bg: 'bg-gray-500',
        hover: 'hover:bg-gray-600',
        from: 'from-gray-500',
        to: 'to-gray-600'
      };
    }
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
    <div className="max-w-4xl mx-auto mt-8 p-4">
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
