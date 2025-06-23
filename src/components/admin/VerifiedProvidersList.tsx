
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, UserCheck } from 'lucide-react';

interface MedicalProvider {
  id: string;
  full_name: string;
  provider_type: string;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
}

interface VerifiedProvidersListProps {
  providers: MedicalProvider[];
}

const VerifiedProvidersList: React.FC<VerifiedProvidersListProps> = ({ providers }) => {
  if (providers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verified Providers</CardTitle>
          <CardDescription>Currently active medical providers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No verified providers found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verified Providers</CardTitle>
        <CardDescription>Currently active medical providers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <div key={provider.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg truncate">{provider.full_name}</h3>
                  <div className="flex gap-1">
                    {provider.is_verified && (
                      <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                        Verified
                      </Badge>
                    )}
                    {provider.is_active && (
                      <Badge variant="secondary" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 capitalize">{provider.provider_type}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Rating: <span className="font-medium">{provider.rating.toFixed(1)}/5</span>
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VerifiedProvidersList;
